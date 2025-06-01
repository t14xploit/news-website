"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";

const editArticleSchema = z.object({
  headline: z.string().min(1),
  summary: z.string().min(1),
  content: z.string().min(1),
  image: z.union([z.string().url(), z.literal("")]),
  categories: z.array(z.string().min(1)).min(1),
  isEditorsChoice: z.string().optional(),
});

export async function editArticle(
  selectedCategories: string[],
  selectedAuthorNames: string[],
  articleId: string,
  _prevState: unknown,
  formData: FormData
) {
  const obj = Object.fromEntries(formData.entries());

  // Validate input data
  const result = await editArticleSchema.safeParseAsync({
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

  const { headline, summary, content, image, categories, isEditorsChoice } = result.data;

  try {
    // Ensure all selected categories exist in the database
    await Promise.all(
      categories.map((title) =>
        prisma.category.upsert({
          where: { title },
          update: {},
          create: { title },
        })
      )
    );
    //ensure all selected authors exist in the db
    await Promise.all(
      selectedAuthorNames.map((name) =>
        prisma.author.upsert({
          where: { name },
          update: {},
          create: { name },
        })
      )
    );
    // Update the article
    const updated = await prisma.article.update({
      where: { id: articleId },
      data: {
        headline,
        summary,
        content,
        image: image || null,
        isEditorsChoice: isEditorsChoice === "on",

        // Replace old categories with new ones
        categories: {
          set: categories.map((title) => ({ title })),
        },

        // Authors fixed removing part error
        authors: {
          set: selectedAuthorNames.map((name) => ({ name })),
        },
        
      },
    });

    return {
      success: true,
      articleId: updated.id,
      values: { headline: "", summary: "", content: "", image: "" },
      errorMessage: "",
    };
  } catch (err) {
    console.error("Update article failed");

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
