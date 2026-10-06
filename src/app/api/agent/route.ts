export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';
import { LOCATIONS } from '@/lib/constants';

// We don't instantiate globally to prevent crashes if the API key is missing
export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    const lowerMsg = (message || '').toLowerCase();
    let detectedPriority = "Medium";
    if (lowerMsg.includes("urgent") || lowerMsg.includes("emergency") || lowerMsg.includes("leak") || lowerMsg.includes("fire") || lowerMsg.includes("broken") || lowerMsg.includes("asap") || lowerMsg.includes("danger") || lowerMsg.includes("immediate")) {
      detectedPriority = "Urgent";
    } else if (lowerMsg.includes("high") || lowerMsg.includes("important") || lowerMsg.includes("quick")) {
      detectedPriority = "High";
    }

    if (!process.env.GEMINI_API_KEY) {
      console.warn("No GEMINI_API_KEY found, returning mock response.");
      return NextResponse.json({
        reply: `I've logged a ${detectedPriority.toLowerCase()}-priority request. Add GEMINI_API_KEY to .env to use real AI.`,
        action: {
          intent: "CREATE_TICKET",
          department: "Maintenance",
          priority: detectedPriority,
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
          contents: `You are an AI assistant for a smart campus support platform. User request: "${message}". 
          Identify the intent, department, priority level, and map the location to one of these valid location_ids: ${Object.keys(LOCATIONS).join(', ')}. 
          
          Priority Rules:
          - If the issue mentions urgent, emergency, water leak, fire, dangerous, broken equipment, immediate help, or critical system down, set priority to "Urgent".
          - If it's an important issue needed soon, set priority to "High".
          - Standard issues default to "Medium" or "Low".

          Respond strictly in the required JSON format.`,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                reply: { type: Type.STRING, description: "A helpful confirmation reply to the user" },
                action: {
                  type: Type.OBJECT,
                  properties: {
                    intent: { type: Type.STRING },
                    department: { type: Type.STRING },
                    priority: { type: Type.STRING, description: "Must be one of: Urgent, High, Medium, Low" },
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
      }
    }

    // Fallback if AI models fail
    console.error("All AI models failed, using intelligent heuristic fallback.");
    
    let foundLocation = "LAB_3"; // Default
    for (const loc of Object.keys(LOCATIONS)) {
      if (lowerMsg.includes(loc.toLowerCase().replace('_', ' '))) {
        foundLocation = loc;
        break;
      }
    }

    return NextResponse.json({
      reply: `Ticket processed with ${detectedPriority} priority. I have located your issue on the campus map.`,
      action: {
        intent: "CREATE_TICKET",
        department: "General",
        priority: detectedPriority,
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
