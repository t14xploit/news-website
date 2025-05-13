"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { z } from "zod";

const authorSchema = z.object({
  name: z.string().min(2, "Author name must be at least 2 characters"),
  image: z.union([z.string().url(), z.literal("")]),
});

export async function createAuthor(prevState: unknown, formData: FormData) {
  const obj = Object.fromEntries(formData.entries());
  const result = authorSchema.safeParse(obj);

  if (!result.success) {
    return {
      message: "Attempt to create author failed",
      error: result.error.errors.map(e => e.message).join(", "),
    };
  }

  const { name, image } = result.data;

  const existingAuthor = await prisma.author.findFirst({
    where: { name },
  });

  if (existingAuthor) {
    return {
      message: "Author already exists!",
      error: "Error: Author with that name already exists.",
    };
  }

  await prisma.author.create({
    data: {
      name,
      picture: image, 
    },
  });

  redirect("/admin/authors");
}
