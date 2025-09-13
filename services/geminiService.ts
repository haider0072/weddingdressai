
import { GoogleGenAI, Type } from "@google/genai";
import { EventType, DressCombination } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateColorSuggestions = async (
  inputColor: string,
  personWearingColor: "bride" | "groom",
  eventType: EventType
): Promise<string> => {
  const otherPerson = personWearingColor === "bride" ? "groom" : "bride";
  const prompt = `
    You are an expert Pakistani wedding fashion consultant. Your task is to suggest complementary colors for a wedding outfit.

    Wedding Event: ${eventType}
    The ${personWearingColor}'s outfit color is: ${inputColor}.

    Based on this, suggest 5 complementary colors for the ${otherPerson}'s outfit. The colors should be suitable for a traditional and elegant Pakistani ${eventType} ceremony. The suggestions should be sophisticated and fashionable.

    Return the result as a JSON array of objects, where each object has a 'name' (e.g., "Dusty Rose") and a 'hex' (e.g., "#DCAE96") code. Only return the JSON array.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            hex: { type: Type.STRING },
          },
          required: ["name", "hex"],
        },
      },
    },
  });

  return response.text;
};

export const generateWeddingImage = async (
  brideColor: string,
  groomColor: string,
  eventType: EventType,
  dressCode: DressCombination
): Promise<string> => {
  const prompt = `
    Generate a photorealistic, high-fashion image of a Pakistani couple at their ${eventType} wedding ceremony. The scene should be elegant and opulent, reflecting traditional Pakistani wedding decor.

    - Bride's Attire: She is wearing a beautiful ${dressCode.bride} in a stunning ${brideColor} color, with intricate golden and silver embroidery.
    - Groom's Attire: He is wearing a handsome ${dressCode.groom} in a complementary ${groomColor} color.
    - Setting: A lavishly decorated Pakistani wedding venue suitable for a ${eventType}, with flowers and soft lighting.
    - Style: The image should be of editorial quality, well-lit, with a focus on the couple's outfits. They should be looking happy and elegant. Do not show any text or watermarks. The couple should be of South Asian descent.
  `;

  const response = await ai.models.generateImages({
    model: 'imagen-4.0-generate-001',
    prompt,
    config: {
      numberOfImages: 1,
      outputMimeType: 'image/jpeg',
      aspectRatio: '3:4',
    },
  });

  return response.generatedImages[0].image.imageBytes;
};
