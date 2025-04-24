import { Article, Category } from "@/generated/prisma/client";
import Link from "next/link";
import Image from "next/image";

interface ArticleWithCategories extends Article {
  categories: Category[];
}

interface SmallerArticleCardProps {
  article: ArticleWithCategories;
}

export default function SmallerArticleCard({ article }: SmallerArticleCardProps) {
  const fallbackImageUrl =
    "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=";

  return (
    <Link
      href={`/articles/${article.id}`}
      className="block p-4 border rounded-md hover:shadow-md transition"
    >
      <Image
        src={article.image || fallbackImageUrl}
        alt={article.headline}
        width={300}
        height={200}
        className="w-full h-40 object-cover mb-2 rounded-sm"
      />
      <h3 className="text-lg font-semibold mb-1">{article.headline}</h3>
      <p className="text-md text-gray-500">{new Date(article.createdAt).toLocaleDateString()}</p>
      <p className="mt-1 text-md line-clamp-3">{article.summary}</p>
      <div className="text-sm text-blue-600  font-bold mt-2">
        {article.categories.map((cat) => cat.title).join(", ")}
      </div>
    </Link>
  );
}
