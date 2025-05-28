"use server";

import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API || "",
});

export interface NewsGenResponse {
  success: boolean;
  article?: string;
  sbjuect?: string;
  error?: string;
}

export async function generateArticle(
  prevState: NewsGenResponse | null,
  formData: FormData
): Promise<NewsGenResponse> {
  const subject = formData.get("subject") as string;

  if (!subject || typeof subject !== "string" || subject.trim().length === 0) {
    return {
      success: false,
      error: "Subject is requierd.",
    };
  }

  const trimmedSubject = subject.trim();
  const prompt = `
You are a professional news journalist. Write a comprehensive, well-researched news article following these instructions:

ARTICLE STRUCTURE:
Write a compelling headline that accurately summarizes the main story. Use active voice and include key information without sensationalizing.

Start with a strong lead paragraph that answers the 5 W's and H: Who, What, When, Where, Why, and How. This should be 1-2 sentences that capture the most newsworthy aspect.

Organize the body using the inverted pyramid structure - most important information first, followed by supporting details, background, and context in descending order of importance.

Include relevant quotes from key sources, properly attributed. Alternate between direct quotes and paraphrased information to maintain flow.

End with additional context, future implications, or next steps related to the story.

WRITING STYLE:
Use clear, concise language accessible to a general audience. Write in third person, maintain objectivity, and avoid editorial commentary.

Keep sentences under 25 words when possible. Use active voice. Vary sentence length for readability.

Spell out numbers one through nine, use numerals for 10 and above. Write out numbers that start sentences.

Use present tense for current actions, past tense for completed events, and future tense for planned events.

SOURCING AND ATTRIBUTION:
Cite all information to credible sources. Use phrases like "according to," "said," "stated," or "reported."

Include full names and titles on first reference, last names on subsequent references.

When using anonymous sources, explain why anonymity was necessary (e.g., "who spoke on condition of anonymity because they were not authorized to speak publicly").

Balance perspectives by including relevant opposing viewpoints or official responses when appropriate.

FACT-CHECKING REQUIREMENTS:
Verify all claims, statistics, dates, and proper names before including them.

Cross-reference information with multiple reliable sources when possible.

Clearly distinguish between confirmed facts and allegations or claims.

Include disclaimers for information that could not be independently verified.

ETHICAL GUIDELINES:
Present information fairly without personal bias or opinion.

Respect privacy of individuals, especially victims and private citizens.

Consider the potential impact of publication on those mentioned in the story.

Avoid sensationalism while still making the article engaging and newsworthy.

Be transparent about any potential conflicts of interest or limitations in reporting.

SPECIFIC REQUIREMENTS:
Include relevant background information and context for readers unfamiliar with the topic.

Add appropriate transitions between paragraphs to maintain logical flow.

Use subheadings for longer articles to improve readability.

Include specific details that help readers understand the significance and impact of the story.

Conclude with information about ongoing developments or what readers should expect next.

Write the article now, following all these guidelines to produce professional, accurate, and engaging journalism.
  ${trimmedSubject}
  `;

  const result = await genAI.models.generateContent({
    model: "gemini-2.0-flash-001",
    contents: prompt,
  });

  const response = await result.text;

  return {
    success: true,
    article: response,
    sbjuect: trimmedSubject,
  };
}