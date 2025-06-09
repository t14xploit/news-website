"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@/lib/context/user-context";
import { usePlan } from "@/components/subscribe/plan-context";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState, use } from "react";
import {
  getChannelArticle,
  deleteChannelArticle,
} from "@/actions/my-channel/article-actions";
import ArticleCard from "@/components/my-channel/article-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface Article {
  id: string;
  headline: string;
  summary: string;
  content: string;
  image: string | null;
  views: number;
  createdAt: Date;
  updatedAt: Date;
  isEditorsChoice: boolean;
  authors: { id: string; name: string | null; picture: string | null }[];
  categories: { id: string; title: string }[];
  organizationId: string | null;
  organization: {
    id: string;
    name: string;
    slug: string;
    logo: string | null;
    createdAt: Date;
    updatedAt: Date;
    metadata: string | null;
  } | null;
  isGlobalRepost: boolean;
  originalArticleId: string | null;
}

export default function ArticlePage({
  params,
}: {
  params: Promise<{ articleId: string }>;
}) {
  const { sessionUser, isLoading: isUserLoading, isEditor } = useUser();
  const { currentPlan, isLoading: isPlanLoading } = usePlan();
  const { data: activeOrganization } = authClient.useActiveOrganization();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [isArticleLoading, setIsArticleLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { articleId } = use(params);

  useEffect(() => {
    console.log("ArticlePage State:", {
      sessionUser: sessionUser
        ? { id: sessionUser.id, role: sessionUser.role }
        : null,
      isEditor,
      isUserLoading,
      currentPlan,
      activeOrganization: activeOrganization
        ? { id: activeOrganization.id, name: activeOrganization.name }
        : null,
      articleId,
    });
  }, [
    sessionUser,
    isEditor,
    isUserLoading,
    currentPlan,
    activeOrganization,
    articleId,
  ]);

  useEffect(() => {
    async function fetchArticle() {
      if (!activeOrganization) return;
      try {
        const articleData = await getChannelArticle(
          activeOrganization.id,
          articleId
        );
        if (!articleData) {
          throw new Error("Article not found");
        }
        setArticle({
          ...articleData,
          createdAt: new Date(articleData.createdAt),
          updatedAt: new Date(articleData.updatedAt),
          authors: articleData.authors.map((author) => ({
            ...author,
            name: author.name ?? "Unknown Author",
          })),
          organization: articleData.organization
            ? {
                ...articleData.organization,
                createdAt: new Date(articleData.organization.createdAt),
                updatedAt: new Date(articleData.organization.updatedAt),
              }
            : null,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load article");
      } finally {
        setIsArticleLoading(false);
      }
    }
    fetchArticle();
  }, [activeOrganization, articleId]);

  if (isUserLoading || isPlanLoading || isArticleLoading) {
    return (
      <div className="container mx-auto p-4 max-w-2xl space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-6 w-full" />
      </div>
    );
  }

  if (!sessionUser) {
    console.warn("Redirecting: No session user");
    return null;
  }

  if (!activeOrganization) {
    console.warn("Redirecting: No active organization");
    router.push("/my-channel/create-channel");
    return null;
  }

  if (!isEditor || currentPlan !== "Business") {
    return (
      <div className="container mx-auto p-4 max-w-2xl">
        <Alert variant="destructive">
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You need a Business subscription and editor role to view articles.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="container mx-auto p-4 max-w-2xl">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error || "Article not found"}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const handleDelete = async () => {
    try {
      const result = await deleteChannelArticle(
        activeOrganization.id,
        article.id
      );
      if (result.success) {
        toast.success("Article deleted successfully!");
        router.push("/my-channel/articles");
      } else {
        toast.error(result.error || "Failed to delete article");
      }
    } catch {
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      {isEditor && (
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold">See the details or edit</h1>
          <div className="flex gap-4">
            <Button asChild className="btn-white">
              <Link href={`/my-channel/articles/${article.id}/edit`}>
                Edit Article
              </Link>
            </Button>
            {(sessionUser.role === "admin" || sessionUser.role === "owner") && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Delete Article</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      the article.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      )}
      <ArticleCard
        article={{
          id: article.id,
          headline: article.headline,
          summary: article.summary,
          imageUrl: article.image,
          authorName: article.authors[0]?.name || "Unknown Author",
          authorImageUrl: article.authors[0]?.picture,
          publishDate: article.createdAt,
          views: article.views,
          organizationName: article.organization?.name,
        }}
      />
    </div>
  );
}
