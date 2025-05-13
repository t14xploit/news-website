import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ClearQueryParamOnLoad } from "./clear-query-param"; // optional helper

export default async function ArticlePage({
  params,
  searchParams,
}: {
  params: { articleId: string };
  searchParams: { created?: string };
}) {
  const article = await prisma.article.findUnique({
    where: { id: params.articleId },
    include: { categories: true },
  });

  if (!article) return notFound();

  return (
    <div className="space-y-4">
      {searchParams.created === "1" && (
        <>
          <Alert variant="default">
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>Article created successfully.</AlertDescription>
          </Alert>
          <ClearQueryParamOnLoad /> {/* Optional cleaner */}
        </>
      )}

      <h1 className="text-3xl font-bold">{article.headline}</h1>
      <p className="text-muted-foreground">{article.summary}</p>
      <div className="prose mt-4">{article.content}</div>
    </div>
  );
}
