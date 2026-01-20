import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let genAI: GoogleGenerativeAI | null = null;

if (API_KEY) {
  genAI = new GoogleGenerativeAI(API_KEY);
}

export const generateBattleImage = async (prompt: string): Promise<string | null> => {
  if (!genAI) {
    console.warn('Gemini API key not configured. Using placeholder image.');
    return null;
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp-image-generation' });

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseModalities: ['image', 'text'],
      } as never,
    });

    const response = result.response;
    const candidates = response.candidates;

    if (candidates && candidates[0]?.content?.parts) {
      for (const part of candidates[0].content.parts) {
        if ('inlineData' in part && part.inlineData) {
          const imageData = part.inlineData.data;
          const mimeType = part.inlineData.mimeType || 'image/png';
          return `data:${mimeType};base64,${imageData}`;
        }
      }
    }

    return null;
  } catch (error) {
    console.error('Error generating image:', error);
    return null;
  }
};

export const isGeminiConfigured = (): boolean => {
  return !!API_KEY;
};
