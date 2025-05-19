import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import DeleteCategoryButton from "@/components/admin/categories/DeleteCategoryButton";

type Params = Promise<{
  title: string;
}>;

type Props = {
  params: Params;
};

export default async function CategoryPage(props: Props) {
  const params = await props.params;
  const categoryTitle = params.title;

  // Fetch category by title and include associated articles
  const category = await prisma.category.findUnique({
    where: { title: categoryTitle },
    include: {
      articles: {
        select: {
          id: true,
          headline: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  // If no category, return  page
  if (!category) return notFound();

  return (
    <div className="space-y-6 max-w-2xl py-8">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">{category.title}</h1>
          <p className="text-muted-foreground text-sm">ID: {category.id}</p>
        </div>

        {/* Edit and Delete Buttons */}
        <div className="flex items-center space-x-2">
          <Link href={`/admin/categories/${category.title}/edit`}>
            <Button className="cursor-pointer" variant="link" size="sm">
              <Edit className="w-4 h-4 mr-1" />
            </Button>
          </Link>
          <DeleteCategoryButton name={category.title} />
        </div>
      </div>

      {/* Articles List */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Articles in this Category
        </h2>

        {category.articles.length === 0 ? (
          <p className="text-muted-foreground">No articles assigned.</p>
        ) : (
          <ul className="space-y-3">
            {category.articles.map((article) => (
              <li
                key={article.id}
                className="flex items-center justify-between"
              >
                <div>
                  <Link
                    href={`/admin/articles/${article.id}`}
                    className="font-medium hover:underline"
                  >
                    {article.headline}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {new Date(article.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
