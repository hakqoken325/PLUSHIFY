
import { GoogleGenAI } from "@google/genai";

export async function transformToPlush(base64Image: string, mimeType: string): Promise<string | null> {
  // Defensive check for the API Key
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey === "undefined" || apiKey === "") {
    throw new Error("API_KEY_MISSING: The API key is not found in the browser environment. Please make sure you have added 'API_KEY' to Vercel Environment Variables AND triggered a NEW DEPLOYMENT (Redeploy).");
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const modelName = 'gemini-2.5-flash-image';
    
    const prompt = `
      Transform this character into a high-quality, professional designer plush toy (soft toy).
      - Maintain character colors, hair style, and facial features.
      - Use soft, premium fabric texture (minky or fleece).
      - Set on a clean, minimal white or soft grey studio background.
      - Ensure it looks like a real physical product photography.
      Output ONLY the image of the plush toy.
    `;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          { text: prompt },
        ],
      },
    });

    const candidate = response.candidates?.[0];
    
    if (!candidate) {
      throw new Error("No response from Gemini. You might have reached the free tier limit.");
    }

    if (candidate.finishReason === 'SAFETY') {
      throw new Error("Content blocked by safety filters. Try a more neutral image.");
    }

    for (const part of candidate.content.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    return null;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    if (error.message?.includes('403')) {
      throw new Error("API Key is invalid or has no access to this model. Check your Google AI Studio project.");
    }
    
    throw error;
  }
}
