"use client";

import { useState, useTransition, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import {
  getChannelArticle,
  updateChannelArticle,
  deleteChannelArticle,
  getCategories,
} from "@/actions/my-channel/article-actions";
import { useUser } from "@/lib/context/user-context";
import { authClient } from "@/lib/auth-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import MultipleSelector, { Option } from "@/components/multiple-selector";

// Define Article interface based on getChannelArticle response
interface Article {
  id: string;
  headline: string;
  summary: string;
  content: string;
  image: string | null;
  views: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  isEditorsChoice: boolean;
  authors: { id: string; name: string | null; picture: string | null }[];
  categories: { id: string; title: string }[];
  organizationId: string | null;
  organization: {
    id: string;
    name: string;
    slug: string;
    logo: string | null;
    createdAt: Date | string;
    updatedAt: Date | string;
    metadata: string | null;
  } | null;
  isGlobalRepost: boolean;
  originalArticleId: string | null;
}

const updateArticleSchema = z.object({
  headline: z.string().min(1, "Headline is required"),
  summary: z.string().min(1, "Summary is required"),
  content: z.string().min(1, "Content is required"),
  image: z.string().url().optional().or(z.literal("")),
  categories: z.array(z.string()).optional(),
});

type UpdateArticleFormData = z.infer<typeof updateArticleSchema>;

export default function EditArticlePage({
  params,
}: {
  params: Promise<{ articleId: string }>;
}) {
  const { sessionUser, isLoading: userLoading } = useUser();
  const { data: activeOrganization } = authClient.useActiveOrganization();
  const [article, setArticle] = useState<Article | null>(null);
  const [categories, setCategories] = useState<Option[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { articleId } = use(params); // Unwrap params with React.use()

  useEffect(() => {
    async function fetchData() {
      if (!activeOrganization) return;
      try {
        const [articleData, categoryData] = await Promise.all([
          getChannelArticle(activeOrganization.id, articleId),
          getCategories(),
        ]);
        if (!articleData) throw new Error("Article not found");
        setArticle(articleData);
        setCategories(
          categoryData.map((cat) => ({ value: cat.id, label: cat.title }))
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [activeOrganization, articleId]);

  if (userLoading || isLoading) {
    return (
      <div className="container mx-auto py-8">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-6 w-full mt-4" />
        <Skeleton className="h-12 w-full mt-4" />
      </div>
    );
  }

  if (!sessionUser || !activeOrganization || !article || error) {
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {error || "Unable to load article"}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <EditArticleForm
      article={article}
      orgId={activeOrganization.id}
      articleId={articleId}
      categories={categories}
    />
  );
}

function EditArticleForm({
  article,
  orgId,
  articleId,
  categories,
}: {
  article: Article;
  orgId: string;
  articleId: string;
  categories: Option[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<UpdateArticleFormData>({
    resolver: zodResolver(updateArticleSchema),
    defaultValues: {
      headline: article.headline || "",
      summary: article.summary || "",
      content: article.content || "",
      image: article.image || "",
      categories: article.categories.map((cat) => cat.id) || [],
    },
  });

  const onSubmit = async (data: UpdateArticleFormData) => {
    setError(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.append("headline", data.headline);
      formData.append("summary", data.summary);
      formData.append("content", data.content);
      if (data.image) formData.append("image", data.image);
      if (data.categories?.length)
        formData.append("categories", data.categories.join(","));

      const result = await updateChannelArticle(orgId, articleId, formData);
      if (result.success) {
        router.push(`/my-channel/articles/${articleId}`);
      } else {
        setError(result.error || "Failed to update article");
      }
    });
  };

  const handleDelete = async () => {
    startTransition(async () => {
      const result = await deleteChannelArticle(orgId, articleId);
      if (result.success) {
        router.push("/my-channel/articles");
      } else {
        setError(result.error || "Failed to delete article");
      }
    });
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Article</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="headline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Headline</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="summary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Summary</FormLabel>
                    <FormControl>
                      <Textarea {...field} disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={10} disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categories</FormLabel>
                    <FormControl>
                      <MultipleSelector
                        value={categories.filter((cat) =>
                          field.value?.includes(cat.value)
                        )}
                        onChange={(selected) =>
                          field.onChange(selected.map((opt) => opt.value))
                        }
                        options={categories}
                        placeholder="Select Categories"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={isPending}
                  className="btn-white"
                >
                  {isPending ? "Updating..." : "Update Article"}
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      type="button"
                      variant="destructive"
                      disabled={isPending}
                      className="rounded-"
                    >
                      Delete Article
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the article.
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
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
