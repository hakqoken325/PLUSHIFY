
import { GoogleGenAI } from "@google/genai";

export async function transformToPlush(base64Image: string, mimeType: string): Promise<string | null> {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = 'gemini-2.5-flash-image';
    
    const prompt = `
      Transform the character in this image into a cute, high-quality designer plush toy (plushie). 
      Key requirements:
      1. Maintain the character's primary features, colors, and iconic clothing.
      2. The texture should look like soft, high-quality felt or minky fabric.
      3. Include realistic stitching details and black beaded eyes (if appropriate) or embroidered eyes.
      4. The plush should be sitting or standing upright.
      5. Use soft, warm lighting on a simple neutral studio background.
      6. The output must be exactly one high-resolution image of the plush toy version.
    `;

    const response = await ai.models.generateContent({
      model: model,
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

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    return null;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}
