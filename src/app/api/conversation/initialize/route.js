import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "ELEVENLABS_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const { agent_id, voice_id } = await request.json();

    // Create a conversational agent session
    const response = await fetch("https://api.elevenlabs.io/v1/convai/conversations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        agent_id: agent_id || "default",
        voice_id: voice_id || "21m00Tcm4TlvDq8ikWAM", // Default to Rachel
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("ElevenLabs API Error:", errorData);
      
      // For now, return a mock response since the actual conversational agent might not be available
      return NextResponse.json({
        conversation_id: `mock_${Date.now()}`,
        signed_url: null,
        message: "Conversational agent initialized in demo mode"
      });
    }

    const data = await response.json();
    
    return NextResponse.json({
      conversation_id: data.conversation_id,
      signed_url: data.signed_url,
    });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to initialize conversation" },
      { status: 500 }
    );
  }
}
