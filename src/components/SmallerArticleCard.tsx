import { Article, Category } from "@/generated/prisma/client";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { Clock } from "lucide-react";

interface ArticleWithCategories extends Article {
  categories: Category[];
}

interface SmallerArticleCardProps {
  article: ArticleWithCategories;
}

export default function SmallerArticleCard({ article }: SmallerArticleCardProps) {
  const fallbackImageUrl =
    "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=";

  const timeAgo = formatDistanceToNow(new Date(article.createdAt), { addSuffix: true });

  return (
    <Link
      href={`/articles/${article.id}`}
      className="block p-4 border rounded-md hover:shadow-md transition bg-card text-card-foreground"
    >
      <Image
        src={article.image || fallbackImageUrl}
        alt={article.headline}
        width={300}
        height={200}
        className="w-35 h-35 object-cover mb-3 rounded"
      />
      <h3 className="text-md font-bold leading-snug mb-1 line-clamp-2">{article.headline}</h3>
      <p className="mb-1 text-sm text-muted-foreground line-clamp-3">{article.summary}</p>
      <hr />
      <p className="mt-4 text-xs text-foreground flex items-center gap-1">
 
  <span>{timeAgo} </span>
  <span>|</span>
  <span className="text-blue-600 font-medium ml-2">
  
    {article.categories.map((cat, index) => (
      <span  key={cat.id}>
        {index > 0 && ", "}
        {cat.title}
      </span>
    ))}
  </span>
</p>

    </Link>
  );
}
