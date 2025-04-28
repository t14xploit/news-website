import { prisma } from "@/lib/prisma";

export async function getTopAuthorsWithMostViewedArticles() {
  // Step 1: Fetch authors with ALL their articles to have enough to filter through
  const authors = await prisma.author.findMany({
    orderBy: {
      articles: {
        _count: 'desc', // top authors by article count
      },
    },
    take: 10, // get top 10 so we can filter
    include: {
      articles: {
        orderBy: {
          views: 'desc', // most viewed first
        },
      },
    },
  });

  // Step 2: Track used article IDs to avoid repeats
  //prev. code had experts 3 card showing the same articles which logically was true, but not what i meant for it to be.

  const usedArticleIds = new Set<string>();

  // Step 3: Filter to only top 3 authors with unique articles
  const uniqueAuthorsWithArticles = [];

  for (const author of authors) {
    const uniqueArticle = author.articles.find(
      (article) => !usedArticleIds.has(article.id)
    );

    if (uniqueArticle) {
      usedArticleIds.add(uniqueArticle.id);
      uniqueAuthorsWithArticles.push({
        name: author.name,
        id: author.id,
        picture: author.picture,
        headline: uniqueArticle.headline ?? "No headline available",
        articleSummary: uniqueArticle.summary ?? "No summary available",
        articleUrl: `/articles/${uniqueArticle.id}`,
      });
    }

    if (uniqueAuthorsWithArticles.length === 3) break;
  }

  return uniqueAuthorsWithArticles;
}
