"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";

const createArticleSchema = z.object({
  headline: z.string().min(1),
  summary: z.string().min(1),
  content: z.string().min(1),
  categories: z.array(z.string().min(1)).min(1),
  isEditorsChoice: z.string().optional(),
});

export async function createArticle(
  selectedCategories: string[],
  _prevState: unknown,
  formData: FormData
) {
  const obj = Object.fromEntries(formData.entries());

  const result = await createArticleSchema.safeParseAsync({
    ...obj,
    categories: selectedCategories,
  });

  if (!result.success) {
    return {
      success: false,
      values: {
        headline: obj.headline?.toString() || "",
        summary: obj.summary?.toString() || "",
        content: obj.content?.toString() || "",
      },
      errorMessage: "Validation failed! Please check the form data.",
      articleId: "",
    };
  }

  const { headline, summary, content, categories, isEditorsChoice } = result.data;

  try {
    const created = await prisma.article.create({
      data: {
        headline,
        summary,
        content,
        isEditorsChoice: isEditorsChoice === "on",
        categories: {
          connectOrCreate: categories.map((title) => ({
            where: { title },
            create: { title },
          })),
        },
      },
    });

    return {
      success: true,
      articleId: created.id,
      values: { headline: "", summary: "", content: "" },
      errorMessage: "",
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      articleId: "",
      values: { headline, summary, content },
      errorMessage: "A database error occurred.",
    };
  }
}

export async function searchCategories(query: string) {
  return prisma.category.findMany({
    where: {
      title: {
        contains: query,
        mode: "insensitive",
      },
    },
    take: 10,
  });
}
