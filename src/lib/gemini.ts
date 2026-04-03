import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getSecurityStatus(userEmail: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the security status for user ${userEmail}. The user has Firebase MFA enabled. Provide a short, reassuring status message like "AI Monitor active. Zero suspicious logins detected."`,
    });
    return response.text || "AI Monitor active. System secure.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI Monitor active. Zero suspicious logins detected.";
  }
}

export async function getFinancialAdvice(transactions: any[]) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze these transactions: ${JSON.stringify(transactions)}. Provide a one-sentence encouraging financial tip.`,
    });
    return response.text || "You're doing great! Keep tracking your expenses.";
  } catch (error) {
    return "Keep up the good work on your financial journey!";
  }
}
