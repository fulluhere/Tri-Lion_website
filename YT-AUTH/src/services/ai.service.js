// backend/src/services/ai.service.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

export async function generateHint({ problemTitle, problemDescription, difficulty, userCode }) {
  const prompt = `You are a coding tutor. A student is stuck on this problem:

Title: ${problemTitle}
Difficulty: ${difficulty}
Description: ${problemDescription}

${userCode ? `Their current code attempt:\n${userCode}` : "They haven't written any code yet."}

Give ONE small, step-by-step hint that nudges them toward the right approach WITHOUT revealing the full solution, the exact algorithm name, or any code. Keep it to 2-3 sentences.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function analyzeSubmission({ problemTitle, problemDescription, code, language, verdict, failedInput, expectedOutput, actualOutput }) {
  const prompt = `You are a coding tutor analyzing a student's failed submission.

Problem: ${problemTitle}
Description: ${problemDescription}
Language: ${language}
Verdict: ${verdict}

Student's code:
${code}

${verdict === "WA" ? `
Failed on this input: ${failedInput}
Expected output: ${expectedOutput}
Actual output: ${actualOutput}
` : `
The code exceeded the time limit, meaning it's likely too slow (inefficient algorithm or complexity) for the given constraints.
`}

Explain in 3-4 sentences what's likely going wrong and suggest a concrete direction to fix it. Do NOT provide the corrected code or the full solution — just point them toward the fix.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}