import { prisma } from "@/lib/prisma";
import ArticleViewTracker from "@/components/ArticleViewTracker";
import Image from "next/image";
import { CalendarDays, Eye } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from 'react-markdown'

type Params = Promise<{
  id: string;
}>;

interface ArticlePageProps {
  params: Params;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const resolvedParams = await params;
  const articleId = resolvedParams.id;

  const article = await prisma.article.findUnique({
    where: { id: articleId },
    include: {
      authors: true,
    },
  });

  if (!article) {
    return <div>Article not found.</div>;
  }

  const fallbackImageUrl =
    "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=";

  return (
    <div className="space-y-4 my-4">
      <h1 className="text-3xl font-bold">{article.headline}</h1>

      {/* Meta info */}
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
            <Link href={`/authors/${author.id}`}>
            <span className="hover:underline">{author.name}</span>
            </Link>
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

      {/* Image and summary */}
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

      {/* Full content */}
      <div className="mt-4 prose dark:prose-invert max-w-full w-full">
        <ReactMarkdown>
                {article.content} 
                </ReactMarkdown>
        </div>

      {/* View tracker */}
      <ArticleViewTracker articleId={article.id} />
    </div>
  );
}
