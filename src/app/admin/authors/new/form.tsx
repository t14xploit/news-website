"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useActionState } from "react";
import { createAuthor } from "./actions";

export default function CreateAuthorForm() {
  const [state, formAction, isPending] = useActionState(createAuthor, {
    error: "",
    message: "",
  });

  return (
    <div className="max-w-xl p-6 border-2 rounded-lg shadow-lg">
      <form action={formAction}>
        {state.message && <p className="text-blue-600 mb-2">{state.message}</p>}
        {state.error && <p className="text-red-600 mb-2">{state.error}</p>}

        <div className="space-y-2 my-4">
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            name="name"
            id="name"
            placeholder="Enter author name"
            required
          />
        </div>

        <div className="space-y-2 my-4">
          <Label htmlFor="image">Image URL</Label>
          <Input
            type="text"
            name="image"
            id="image"
            placeholder="Image URL (optional)"
          />
        </div>

        <Button type="submit" disabled={isPending}>
          {isPending ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </div>
  );
}
