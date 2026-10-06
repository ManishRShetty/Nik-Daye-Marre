import { NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';
import { LOCATIONS } from '@/lib/constants';

// Use the new Google Gen AI SDK
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      console.warn("No GEMINI_API_KEY found, returning mock response.");
      return NextResponse.json({
        reply: "I've logged a high-priority maintenance request (Mock). Add GEMINI_API_KEY to .env to use real AI.",
        action: {
          intent: "CREATE_TICKET",
          department: "Maintenance",
          priority: "Urgent",
          location_id: "LAB_3"
        }
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: `You are an AI assistant for a smart campus. User says: "${message}". 
      Identify the intent, department, priority, and map the location to one of these valid location_ids: ${Object.keys(LOCATIONS).join(', ')}. 
      Respond strictly in the required JSON format.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: { type: Type.STRING, description: "A friendly reply to the user" },
            action: {
              type: Type.OBJECT,
              properties: {
                intent: { type: Type.STRING },
                department: { type: Type.STRING },
                priority: { type: Type.STRING },
                location_id: { type: Type.STRING, description: `Must be one of: ${Object.keys(LOCATIONS).join(', ')}` }
              },
              required: ["intent", "department", "priority", "location_id"]
            }
          },
          required: ["reply", "action"]
        }
      }
    });

    if (!response.text) {
      throw new Error("Empty response from AI");
    }

    const data = JSON.parse(response.text);
    return NextResponse.json(data);
  } catch (error) {
    console.error("API Agent Error:", error);
    return NextResponse.json(
      { error: "Failed to process request" }, 
      { status: 500 }
    );
  }
}
