"use server";

import { GoogleGenAI } from "@google/genai";

export async function generateQuestion() {
    const prompt = `Buat 1 pernyataan acak. 50% peluang Fakta, 50% Karangan. 
  Pernyataan harus menarik, lucu, atau aneh.
  Kembalikan JSON murni TANPA markdown formatting block (jangan gunakan \`\`\`json): 
  { 
    "pernyataan": "string", 
    "is_fakta": boolean, 
    "penjelasan": "string lucu dan friendly, sapa 'Ardo & Cintan'" 
  }`;

    const apiKeys = (process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY || "")
        .split(",")
        .map((key) => key.trim())
        .filter((key) => key.length > 0);

    if (apiKeys.length === 0) {
        console.error("Gemini Error: Tidak ada API Key yang terkonfigurasi!");
        return {
            pernyataan: "Bumi itu bentuknya donat.",
            is_fakta: false,
            penjelasan: "Sistem belum dikonfigurasi API Key-nya Ardo & Cintan!"
        };
    }

    let lastError: any = null;

    for (const apiKey of apiKeys) {
        try {
            const ai = new GoogleGenAI({ apiKey: apiKey });

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
            });

            const text = (response.text || "").trim();
            const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();

            return JSON.parse(jsonStr);
        } catch (error: any) {
            console.warn("Peringatan: Satu putaran API Key gagal, mencoba kunci selanjutnya...", error?.message || "");
            lastError = error;
            // Let the loop continue to the next key
        }
    }

    console.error("Error Kritis Gemini: Semua API Key sudah diuji dan terkena limit/error.", lastError);
    // Fallback if all keys fail
    return {
        pernyataan: "Bumi itu bentuknya donat.",
        is_fakta: false,
        penjelasan: "Waduh API-nya udah pada limit semua nih Ardo & Cintan, jadi ini karangan darurat aja ya!"
    };
}
