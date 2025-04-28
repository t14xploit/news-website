import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { ArrowBigRight, PawPrint } from "lucide-react";
import { fetchCategoryData } from "@/actions/category";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; 

interface CategoryPageProps {
  params: { name: string };
}

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

const CategoryPage = async ({ params }: CategoryPageProps) => {
  let categoryData: CategoryData | null = null;

  try {
    // category data from the server action
    categoryData = await fetchCategoryData(params.name);
  } catch (error) {
    return <div className="my-6"> <Alert >
    <PawPrint className="w-6 h-6 "/>          <div>
                <AlertTitle>Category not found</AlertTitle>
                <AlertDescription>
                  Looks like there are no categories with such name. Check back later for new content!
                </AlertDescription>
              </div>
            </Alert></div>;
  }

  return (
    <div className="container space-y-6 my-6 font-inika">
      {/* Articles Section */}
      <h2 className="text-2xl font-semibold flex items-center">
        Articles in {categoryData?.title}
        <ArrowBigRight className="w-6 h-6 text-foreground" />
      </h2>

      {/* Display alert if no articles are found */}
      {categoryData?.articles.length === 0 ? (
        <Alert >
<PawPrint className="w-6 h-6 "/>          <div>
            <AlertTitle>No Articles in This Category</AlertTitle>
            <AlertDescription>
              Looks like there are no articles in this category. Check back later for new content!
            </AlertDescription>
          </div>
        </Alert>
      ) : (
        // Grid Layout for Articles
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryData?.articles.map((article) => (
            <Card key={article.id} className="p-4 space-y-2 shadow-lg hover:shadow-xl transition-all">
              {/* Article Card */}
              <CardHeader className="space-y-1">
                <h3 className="text-xl font-bold line-clamp-1">{article.headline}</h3>
                <p className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(article.createdAt), { addSuffix: true })}
                </p>
              </CardHeader>
              <CardContent className="space-y-2">
                {/* Article Summary */}
                <p className="text-sm line-clamp-3">{article.summary}</p>

                {/* Authors info */}
                <div className="mt-1">
                  <p className="text-sm text-muted-foreground">Written by:</p>
                  <div className="flex flex-wrap space-x-2">
                    {article.authors.map((author, index) => (
                      <span key={author.id} className="text-sm text-primary">
                        {author.name}{index < article.authors.length - 1 ? ", " : ""}
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
