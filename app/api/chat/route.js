import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
    "AIzaSyDNWii5DoKOjnBdci9BOc-92pb0HtyyDpM"
);

export async function POST(request) {
  try {
    const {
      message,
      fileUri,
      fileName,
      mimeType,
      conversationHistory,
      documentContext,
    } = await request.json();

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Build the conversation context
    let prompt = "";

    if (documentContext) {
      prompt += `\nHere is the extracted information from the document:\n${JSON.stringify(
        documentContext,
        null,
        2
      )}\n\n`;
    }

    prompt += `User question: ${message}\n\nPlease provide a helpful response based on the uploaded document${
      fileName ? ` (${fileName})` : ""
    } and the conversation context. Be concise and accurate.`;

    // Create the content array for generateContent
    const contentArray = [];
    console.log("fileUri:", fileUri);
    console.log(1);

    // Add the file reference if available
    if (fileUri) {
      contentArray.push({
        fileData: {
          fileUri: fileUri,
          mimeType: mimeType || "application/pdf", // Use provided mime type or default to PDF
        },
      });
    }
    console.log(2);

    // Add the text prompt
    contentArray.push({ text: prompt });
    console.log(3);
    console.log("contentArray:", contentArray);

    // Generate response
    const result = await model.generateContent(contentArray);
    console.log(4);
    console.log("result:", result);
    const response = await result.response;
    console.log(5);
    console.log("response:", response);
    const text = response.text();
    // Add current user question and Gemini answer to conversationHistory
    if (conversationHistory) {
      conversationHistory.push(
        { role: "user", parts: [message] },
        { role: "model", parts: [text] }
      );
    }
    console.log(conversationHistory)
    console.log("Generated text:", text);

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error("Gemini API error:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
