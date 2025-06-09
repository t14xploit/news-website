// "use server";
// import { prisma } from "@/lib/prisma";

// export async function getArticlesForOrganization(organizationId: string) {
//   const articles = await prisma.article.findMany({
//     where: { organizationId },
//     include: {
//       authors: true,
//       organization: true,
//     },
//     orderBy: {
//       createdAt: "desc",
//     },
//   });

//   return articles.map((article) => ({
//     id: article.id,
//     headline: article.headline,
//     summary: article.summary,
//     imageUrl: article.image,
//     authorName: article.authors[0]?.name || "Unknown Author",
//     authorImageUrl: article.authors[0]?.picture,
//     publishDate: article.createdAt,
//     views: article.views,
//     organizationName: article.organization?.name,
//   }));
// }

"use server";

import { prisma } from "@/lib/prisma";
import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";

export async function getArticlesForOrganization(organizationId: string) {
  const headersList = await headers();
  const nativeHeaders: Record<string, string> = {};
  for (const [key, value] of headersList.entries()) {
    nativeHeaders[key] = value ?? "";
  }

  const session = await authClient.getSession({
    fetchOptions: { headers: nativeHeaders },
  });

  if (!session.data?.user) {
    return [];
  }

  const articles = await prisma.article.findMany({
    where: { organizationId },
    include: {
      authors: true,
      categories: true,
    },
  });

  return articles.map((article) => ({
    id: article.id,
    headline: article.headline,
    summary: article.summary,
    imageUrl: article.image,
    authorName: article.authors[0]?.name || "Unknown Author",
    authorImageUrl: article.authors[0]?.picture,
    publishDate: article.createdAt,
    views: article.views,
    commentCount: 0, // Placeholder
    isPinned: false, // Placeholder
  }));
}
