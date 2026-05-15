const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI();
async function run() {
  try {
    const res = await ai.models.list();
    for await (const m of res) {
       if (m.name.includes("flash")) console.log(m.name);
    }
  } catch (e) { console.error(e); }
}
run();
