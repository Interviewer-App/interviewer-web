// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { NextResponse } from "next/server";

// export async function POST(request) {
//   try {
//     const { text } = await request.json();

//     if (!process.env.GOOGLE_API_KEY) {
//       return NextResponse.json(
//         { success: false, error: "GOOGLE_API_KEY is not configured" },
//         { status: 500 }
//       );
//     }

//     const ai = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

//     // For now, let's use a simple text generation model
//     // Note: Gemini TTS might not be available in the free tier
//     const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

//     const result = await model.generateContent(text);
//     const response = await result.response;
//     const generatedText = response.text();

//     // Since TTS might not be available, we'll return the generated text
//     // You can use Web Speech API on the client side for TTS
//     return NextResponse.json({
//       success: true,
//       text: generatedText,
//       message: "TTS not available in free tier, using text response"
//     });

//   } catch (error) {
//     console.error("API Error:", error);
//     return NextResponse.json(
//       { success: false, error: error.message || "Failed to generate content" },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      console.error("ELEVENLABS_API_KEY is not configured");
      return NextResponse.json(
        { success: false, error: "ELEVENLABS_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const { text, voice } = await request.json();

    if (!text || !voice) {
      return NextResponse.json(
        { success: false, error: "Text and voice parameters are required" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voice}`,
      {
        method: "POST",
        headers: {
          Accept: "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
        },
        body: JSON.stringify({
          text: text,
          model_id: "eleven_multilingual_v1",
          voice_settings: {
            stability: 0.75,
            similarity_boost: 0.75,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error from ElevenLabs API:", errorText);
      const errorMessage =
        errorText.detail?.message || "Failed to generate speech";
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }

    const audioBuffer = await response.arrayBuffer();
    const audioBase64 = Buffer.from(audioBuffer).toString("base64");

    return NextResponse.json({
      audio: audioBase64,
    });
  } catch (error) {
    console.error("API Error:", error);
    const errorMessage =
      typeof error === "object" && error !== null
        ? JSON.stringify(error)
        : error.message || "Failed to generate speech";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
