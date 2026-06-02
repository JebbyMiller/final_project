export async function generateText(prompt) {
  try {
    return `
[AI generation temporarily disabled]

Prompt received:
${prompt}

(This prevents crashes while you finish building the backend.)
    `;
  } catch (err) {
    console.error("AI Client Error:", err);
    return "[AI generation failed]";
  }
}
