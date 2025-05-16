"use client";
import { deleteCategory } from "@/actions/admin/delete-category";
import { useState } from "react";
import { Trash } from "lucide-react";
import { ClipLoader } from "react-spinners"; 
import { Button } from "@/components/ui/button";

interface DeleteCategoryButtonProps {
  name: string;
}

export default function DeleteCategoryButton({ name }: DeleteCategoryButtonProps) {
  const [isPending, setIsPending] = useState(false);

  async function handleClick() {
    const result = confirm("Are you sure you want to delete this category?");
    if (!result) return;
    setIsPending(true);

    await deleteCategory(name);
    setIsPending(false);
  }

  return (
    <Button
      variant={"ghost"}
      onClick={handleClick}
      className="cursor-pointer w-10 h-10"
      disabled={isPending}
    >
      {isPending ? (
        <span className="flex items-center space-x-2">
          <ClipLoader size={20} color="#f87171" />
          <span>
            <Trash className="w-10 h-10 text-red-600" />
          </span>
        </span>
      ) : (
        <Trash className="w-10 h-10 text-red-600" />
      )}
    </Button>
  );
}
