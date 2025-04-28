import { prisma } from "@/lib/prisma";
import ArticleViewTracker from "@/components/ArticleViewTracker";
import Image from "next/image";

export default async function ArticlePage({ params }: { params: { id: string } }) {
  const article = await prisma.article.findUnique({
    where: { id: params.id },
  });
  const fallbackImageUrl =
  "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=";

  if (!article) return <div>Article not found.</div>;

  return (
    <div className="space-y-4 my-4">
      <h1 className="text-3xl font-bold">{article.headline}</h1>
     
     <div className="flex gap-4 items-center text-center">
         <Image
                src={article.image && article.image !== "" ? article.image : fallbackImageUrl}
                alt={article.headline}
                width={500}
                height={500}
                className="w-[50%] h-[50%] object-cover rounded-md mb-6"
                />
      <p className="text-gray-600">{article.summary}</p>
                </div>
      <div className="mt-4">{article.content}</div>

      {/* This will trigger view count increment on load */}
      <ArticleViewTracker articleId={article.id} />
    </div>
  );
}
