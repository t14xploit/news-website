import { prisma } from "@/lib/prisma";
import ArticleViewTracker from "@/components/ArticleViewTracker";

export default async function ArticlePage({ params }: { params: { id: string } }) {
  const article = await prisma.article.findUnique({
    where: { id: params.id },
  });

  if (!article) return <div>Article not found.</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold">{article.headline}</h1>
      <p className="text-gray-600">{article.summary}</p>
      <div className="mt-4">{article.content}</div>

      {/* This will trigger view count increment on load */}
      <ArticleViewTracker articleId={article.id} />
    </div>
  );
}
