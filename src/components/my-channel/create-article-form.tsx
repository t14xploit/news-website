"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  createChannelArticle,
  getCategories,
} from "@/actions/my-channel/article-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import MultipleSelector, { Option } from "@/components/multiple-selector";
import { useUser } from "@/lib/context/user-context";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface CreateArticleFormProps {
  organizationId: string;
  channelName: string;
}

const createArticleSchema = z.object({
  headline: z.string().min(3, "Headline must be at least 3 characters"),
  summary: z.string().min(10, "Summary must be at least 10 characters"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  image: z.string().url().optional().or(z.literal("")),
  categories: z.array(z.string()).optional(),
});

type CreateArticleFormData = z.infer<typeof createArticleSchema>;

export default function CreateArticleForm({
  organizationId,
  channelName,
}: CreateArticleFormProps) {
  const { isEditor, isLoading: userLoading } = useUser();
  const router = useRouter();
  const [availableCategories, setAvailableCategories] = useState<Option[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<CreateArticleFormData>({
    resolver: zodResolver(createArticleSchema),
    defaultValues: {
      headline: "",
      summary: "",
      content: "",
      image: "",
      categories: [],
    },
  });

  useEffect(() => {
    async function fetchCategories() {
      try {
        const categoryData = await getCategories();
        const options = categoryData.map((cat) => ({
          value: cat.id,
          label: cat.title,
        }));
        setAvailableCategories(options);
        console.log("Fetched categories:", options);
        if (options.length === 0) {
          setError(
            "No categories available. Please add categories in your database."
          );
          toast.warning("No categories found");
        }
      } catch (err) {
        setError("Failed to load categories");
        console.error("Fetch categories error:", err);
        toast.error("Failed to load categories");
      } finally {
        setIsLoading(false);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    console.log("CreateArticleForm State:", {
      isEditor,
      userLoading,
      availableCategories,
      isLoading,
      organizationId,
      channelName,
    });
  }, [
    isEditor,
    userLoading,
    availableCategories,
    isLoading,
    organizationId,
    channelName,
  ]);

  if (userLoading || isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (!isEditor) {
    return (
      <Card className="p-4 text-center">
        <CardHeader>
          <CardTitle>Access Denied</CardTitle>
        </CardHeader>
        <CardContent>
          You must be an editor to create articles for {channelName}.
        </CardContent>
      </Card>
    );
  }

  const onSubmit = async (data: CreateArticleFormData) => {
    setError(null);
    const formData = new FormData();
    formData.append("headline", data.headline);
    formData.append("summary", data.summary);
    formData.append("content", data.content);
    if (data.image) formData.append("image", data.image);
    if (data.categories?.length) {
      formData.append("categories", data.categories.join(","));
    }

    try {
      const result = await createChannelArticle(organizationId, formData);
      console.log("Create article result:", result);
      if (result.success && result.articleId) {
        toast.success("Article created successfully!");
        router.push(`/my-channel/articles/${result.articleId}`);
      } else {
        setError(result.error || "Failed to create article");
        toast.error(result.error || "Failed to create article", {
          description:
            result.status === 401
              ? "Please log in to continue"
              : result.status === 403
              ? "You do not have permission to create this article"
              : "An unexpected error occurred",
        });
      }
    } catch (err) {
      console.error("Create article error:", err);
      setError("An unexpected error occurred");
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <FormField
          control={form.control}
          name="headline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Headline</FormLabel>
              <FormControl>
                <Input placeholder="Article Headline" {...field} />
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
                <Textarea
                  placeholder="Article Summary"
                  {...field}
                  rows={5}
                  className="resize-y"
                />
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
                <Textarea
                  placeholder="Article Content"
                  {...field}
                  rows={10}
                  className="resize-y"
                />
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
              <FormLabel>Image URL (optional)</FormLabel>
              <FormControl>
                <Input placeholder="Image URL" {...field} />
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
                  value={availableCategories.filter((cat) =>
                    field.value?.includes(cat.value)
                  )}
                  onChange={(selected) =>
                    field.onChange(selected.map((opt) => opt.value))
                  }
                  options={availableCategories}
                  placeholder="Select Categories"
                  emptyIndicator="No categories available"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="btn-white"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Creating..." : "Create Article"}
        </Button>
      </form>
    </Form>
  );
}
