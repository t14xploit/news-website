import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ClearQueryParamOnLoad } from "./clear-query-param";
import Image from "next/image";
import { XCircleIcon } from "lucide-react";

export default async function ArticlePage({
  params,
  searchParams,
}: {
  params: { articleId: string };
  searchParams: { created?: string };
}) {
  const article = await prisma.article.findUnique({
    where: { id: params.articleId },
    include: { categories: true, authors: true },
  });

  if (!article) return notFound();

  return (
    <div className="space-y-4">
      {searchParams.created === "1" && (
        <>
          <Alert variant="default">
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>Article created successfully.</AlertDescription>
          </Alert>
          <ClearQueryParamOnLoad />
        </>
      )}

      {/* Main Article Info */}
      <div className="space-y-2 border rounded-md p-4 bg-muted">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">{article.headline}</h1>
          {article.isEditorsChoice ? (
            <span className="text-sm font-medium text-green-700 border border-green-600 px-2 py-1 rounded">
              Editor&apos;s Choice
            </span>
          ) : (
            <span className="text-sm font-medium text-red-600 flex items-center">
              <XCircleIcon className="w-5 h-5 mr-2 text-red-600" />
              Not Editor&apos;s Choice
            </span>
          )}
        </div>
        <p className="text-muted-foreground">{article.summary}</p>
      </div>

      {/* Article Content */}
      <div className="prose max-w-none bg-background p-6 rounded-md border">
        {article.content}
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
        <div>
          <span className="font-medium text-foreground">Created:</span>{" "}
          {new Date(article.createdAt).toLocaleString()}
        </div>
        <div>
          <span className="font-medium text-foreground">Last Updated:</span>{" "}
          {new Date(article.updatedAt).toLocaleString()}
        </div>
        <div>
          <span className="font-medium text-foreground">Views:</span>{" "}
          {article.views}
        </div>
        <div>
          <span className="font-medium text-foreground">Categories:</span>{" "}
          {article.categories.map((c) => c.title).join(", ") || "—"}
        </div>
        <div>
          <span className="font-medium text-foreground">Authors:</span>{" "}
          {article.authors.map((a) => a.name).join(", ") || "—"}
        </div>
      </div>

      {/* Optional Image */}
      {article.image && (
        <div className="mt-4">
          <Image
          height={200}
          width={200}
            src={article.image}
            alt={article.headline}
            className="max-h-64 object-cover rounded border"
          />
        </div>
      )}
    </div>
  );
}
