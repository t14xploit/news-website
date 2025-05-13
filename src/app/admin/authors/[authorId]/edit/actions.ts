"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { redirect } from "next/navigation";

const authorSchema = z.object({
  name: z.string().min(2, "Author name must be at least 2 characters"),
  image: z.union([z.string().url(), z.literal("")]),
});

export async function editAuthor(
  articleIds: string[],
  authorId: string,
  prevState: unknown,
  formData: FormData
) {
  const obj = Object.fromEntries(formData.entries());
  const result = authorSchema.safeParse(obj);

  if (!result.success) {
    return {
      success: false,
      message: "Attempt to update author failed",
      error: result.error.errors.map((e) => e.message).join(", "),
    };
  }

  const { name, image } = result.data;

  const existingAuthor = await prisma.author.findFirst({
    where: { name },
  });

  if (existingAuthor && existingAuthor.id !== authorId) {
    return {
      success: false,
      message: "Author already exists!",
      error: "Error: Author with that name already exists.",
    };
  }

  // Perform update inside try/catch
  try {
    await prisma.author.update({
      where: { id: authorId },
      data: {
        name,
        picture: image,
        articles: {
          set: articleIds.map((id) => ({ id })),
        },
      },
    });
  } catch (err) {
    console.error("Error while updating author:", err);
    return {
      success: false,
      message: "An error occurred while updating the author.",
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }

  redirect("/admin/authors");
}
export async function searchArticles(query: string) {
  return prisma.article.findMany({
    where: {
      headline: {
        contains: query,
        mode: "insensitive",
      },
    },
    take: 10,
  });
}