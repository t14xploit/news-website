"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function saveGeneratedArticle(formData: FormData) {
  const headline = formData.get("headline") as string;
  const summary = formData.get("summary") as string;
  const content = formData.get("content") as string;

  if (!headline || !summary || !content) {
    return { success: false, error: "Missing required fields." };
  }

  try {
    await prisma.article.create({
      data: {
        headline,
        summary,
        content,
        isEditorsChoice: false,
        views: 0,
        authors: {
          connect: [], // Add logic if needed
        },
        categories: {
          connect: [],
        },
      },
    });

    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Save error:", error);
    return { success: false, error: "Failed to save article." };
  }
}
