import { prisma } from "@/lib/prisma";
import { ArrowBigRight } from "lucide-react";
import Link from "next/link";

export default async function MostViewed() {
  const articles = await prisma.article.findMany({
    orderBy: { views: "desc" },
    take: 8,
  });

  return (
    <section className="py-10">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        Most viewed <ArrowBigRight className="w-6 h-6 text-primary" />
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
        {articles.map((article, index) => (
          <div key={article.id} className="flex gap-4 items-start">
            <div className="text-5xl font-bold text-gray-300 leading-none">
              {index + 1}
            </div>
            <div>
              <h3 className="text-md font-semibold">
                <Link href={`/articles/${article.id}`} className="hover:underline text-primary">
                  {article.headline}
                </Link>
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{article.summary}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
