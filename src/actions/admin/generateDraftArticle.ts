"use server";

import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API || "",
});

export interface GeneratedArticle {
  success: boolean;
  error?: string;
  headline?: string;
  summary?: string;
  content?: string;
}

export async function generateDraftArticle(
  _: GeneratedArticle | null,
  formData: FormData
): Promise<GeneratedArticle> {
  const subject = formData.get("subject") as string;

  if (!subject || subject.trim().length === 0) {
    return {
      success: false,
      error: "Subject is required.",
    };
  }

  const prompt = `
You are a professional news journalist. Write a comprehensive, well-researched news article about the following topic.

Respond using this exact format:
Headline: [Your headline here]
Summary: [One-paragraph summary]
Content: [Full article body here]

Topic: ${subject.trim()}
`;

  try {
    const result = await genAI.models.generateContent({
      model: "gemini-2.0-flash-001",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return { success: false, error: "AI response was empty." };
    }

    const headlineMatch = text.match(/Headline:\s*(.*)/);
    const summaryMatch = text.match(/Summary:\s*(.*)/);
    const contentMatch = text.match(/Content:\s*([\s\S]*)/);

    if (!headlineMatch || !summaryMatch || !contentMatch) {
      return {
        success: false,
        error: "AI response was not in expected format.",
      };
    }

    return {
      success: true,
      headline: headlineMatch[1].trim(),
      summary: summaryMatch[1].trim(),
      content: contentMatch[1].trim(),
    };
  } catch (err) {
    console.error("Error:", err);
    return { success: false, error: "Generation failed." };
  }
}
