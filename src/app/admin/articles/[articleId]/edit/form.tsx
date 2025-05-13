"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { editArticle, searchAuthors, searchCategories } from "./actions";
import MultipleSelector, { Option } from "@/components/multiple-selector";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useActionState } from "react";

type Category = { title: string };
type Author = { name: string };

type Article = {
  id: string;
  headline: string;
  summary: string;
  content: string;
  image: string|null;
  categories: Category[];
  authors: Author[];
};

interface EditArticleFormProps {
  article: Article;
}

export default function EditArticleForm({ article }: EditArticleFormProps) {
  const router = useRouter();
  const [selectedCategories, setSelectedCategories] = useState<Option[]>([]);
  const [selectedAuthors, setSelectedAuthors] = useState<Option[]>([]);

  const [state, formAction, isPending] = useActionState(
    async (state: unknown, payload: unknown) => {
      const formData = payload as FormData;
      return await editArticle(
        selectedCategories.map((c) => c.value),
        selectedAuthors.map((a) => a.value),
        article.id,  
        state,
        formData
      );
    },
    {
      values: {
        headline: article.headline,
        summary: article.summary,
        content: article.content,
        image: article.image || "", // Fallback to empty string if image is null
      },
      errorMessage: "",
      success: false,
      articleId: article.id,
    }
  );
  

  useEffect(() => {
    if (article) {
      setSelectedCategories(
        article.categories.map((category) => ({ value: category.title, label: category.title }))
      );
      setSelectedAuthors(
        article.authors.map((author) => ({ value: author.name, label: author.name }))
      );
    }
  }, [article]);

  useEffect(() => {
    if (state.success && state.articleId) {
      router.push(`/admin/articles/${state.articleId}?created=1`);
    }
  }, [state, router]);

  async function handleCategorySearch(query: string) {
    const categories = await searchCategories(query);
    return categories.map((cat: Category) => ({
      value: cat.title,
      label: cat.title,
    }));
  }

  async function handleAuthorSearch(query: string) {
    const authors = await searchAuthors(query);
    return authors.map((author: Author) => ({
      value: author.name,
      label: author.name,
    }));
  }

  return (
    <div className="container mx-auto my-12 space-y-6 max-w-2xl">
      <form className="space-y-4" action={formAction}>
        <div className="space-y-1.5">
          <Label htmlFor="headline">Headline</Label>
          <Input
            id="headline"
            name="headline"
            defaultValue={state.values.headline}
            placeholder="Enter the headline"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="summary">Summary</Label>
          <Textarea
            id="summary"
            name="summary"
            defaultValue={state.values.summary}
            placeholder="Enter the summary"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            name="content"
            defaultValue={state.values.content}
            placeholder="Enter the content"
            rows={10}
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="image">Image URL:</Label>
          <Input type="text" name="image" id="image" defaultValue={state.values.image} />
        </div>

        <div className="space-y-1.5">
          <Label>Categories</Label>
          <MultipleSelector
            onSearch={handleCategorySearch}
            value={selectedCategories}
            onChange={setSelectedCategories}
            creatable
            placeholder="Select categories..."
            loadingIndicator={
              <p className="py-2 text-center text-lg leading-10 text-muted-foreground">loading...</p>
            }
            emptyIndicator={
              <p className="w-full text-center text-lg leading-10 text-muted-foreground">no results found.</p>
            }
          />
        </div>

        <div className="space-y-1.5">
          <Label>Authors</Label>
          <MultipleSelector
            onSearch={handleAuthorSearch}
            value={selectedAuthors}
            onChange={setSelectedAuthors}
            creatable
            placeholder="Type or select authors..."
            loadingIndicator={
              <p className="py-2 text-center text-lg leading-10 text-muted-foreground">loading...</p>
            }
            emptyIndicator={
              <p className="w-full text-center text-lg leading-10 text-muted-foreground">no authors found.</p>
            }
          />
        </div>

        <div className="space-y-1.5 flex items-center">
      <Label htmlFor="isEditorsChoice" className="mr-2">Editor&apos;s Choice</Label>
      <input type="checkbox" name="isEditorsChoice" id="isEditorsChoice" className="ml-2" />
    </div>

        <Button type="submit" disabled={isPending}>
          {isPending ? "Submitting..." : "Update Article"}
        </Button>

        {state.errorMessage && (
          <Alert variant="destructive">
            <AlertTitle>Error!</AlertTitle>
            <AlertDescription>{state.errorMessage}</AlertDescription>
          </Alert>
        )}
      </form>
    </div>
  );
}
