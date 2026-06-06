import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateText(prompt) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    console.error("AI Client Error:", err);
    return "[AI generation failed]";
  }
}
