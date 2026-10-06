import { NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';
import { LOCATIONS } from '@/lib/constants';

// We don't instantiate globally to prevent crashes if the API key is missing
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

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const modelsToTry = ['gemini-3.1-pro-preview', 'gemini-2.5-flash'];
    let lastError = null;

    for (const modelName of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
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

        if (response.text) {
          const data = JSON.parse(response.text);
          return NextResponse.json(data); // Success! Return immediately.
        }
      } catch (error: any) {
        console.warn(`Model ${modelName} failed:`, error.message);
        lastError = error;
        // Continue to the next model in the array
      }
    }

    // If we reach here, ALL AI models failed (quota exceeded, invalid key, etc)
    console.error("All AI models failed, using intelligent heuristic fallback.");
    
    const lowerMsg = message.toLowerCase();
    let foundLocation = "LAB_3"; // Default
    for (const loc of Object.keys(LOCATIONS)) {
      if (lowerMsg.includes(loc.toLowerCase().replace('_', ' '))) {
        foundLocation = loc;
        break;
      }
    }

    return NextResponse.json({
      reply: "AI is currently offline due to rate limits. I have used a fallback system to find your location.",
      action: {
        intent: "NAVIGATE",
        department: "Fallback",
        priority: "Normal",
        location_id: foundLocation
      }
    });

  } catch (error: any) {
    console.error("API Agent Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process request" }, 
      { status: 500 }
    );
  }
}
