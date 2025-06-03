import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { fetchCategoryData } from "@/actions/category";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import { FiAlertCircle } from "react-icons/fi";

type Params = Promise<{ name: string }>;

interface Article {
  id: string;
  headline: string;
  summary: string;
  createdAt: Date;
  authors: { id: string; name: string }[];
}

interface CategoryData {
  title: string;
  articles: Article[];
}

interface Props {
  params: Params;
}

const CategoryPage = async (props: Props) => {
  const { name } = await props.params;

  let categoryData: CategoryData | null = null;

  try {
    categoryData = await fetchCategoryData(name);
  } catch (error) {
console.log(error)
    return (
      <div className="my-6">
        <Alert variant={"destructive"}>
          <FiAlertCircle/>
          <div>
            <AlertTitle>Category not found</AlertTitle>
            <AlertDescription>
              Looks like there are no categories with such name. Check back later for new content!
            </AlertDescription>
          </div>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container space-y-6 my-6">
      <h2 className="text-2xl font-semibold flex items-center">
        Articles in {categoryData.title}
      </h2>

      {categoryData.articles.length === 0 ? (
        <Alert variant={"destructive"}>

          <FiAlertCircle/>
          <div>
            <AlertTitle className=" text-red-900 dark:text-red-300 font-bold">No Articles in This Category

            </AlertTitle>
            <AlertDescription>
              Looks like there are no articles in this category. Check back later for new content!
            </AlertDescription>
          </div>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryData.articles.map((article) => (
            <Card key={article.id} className="p-4 space-y-2 shadow-lg hover:shadow-xl transition-all">
              <CardHeader className="space-y-1">
              <Link href={`/articles/${article.id}`}>
                <h3 className="text-xl font-bold line-clamp-1 hover:underline">{article.headline}</h3>
               </Link>
                <p className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(article.createdAt), { addSuffix: true })}
                </p>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm line-clamp-3">{article.summary}</p>
                <div className="mt-1">
                  <p className="text-sm text-muted-foreground">Written by:</p>
                  <div className="flex flex-wrap space-x-2">
                    {article.authors.map((author, index) => (
                      <span key={author.id} className="text-sm text-primary">
                        <Link href={`/authors/${author.id}`} className="hover:underline">
                         {author.name}
                        </Link>
                        {index < article.authors.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
