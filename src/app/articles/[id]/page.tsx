import { prisma } from "@/lib/prisma";
import ArticleViewTracker from "@/components/ArticleViewTracker";
import Image from "next/image";
import { CalendarDays, Eye } from "lucide-react"; // optional: icons from lucide or use your own

export default async function ArticlePage({ params }: { params: { id: string } }) {
  const article = await prisma.article.findUnique({
    where: { id: params.id },
    include: {
      authors: true, // Get associated authors
    },
  });

  const fallbackImageUrl =
    "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=";

  if (!article) return <div>Article not found.</div>;

  return (
    <div className="space-y-4 my-4 font-inika">
      <h1 className="text-3xl font-bold">{article.headline}</h1>

      {/* Meta info: Authors, date, views */}
      <div className="flex items-center gap-6 text-sm text-gray-500 flex-wrap">
        {article.authors.map((author) => (
          <div key={author.id} className="flex items-center gap-2">
            <Image
              src={author.picture ?? fallbackImageUrl}
              alt={author.name}
              width={500}
              height={500}
              className="rounded-full w-10 h-10 object-cover"
            />
            <span>{author.name}</span>
          </div>
        ))}

        <div className="flex items-center gap-1">
          <CalendarDays className="w-4 h-4" />
          <span>{new Date(article.createdAt).toLocaleDateString()}</span>
        </div>

        <div className="flex items-center gap-1">
          <Eye className="w-4 h-4" />
          <span>{article.views} views</span>
        </div>
      </div>

      {/* img and summary */}
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

      {/* Article content */}
      <div className="mt-4">{article.content}</div>

      {/* Increment view count */}
      <ArticleViewTracker articleId={article.id} />
    </div>
  );
}
