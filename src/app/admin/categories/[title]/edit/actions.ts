"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { z } from "zod";

const categoryEdit = z.object({
  title: z.string().min(2, "Category must be at least 2 characters"),
});

export async function editCategory(title: string, prevState: unknown, formData: FormData) {
  const obj = Object.fromEntries(formData.entries());
  const result = categoryEdit.safeParse(obj);

  if (!result.success) {
    console.log(result.error.flatten());
    return {
      message: "Attempt to edit category failed",
      error: result.error.message,
    };
  }

  const { title: newTitle } = result.data;  

  const existingCategory = await prisma.category.findFirst({
    where: {
      title: newTitle,  // Check if the title already exists
      NOT: {
        title: title,  // Exclude the current category being edited by its title
      },
    },
  });

  if (existingCategory) {
    return {
      message: "Title already exists!",
      error: "Error: Title already exists!",
    };
  }

  // the update
  await prisma.category.update({
    where: { title: title },  
    data: { title: newTitle },  
  });

  redirect("/admin/categories");
}
