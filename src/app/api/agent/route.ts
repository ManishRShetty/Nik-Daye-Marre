import { GoogleGenAI, Type, Schema } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    coordinates: {
      type: Type.ARRAY,
      items: { type: Type.NUMBER },
      description: "The [x, y, z] coordinates of the location mentioned.",
    },
    intent: {
      type: Type.STRING,
      description: "A short description of what the user wants to do or see.",
    },
  },
  required: ["coordinates", "intent"],
};

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        systemInstruction: `You are an agentic spatial intelligence guiding a user through a 3D campus map.
The user will ask to navigate to a location or express an intent.
You must map their request to a plausible [x, y, z] coordinate on the campus map and describe the intent.

Here are some known locations on the campus:
- Library: [10, 5, -20]
- Cafeteria: [-15, 2, 10]
- Dorms: [20, 0, 15]
- Gym: [0, 0, -30]
- Main Gate: [0, 0, 0]
- Computer Science Building: [-10, 8, -10]

If the user asks for a location not explicitly listed, extrapolate a reasonable coordinate within the bounds of [-30, 0, -30] to [30, 10, 30].`,
      }
    });
    
    return Response.json(JSON.parse(response.text));
  } catch (error) {
    console.error('Agent API Error:', error);
    return Response.json({ error: "Failed to process agentic request" }, { status: 500 });
  }
}
