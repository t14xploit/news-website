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
    selectedAuthorNames: string[],
    _prevState: unknown,
    formData: FormData
  )
   {
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
          authors: {
            connectOrCreate: selectedAuthorNames.map((name) => ({
              where: { name },
              create: { name },
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
    console.error("Create article failed");
  
    // PrismaClientKnownRequestError has metadata
    if (err instanceof Error) {
      console.error("Message:", err.message);
  
      try {
        console.error("Full error:", JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
      } catch (jsonErr) {
        console.error("Could not stringify error", jsonErr);
      }
    } else {
      console.error("Non-standard error:", err);
    }
  
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
export async function searchAuthors(query: string) {
    return prisma.author.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
      take: 10,
    });
  }
  