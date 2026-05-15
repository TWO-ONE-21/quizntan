"use server";

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateQuestion() {
    const prompt = `Buat 1 pernyataan acak. 50% peluang Fakta, 50% Karangan. 
  Pernyataan harus menarik, lucu, atau aneh.
  Kembalikan JSON murni TANPA markdown formatting block (jangan gunakan \`\`\`json): 
  { 
    "pernyataan": "string", 
    "is_fakta": boolean, 
    "penjelasan": "string lucu dan friendly, sapa 'Ardo & Cintan'" 
  }`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        const text = (response.text || "").trim();
        // Helper to safely parse JSON in case model hallucinates markdown
        const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();

        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Gemini Error:", error);
        // Fallback if API fails
        return {
            pernyataan: "Bumi itu bentuknya donat.",
            is_fakta: false,
            penjelasan: "Waduh API-nya lagi ngantuk nih Ardo & Cintan, jadi ini karangan darurat aja ya!"
        };
    }
}
