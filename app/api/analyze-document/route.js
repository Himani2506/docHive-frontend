import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleAIFileManager } from '@google/generative-ai/server';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { writeFile } from 'fs/promises';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');
const fileManager = new GoogleAIFileManager(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    // Create a temporary file to upload to Gemini
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Create a temporary file path
    const tempDir = '/tmp';
    const tempFilePath = path.join(tempDir, `temp_${Date.now()}_${file.name}`);
    
    try {
      // Write the file to temporary location
      await writeFile(tempFilePath, buffer);

      // Upload the file to Gemini
      const uploadResponse = await fileManager.uploadFile(tempFilePath, {
        mimeType: file.type,
        displayName: file.name,
      });

      console.log(`Uploaded file ${uploadResponse.file.displayName} as: ${uploadResponse.file.name}`);

      // Get the generative model
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      // Analyze the document using the uploaded file
      const analysisPrompt = `
      Please analyze the uploaded document and provide:
      1. A concise summary (2-3 sentences)
      2. Key topics (3-5 main topics)
      3. Important entities (names, dates, amounts, organizations)
      4. Document type classification
      5. Main themes or subjects covered

      Please format your response as JSON with the following structure:
      {
        "summary": "...",
        "keyTopics": ["topic1", "topic2", ...],
        "extractedEntities": ["entity1", "entity2", ...],
        "documentType": "...",
        "themes": ["theme1", "theme2", ...]
      }
      `;

      const result = await model.generateContent([
        {
          fileData: {
            mimeType: uploadResponse.file.mimeType,
            fileUri: uploadResponse.file.uri
          }
        },
        { text: analysisPrompt }
      ]);

      const response = await result.response;
      const analysisText = response.text();

      // Clean up temporary file
      try {
        fs.unlinkSync(tempFilePath);
      } catch (cleanupError) {
        console.warn('Failed to cleanup temporary file:', cleanupError);
      }

      try {
        // Try to parse the JSON response
        const cleanJsonText = analysisText.replace(/```json\n?|\n?```/g, '').trim();
        const analysis = JSON.parse(cleanJsonText);
        
        return NextResponse.json({
          analysis: {
            title: file.name,
            summary: analysis.summary || 'Analysis completed successfully.',
            keyTopics: analysis.keyTopics || [],
            extractedEntities: analysis.extractedEntities || [],
            documentType: analysis.documentType || 'Unknown',
            themes: analysis.themes || [],
            fileUri: uploadResponse.file.uri,
            fileName: uploadResponse.file.displayName,
            mimeType: uploadResponse.file.mimeType
          }
        });
      } catch (parseError) {
        // If JSON parsing fails, provide a basic analysis
        return NextResponse.json({
          analysis: {
            title: file.name,
            summary: 'Document has been processed and is ready for analysis.',
            keyTopics: ['General Content'],
            extractedEntities: [],
            documentType: 'Text Document',
            themes: ['Document Analysis'],
            fileUri: uploadResponse.file.uri,
            fileName: uploadResponse.file.displayName,
            mimeType: uploadResponse.file.mimeType
          }
        });
      }

    } catch (uploadError) {
      console.error('File upload error:', uploadError);
      
      // Clean up temporary file if it exists
      try {
        fs.unlinkSync(tempFilePath);
      } catch (cleanupError) {
        console.warn('Failed to cleanup temporary file after error:', cleanupError);
      }
      
      return NextResponse.json(
        { error: 'Failed to upload file to Gemini' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Document analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze document' },
      { status: 500 }
    );
  }
}
