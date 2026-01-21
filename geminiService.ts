
import { GoogleGenAI } from "@google/genai";

export async function transformToPlush(base64Image: string, mimeType: string): Promise<string | null> {
  try {
    // Initializing with the environment key
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // gemini-2.5-flash-image is the standard for image-to-image tasks in the free/flash tier
    const modelName = 'gemini-2.5-flash-image';
    
    const prompt = `
      Transform the character in this image into a cute, professional designer plush toy.
      - Maintain the character's key features, hair, and clothing style.
      - Give it a soft, high-quality minky fabric texture.
      - Add realistic plush seams and stitching details.
      - Style: High-end collectible toy, studio lighting, simple clean background.
      - Output: Only the image of the plush toy.
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
      throw new Error("No response. Check your API limits.");
    }

    if (candidate.finishReason === 'SAFETY') {
      throw new Error("Content blocked by safety filters. Try a different image.");
    }

    for (const part of candidate.content.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    return null;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    if (error.message?.includes('403') || error.message?.includes('API key')) {
      throw new Error("API Key issue. Make sure API_KEY is set in Vercel Environment Variables.");
    }
    
    throw error;
  }
}
