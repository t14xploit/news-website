"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createArticle, searchCategories } from "./actions";
import MultipleSelector, { Option } from "@/components/multiple-selector";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useActionState } from "react";

export default function CreateArticleForm() {
  const router = useRouter();
  const [selectedCategories, setSelectedCategories] = useState<Option[]>([]);

  const [state, formAction, isPending] = useActionState(
    createArticle.bind(null, selectedCategories.map((c) => c.value)),
    {
      values: {
        headline: "",
        summary: "",
        content: "",
      },
      errorMessage: "",
      success: false,
      articleId: "",
    }
  );

  // Redirect on success
  useEffect(() => {
    if (state.success && state.articleId) {
      router.push(`/admin/articles/${state.articleId}?created=1`);
    }
  }, [state, router]);

  async function handleCategorySearch(query: string) {
    const categories = await searchCategories(query);
    return categories.map((cat: { title: string }) => ({
      value: cat.title,
      label: cat.title,
    }));
  }

  return (
    <div className="container mx-auto my-12 space-y-6">
      <h1 className="text-4xl font-bold">Create Article</h1>
      <form className="space-y-4" action={formAction}>
        <div className="space-y-1.5">
          <Label htmlFor="headline">Headline</Label>
          <Input id="headline" name="headline" placeholder="Enter the headline" required />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="summary">Summary</Label>
          <Textarea id="summary" name="summary" placeholder="Enter the summary" required />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="content">Content</Label>
          <Textarea id="content" name="content" placeholder="Enter the content" rows={10} required />
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

        <div>
          <Label htmlFor="isEditorsChoice">Editor&apos;s Choice</Label>
          <input type="checkbox" name="isEditorsChoice" id="isEditorsChoice" />
        </div>

        <Button type="submit" disabled={isPending}>
          {isPending ? "Submitting..." : "Create Article"}
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
