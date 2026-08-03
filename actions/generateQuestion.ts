"use server";

import { QuestionType } from "@/hooks/useGameState";

export interface QuestionCategory {
    main: string;
    sub: string;
}

export async function generateQuestion(category?: QuestionCategory, history?: string[]): Promise<QuestionType[]> {
    const topicLine = category
        ? `Topik spesifik: **${category.main} — ${category.sub}**`
        : `Topik: acak dan beragam`;

    const historyLine = history && history.length > 0 
        ? `\n\nSANGAT PENTING: JANGAN membuat soal tentang topik atau fakta yang mirip dengan soal-soal berikut yang sudah pernah ditanyakan:\n${history.map(h => `- ${h}`).join("\n")}`
        : "";

    const prompt = `Kamu adalah pembuat soal kuis edukatif yang sangat teliti dan akurat.

${topicLine}${historyLine}

Tugas: Buat persis 3 pernyataan kuis "Fakta atau Karangan?".
Pastikan ada campuran yang seimbang antara FAKTA (pernyataan yang benar-benar terjadi) dan KARANGAN/HOAKS (pernyataan salah/mitos yang mengecoh). Jangan buat semuanya Fakta atau semuanya Karangan.

1. AKURAT — jika is_fakta=true, harus terbukti. Jika is_fakta=false, harus jelas salah.
2. EDUKATIF — pemain belajar sesuatu yang baru.
3. SPESIFIK pada topik "${category ? category.sub : 'acak'}".
4. Penjelasan harus menyebutkan fakta sebenarnya yang memperkaya pengetahuan.
5. SANGAT PENTING: SELURUH KONTEN WAJIB DITULIS DALAM BAHASA INDONESIA (pernyataan, penjelasan, sumber). Jangan menggunakan bahasa Inggris sama sekali.

Format WAJIB JSON Array of Objects murni TANPA markdown/code block, persis seperti ini:
[
  {
    "pernyataan": "pernyataan jelas 1-2 kalimat",
    "is_fakta": boolean,
    "penjelasan": "penjelasan 2-3 kalimat akurat (langsung jelaskan faktanya tanpa menyapa pemain atau mengucapkan 'benar/salah')",
    "sumber": "nama referensi singkat"
  },
  {...},
  {...}
]

PENTING: Hanya output JSON array yang valid, tanpa teks awalan/akhiran.`;

    // Konfigurasi Provider AI (Groq & OpenRouter)
    const configs: any[] = [];

    const groqKeys = (process.env.GROQ_API_KEYS || process.env.GROQ_API_KEY || "").split(",").map(k => k.trim()).filter(k => k.length > 0);
    const openRouterKeys = (process.env.OPENROUTER_API_KEYS || process.env.OPENROUTER_API_KEY || "").split(",").map(k => k.trim()).filter(k => k.length > 0);

    // Daftarkan kunci Groq
    for (const key of groqKeys) {
        configs.push({
            name: "Groq",
            url: "https://api.groq.com/openai/v1/chat/completions",
            model: "llama-3.3-70b-versatile", // Model Llama-3 tercanggih super cepat
            headers: {
                "Authorization": `Bearer ${key}`,
                "Content-Type": "application/json",
            }
        });
    }

    // Daftarkan kunci OpenRouter
    for (const key of openRouterKeys) {
        configs.push({
            name: "OpenRouter",
            url: "https://openrouter.ai/api/v1/chat/completions",
            model: "nvidia/nemotron-3-super-120b-a12b:free",
            headers: {
                "Authorization": `Bearer ${key}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://quizntan.vercel.app",
                "X-OpenRouter-Title": "Quizntan",
            }
        });
    }

    if (configs.length === 0) {
        console.error("AI Error: Tidak ada API Key (Groq / OpenRouter) yang terkonfigurasi!");
        return getFallbackQuestion(category);
    }

    // Acak urutan provider agar beban terbagi merata (Load Balancing)
    const shuffledConfigs = configs.sort(() => Math.random() - 0.5);
    
    let lastError: any = null;

    for (const config of shuffledConfigs) {
        try {
            const response = await fetch(config.url, {
                method: "POST",
                headers: config.headers,
                body: JSON.stringify({
                    model: config.model,
                    messages: [
                        { role: "user", content: prompt },
                    ],
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const text = (data.choices?.[0]?.message?.content || "").trim();
            const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();

            const parsed = JSON.parse(jsonStr);
            if (Array.isArray(parsed)) {
                return parsed.map(p => ({
                    ...p,
                    kategori: category ? `${category.main} — ${category.sub}` : "Umum",
                }));
            } else {
                return [{
                    ...parsed,
                    kategori: category ? `${category.main} — ${category.sub}` : "Umum",
                }];
            }
        } catch (error: any) {
            console.warn(`Peringatan: ${config.name} gagal, mencoba provider berikutnya...`, error?.message || "");
            lastError = error;
        }
    }

    console.error("Error Kritis: Semua provider API gagal.", lastError);
    return [{
        pernyataan: `Sistem AI gagal: ${lastError?.message || "Unknown Error"}`,
        is_fakta: true,
        penjelasan: `Terjadi kendala pada semua server AI (Groq & OpenRouter). Pastikan API Key di file .env.local Anda valid dan masih memiliki kuota/limit.`,
        sumber: "Sistem",
        kategori: "Error",
    }];
}

function getFallbackQuestion(category?: QuestionCategory, isRateLimit: boolean = false): QuestionType[] {
    if (isRateLimit) {
        return [{
            pernyataan: "Sistem AI sedang beristirahat karena terkena limit kuota (Terlalu banyak permintaan).",
            is_fakta: true,
            penjelasan: "Sistem membatasi jumlah permintaan ke server (Rate Limit). Anda harus menunggu sekitar 30-60 detik agar sistem kembali normal.",
            sumber: "Sistem API",
            kategori: category ? `${category.main} — ${category.sub}` : "Sistem",
        }];
    }

    const fallbacks: Record<string, { pernyataan: string; is_fakta: boolean; penjelasan: string; sumber: string }[]> = {
        "Sejarah Indonesia": [{
            pernyataan: "Proklamasi Kemerdekaan Indonesia dibacakan oleh Soekarno pada 17 Agustus 1945 di Jalan Pegangsaan Timur No. 56, Jakarta.",
            is_fakta: true,
            penjelasan: "Proklamasi dibacakan pada pukul 10.00 WIB. Naskah proklamasi diketik oleh Sayuti Melik dan ditandatangani Soekarno-Hatta atas nama bangsa Indonesia.",
            sumber: "Arsip Nasional RI",
        }, {
            pernyataan: "Candi Borobudur dibangun pada masa Dinasti Sanjaya.",
            is_fakta: false,
            penjelasan: "Candi Borobudur sebenarnya dibangun pada masa keemasan Wangsa Syailendra, bukan Sanjaya.",
            sumber: "Sejarah Nusantara",
        }],
        "Astronomi & Luar Angkasa": [{
            pernyataan: "Matahari adalah bintang yang ukurannya paling besar di galaksi Bima Sakti.",
            is_fakta: false,
            penjelasan: "Matahari tergolong bintang berukuran sedang (katai kuning). Bintang terbesar yang diketahui adalah UY Scuti yang 1.700 kali lebih besar dari Matahari.",
            sumber: "NASA",
        }],
    };

    const key = category?.sub || "";
    const fallbackList = fallbacks[key] || [{
        pernyataan: "Indonesia adalah negara kepulauan terbesar di dunia dengan lebih dari 17.000 pulau.",
        is_fakta: true,
        penjelasan: "Indonesia memiliki sekitar 17.504 pulau dan diakui secara internasional sebagai negara kepulauan terbesar di dunia.",
        sumber: "Badan Pusat Statistik (BPS)",
    }];

    return fallbackList.map(f => ({ ...f, kategori: category ? `${category.main} — ${category.sub}` : "Umum" }));
}
