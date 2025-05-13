"use client";
import { deleteArticle } from "@/actions/admin/delete-article";
import { useState } from "react";
import { Trash } from "lucide-react";
import { ClipLoader } from "react-spinners"; // Make sure to install react-spinners
import { Button } from "@/components/ui/button";

interface DeleteArticleButtonProps {
  articleId: string;
}

export default function DeleteArticleButton({ articleId }: DeleteArticleButtonProps) {
  const [isPending, setIsPending] = useState(false);

  async function handleClick() {
    const result = confirm("Are you sure you want to delete this article?");
    if (!result) return;
    setIsPending(true);

    await deleteArticle(articleId);
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
