// lib/category.ts
import { prisma } from "@/lib/prisma";

export async function fetchCategoryData(name: string) {
  const category = await prisma.category.findUnique({
    where: {
      title: name, 
    },
    include: {
      articles: {
        select: {
          id: true,
          headline: true,
          summary: true,
          createdAt: true,
          authors: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          views: "desc",
        },
      },
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  return category;
}
