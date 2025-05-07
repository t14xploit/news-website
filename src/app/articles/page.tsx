import { prisma } from "@/lib/prisma";
import SearchForm from "@/components/SearchForm"; // The search form component

export default async function ArticlesPage() {
  const articles = await prisma.article.findMany({
    take: 20,
    include: {
      categories: true, 
    },
  });

  return (
    <div className="p-4 font-inika">
      <h1 className="text-2xl font-bold mb-4">Articles</h1>
      <SearchForm initialArticles={articles} />
    </div>
  );
}