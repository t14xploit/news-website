"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createArticle, searchAuthors, searchCategories } from "./actions";
import MultipleSelector, { Option } from "@/components/multiple-selector";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useActionState } from "react";

export default function CreateArticleForm() {
  const router = useRouter();
  const [selectedCategories, setSelectedCategories] = useState<Option[]>([]);
  const [selectedAuthors, setSelectedAuthors] = useState<Option[]>([]);

  const [state, formAction, isPending] = useActionState(
    createArticle.bind(null, selectedCategories.map((c) => c.value),
    selectedAuthors.map((a) => a.value)),
    {
      values: {
        headline: "",
        summary: "",
        content: "",
        image:"",
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
  async function handleAuthorSearch(query: string) {
    const authors = await searchAuthors(query);
    return authors.map((author: { name: string }) => ({
      value: author.name,
      label: author.name,
    }));
  }
  
  return (
    <div className="container  my-12 space-y-6 max-w-2xl">
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
                    <Label 
                    htmlFor="image">Image URL:</Label>
                    <Input type="text"  name="image" id="image" />  
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
