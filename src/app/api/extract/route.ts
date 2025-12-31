import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `You are an expert Data Extraction AI. Your job is to look at the provided image (which contains a table, invoice, or financial document) and extract the data into a strict JSON format.

RULES:
1. Identify the headers of the table. If no headers exist, generate logical ones (e.g., "Item", "Quantity", "Price").
2. Return a JSON Object with two keys:
   - "headers": ["Column A", "Column B"...]
   - "rows": [ {"Column A": "Value", "Column B": "Value"}, ... ]
3. If a cell is handwritten and unclear, make your best guess but flag it with a suffix "[?]" in the text.
4. Do not include markdown formatting (like \`\`\`json). Return raw JSON only.
5. If the image is not a table, return an error object: {"error": "No table detected"}.`;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured. Please add GOOGLE_GENERATIVE_AI_API_KEY to your .env.local file." },
        { status: 500 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString("base64");
    const mimeType = file.type;

    // Initialize Google Generative AI
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Prepare the image part
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: mimeType,
      },
    };

    // Generate content with the system prompt and image
    const result = await model.generateContent([
      SYSTEM_PROMPT,
      imagePart,
    ]);

    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    try {
      // Clean the response - remove any markdown formatting if present
      let cleanedText = text.trim();
      if (cleanedText.startsWith("```json")) {
        cleanedText = cleanedText.slice(7);
      }
      if (cleanedText.startsWith("```")) {
        cleanedText = cleanedText.slice(3);
      }
      if (cleanedText.endsWith("```")) {
        cleanedText = cleanedText.slice(0, -3);
      }
      cleanedText = cleanedText.trim();

      const data = JSON.parse(cleanedText);

      // Validate the response structure
      if (data.error) {
        return NextResponse.json({ error: data.error }, { status: 400 });
      }

      if (!data.headers || !data.rows) {
        return NextResponse.json(
          { error: "Invalid response structure from AI" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          headers: data.headers,
          rows: data.rows,
        },
      });
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.error("Raw response:", text);
      return NextResponse.json(
        { error: "Failed to parse AI response. The image might not contain a valid table." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("API error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to process image: ${errorMessage}` },
      { status: 500 }
    );
  }
}
