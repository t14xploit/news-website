"use server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { z } from "zod";

const categorySchema = z.object({
  title: z.string().min(2, "Category must be at least 2 characters"),
});

export async function createCategory(pevState: unknown, formData: FormData) {
  const obj = Object.fromEntries(formData.entries());
  const result = categorySchema.safeParse(obj);

  if (!result.success) {
    console.log(result.error.flatten());
    return {
      message: "Attempt to create category failed",
      error: result.error.message,
    };
  }

  const { title } = result.data;
  const normalizedName = title.toLowerCase();
  const existingCategory = await prisma.category.findUnique({
    where: { title: normalizedName },  });

  if (existingCategory) {
    return {
      message: "Title already exist!",
      error: "Error: Title already exist!",
    };
  }
  await prisma.category.create({
    data: {
      title: normalizedName,
    },
  });
  redirect("/admin/categories");
}
