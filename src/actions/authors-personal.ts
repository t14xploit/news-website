import { prisma } from "@/lib/prisma"; 

export async function getAuthorArticles(authorId: string) {
  const author = await prisma.author.findUnique({
    where: { id: authorId },
    include: {
      articles: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!author) {
    return { name: "Author not found", articles: [] };
  }

  return {
    name: author.name,
    picture: author.picture,
    articles: author.articles.map((article) => ({
      id: article.id,
      headline: article.headline,
      summary: article.summary,
      url: `/articles/${article.id}`,
    })),
  };
}
