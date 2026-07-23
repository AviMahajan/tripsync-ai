import { GoogleGenAI } from "@google/genai";
import { firebaseService } from "../src/lib/firebase";
import { buildTravelCouncilPrompt } from "../src/prompts/travelCouncil";

// Initialize Gemini SDK
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Helper to call Gemini with retry
async function callGeminiWithRetry(prompt: string, retries = 3, delay = 1000): Promise<any> {
  try {
    return await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });
  } catch (error: any) {
    if (retries > 0 && (error.status === 503 || error.message?.includes('503'))) {
      console.warn(`Gemini service temporarily unavailable (503), retrying in ${delay}ms... Retries left: ${retries}`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return callGeminiWithRetry(prompt, retries - 1, delay * 2);
    }
    throw error;
  }
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { roomId } = req.body;
  if (!roomId) {
    return res.status(400).json({ error: "Missing required trip information." });
  }

  try {
    // 1. Read room and participant preferences from Firestore
    const room = await firebaseService.getRoomOnce(roomId);
    if (!room) {
      return res.status(404).json({ error: "Trip room not found." });
    }

    const participants = await firebaseService.getParticipantsOnce(roomId);
    if (!participants || participants.length === 0) {
      return res.status(400).json({ error: "No travelers found for this trip." });
    }

    // 2. Build the dynamic prompt using actual participant data
    const promptText = buildTravelCouncilPrompt(room as any, participants as any);

    // 3. Send request to Gemini with retry
    const response = await callGeminiWithRetry(promptText);

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error("Empty response received from the travel council AI.");
    }

    // 4. Validate JSON response
    let generatedData;
    try {
      generatedData = JSON.parse(textOutput);
    } catch (parseError) {
      console.error("JSON parse error on Gemini output:", textOutput);
      return res.status(502).json({ error: "The travel council returned an invalid format. Please try again." });
    }

    // Validate structure
    const requiredKeys = ["travelPersonas", "roundtable", "facilitatorSummary", "agreementScore", "whyThisPlan", "budgetEstimate", "itinerary"];
    for (const key of requiredKeys) {
      if (!(key in generatedData)) {
        console.error(`Invalid structure generated: missing '${key}' component.`);
        return res.status(502).json({ error: "The generated trip plan is incomplete. Please try again." });
      }
    }

    // If all is well, return the generated plan
    return res.status(200).json(generatedData);

  } catch (error: any) {
    console.error("Error in /api/generate-trip:", error);
    
    // Provide user-friendly error message
    if (error.status === 429) {
      return res.status(429).json({ error: "The travel council is currently busy. Please try again in a moment." });
    }
    if (error.status === 503 || error.status === 500) {
      return res.status(503).json({ error: "The travel council is experiencing temporary issues. Please try again later." });
    }

    return res.status(500).json({ error: "An unexpected error occurred while generating your trip. Please try again." });
  }
}
