import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { days, interests, budget } = await req.json();

    // Initialize Gemini client
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

    // Pick the model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Generate content
    const result = await model.generateContent(
      `Create a ${days}-day itinerary in Ethiopia based on these interests: ${interests.join(
        ", "
      )}. Budget: ${budget}.`
    );

    // Get text output
    const itinerary = result.response.text();

    return NextResponse.json({ itinerary });
  } catch (err: any) {
    console.error("Gemini error:", err);
    return NextResponse.json(
      { error: "Failed to generate itinerary" },
      { status: 500 }
    );
  }
}
