import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export async function POST(request) {
  try {
    const { message, fileUri, fileName, mimeType, conversationHistory } = await request.json();

    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Build the conversation context
    let prompt = '';
    
    if (conversationHistory && conversationHistory.length > 0) {
      prompt += 'Previous conversation:\n';
      conversationHistory.forEach((msg) => {
        prompt += `${msg.type === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
      });
      prompt += '\n';
    }
    
    prompt += `User question: ${message}\n\nPlease provide a helpful response based on the uploaded document${fileName ? ` (${fileName})` : ''} and the conversation context. Be concise and accurate.`;

    // Create the content array for generateContent
    const contentArray = [];
    
    // Add the file reference if available
    if (fileUri) {
      contentArray.push({
        fileData: {
          fileUri: fileUri,
          mimeType: mimeType || "application/pdf" // Use provided mime type or default to PDF
        }
      });
    }
    
    // Add the text prompt
    contentArray.push({ text: prompt });

    // Generate response
    const result = await model.generateContent(contentArray);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error('Gemini API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}
