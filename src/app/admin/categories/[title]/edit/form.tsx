"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useActionState } from "react";
import { editCategory } from "./actions";
import { Category } from "@/generated/prisma";


type Props = {
    category: Category;
}
export default function EditCategoryForm({category}:Props) {
  const [state, formAction, isPending] = useActionState(editCategory.bind(null, category.title), {
    error: "",
    message: "",
  });
  return (
    <div className="max-w-xl p-6 border-2 rounded-lg shadow-lg">

    <form action={formAction}>
      {state.message && <p>{state.message}</p>}
      {state.error && <p>{state.error}</p>}
      <div className="space-y-2 my-4">
        <Label htmlFor="title">Title</Label>
        <Input
          type="text"
          name="title"
          id="title"
          defaultValue={category.title}
          placeholder="Enter category name"
          required
        />
      </div>
      <Button type="submit" disabled={isPending}>
        {" "}
        {isPending ? "Submitting" : "Submit"}
      </Button>
    </form>
          </div>
  );
}
