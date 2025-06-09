// "use client";

// import { useEffect, useState } from "react";
// import { Skeleton } from "@/components/ui/skeleton";
// import ChannelArticleRow from "./channel-article-row";
// import { getArticlesForOrganization } from "@/actions/my-channel/get-articles";

// interface Article {
//   id: string;
//   headline: string;
//   summary: string;
//   imageUrl?: string | null;
//   authorName: string;
//   authorImageUrl?: string | null;
//   publishDate: Date;
//   views?: number;
//   commentCount?: number;
//   isPinned?: boolean;
// }

// export default function ArticleList({
//   organizationId,
// }: {
//   organizationId: string;
// }) {
//   const [articles, setArticles] = useState<Article[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     async function load() {
//       setIsLoading(true);
//       const list = await getArticlesForOrganization(organizationId);
//       setArticles(list);
//       setIsLoading(false);
//     }
//     load();
//   }, [organizationId]);

//   if (isLoading) {
//     // show 3 skeleton rows
//     return (
//       <div className="divide-y divide-border">
//         {[1, 2, 3].map((i) => (
//           <div
//             key={i}
//             className="flex items-start justify-between space-x-4 py-6"
//           >
//             <div className="flex-1 space-y-2">
//               <Skeleton className="h-4 w-24" />
//               <Skeleton className="h-6 w-3/4" />
//               <div className="flex space-x-2">
//                 <Skeleton className="h-4 w-16" />
//                 <Skeleton className="h-4 w-10" />
//               </div>
//             </div>
//             <Skeleton className="h-24 w-40 rounded-sm" />
//           </div>
//         ))}
//       </div>
//     );
//   }

//   return (
//     <div className="divide-y divide-border">
//       {articles.map((article) => (
//         <ChannelArticleRow key={article.id} article={article} />
//       ))}
//     </div>
//   );
// }

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

interface CreateArticleFormProps {
  organizationId: string;
  channelName: string;
}

export default function CreateArticleForm({
  organizationId,
  channelName,
}: CreateArticleFormProps) {
  const { isEditor, isLoading: userLoading } = useUser();
  const router = useRouter();
  const [headline, setHeadline] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [categories, setCategories] = useState<Option[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      const categoryData = await getCategories();
      setCategories(
        categoryData.map((cat) => ({ value: cat.id, label: cat.title }))
      );
      setIsLoading(false);
    }
    fetchCategories();
  }, []);

  if (userLoading || isLoading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-40 w-full" />
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("headline", headline);
    formData.append("summary", summary);
    formData.append("content", content);
    if (image) formData.append("image", image);
    if (categories.length) {
      formData.append(
        "categories",
        categories.map((cat) => cat.value).join(",")
      );
    }

    try {
      const result = await createChannelArticle(organizationId, formData);
      if (result.success) {
        toast.success("Article created successfully!");
        router.push(`/my-channel/articles/${result.articleId}`);
      } else {
        toast.error(result.error || "Failed to create article", {
          description:
            result.status === 401
              ? "Please log in to continue"
              : result.status === 403
              ? "You do not have permission to create this article"
              : "An unexpected error occurred",
        });
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Article Headline"
        value={headline}
        onChange={(e) => setHeadline(e.target.value)}
        required
      />
      <Textarea
        placeholder="Article Summary"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        required
      />
      <Textarea
        placeholder="Article Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={10}
        required
      />
      <Input
        placeholder="Image URL (optional)"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <MultipleSelector
        value={categories}
        onChange={setCategories}
        options={categories}
        placeholder="Select Categories"
      />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create Article"}
      </Button>
    </form>
  );
}
