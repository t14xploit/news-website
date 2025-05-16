"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useActionState } from "react";
import { editAuthor } from "./actions";
import MultipleSelector, { Option } from "@/components/multiple-selector";
import { useState } from "react";
import { searchArticles } from "./actions"; 

type EditAuthorFormProps = {
  authorId: string;
  name: string;
  image: string | null;
  articles: { id: string; headline: string }[];
};

export default function EditAuthorForm({ authorId, name, image, articles }: EditAuthorFormProps) {
  const [selectedArticles, setSelectedArticles] = useState<Option[]>(
    articles.map((article) => ({ value: article.id, label: article.headline })) // Pre-select associated articles
  );

  const [state, formAction, isPending] = useActionState(
    async (prevState: { success: boolean; message: string; error: string }, formData: FormData) => {
      const result = await editAuthor(selectedArticles.map((a) => a.value), authorId, prevState, formData);
  
      return {
        success: result.success,
        message: result.message,
        error: result.error,
      };
    },
    {
      success: false, 
      message: "",
      error: "",
    }
  );

  async function handleArticleSearch(query: string) {
    const articles = await searchArticles(query);
    return articles.map((a: { id: string; headline: string }) => ({
      value: a.id,
      label: a.headline,
    }));
  }

  return (
    <div className="max-w-xl mt-6">
      <form action={formAction}>
        {state.message && <p className="text-blue-600 mb-2">{state.message}</p>}
        {state.error && <p className="text-red-600 mb-2">{state.error}</p>}

        {/* Name */}
        <div className="space-y-2 my-4">
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            name="name"
            id="name"
            placeholder="Enter author name"
            defaultValue={name} // Ensure default value is set
            required
          />
        </div>

        {/* Image URL */}
        <div className="space-y-2 my-4">
          <Label htmlFor="image">Image URL</Label>
          <Input
            type="text"
            name="image"
            id="image"
            placeholder="Image URL (optional)"
            defaultValue={image || ""} // Set default to an empty string if image is null
          />
        </div>

        {/* Articles Selector */}
        <div className="space-y-2 my-4">
          <Label>Articles</Label>
          <MultipleSelector
            value={selectedArticles}
            onChange={setSelectedArticles}
            onSearch={handleArticleSearch}
            placeholder="Select existing articles..."
            creatable={false} // Disallow creating new articles
          />
        </div>

        <Button type="submit" disabled={isPending}>
          {isPending ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </div>
  );
}
