"use client";

import React, { useActionState, useTransition } from "react";
import { generateDraftArticle } from "@/actions/admin/generateDraftArticle";
import { saveGeneratedArticle } from "@/actions/admin/saveArticle";
import ReactMarkdown from "react-markdown";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner"

export default function NewsGenerator() {
  const [state, generateAction, isGenerating] = useActionState(generateDraftArticle, null);
  const [isSaving, startSaving] = useTransition();

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold">News Generator</h1>

      {/* Step 1: Generate Article */}
      {!state?.success && (
        <form action={generateAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              type="text"
              id="subject"
              name="subject"
              placeholder="Enter a topic..."
              disabled={isGenerating}
            />
          </div>

          <Button type="submit" disabled={isGenerating}>
            {isGenerating ? "Generating..." : "Generate Article"}
          </Button>

          {state?.error && <p className="text-sm text-red-500">{state.error}</p>}
        </form>
      )}

      {/* Step 2: Preview + Save */}
      {state?.success && (
        <Card>
          <CardContent className="space-y-4 pt-6">
            <h2 className="text-lg font-semibold">📝 Preview</h2>

            <div>
              <Label className="font-medium">Headline</Label>
              <p className="mt-1">{state.headline}</p>
            </div>

            <div>
              <Label className="font-medium">Summary</Label>
              <p className="mt-1">{state.summary}</p>
            </div>

            <div>
              <Label className="font-medium">Content</Label>
              <div className="prose dark:prose-invert mt-2 max-w-none">
                <ReactMarkdown>{state.content}</ReactMarkdown>
              </div>
            </div>

            <Button 
  onClick={() =>
    startSaving(async () => {
      const formData = new FormData();
      formData.append("headline", state.headline!);
      formData.append("summary", state.summary!);
      formData.append("content", state.content!);

      const result = await saveGeneratedArticle(formData);

      if (result.success) {
        toast("✅ Article saved!");
      } else {
        toast("❌ Failed to save article.");
      }
    })
  }
  disabled={isSaving}
  
>
  {isSaving ? "Saving..." : "Save Article"}
</Button>

          </CardContent>
        </Card>
      )}
    </div>
  );
}
