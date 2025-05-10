import { prisma } from "@/lib/prisma";
import { searchArticles } from "@/actions/search";
import SearchForm from "@/components/SearchForm";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ArticlesPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const query = typeof resolvedParams.q === "string" ? resolvedParams.q : "";

  let articles;
  if (query) {
    const formData = new FormData();
    formData.set("search", query);
    articles = await searchArticles(formData);
  } else {
    articles = await prisma.article.findMany({
      take: 20,
      include: { categories: true },
    });
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Articles</h1>
      <SearchForm initialArticles={articles} />
    </div>
  );
}
