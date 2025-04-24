import { getArticlesForLandingPage } from "@/actions/articles";
import ApiPlaceholder from "@/components/ApiPlaceholder";
import MainArticleCard from "@/components/MainArticleCard";
import SmallerArticleCard from "@/components/SmallerArticleCard";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  //temp
  const categories = [
    'Sports', 'Politics', 'Technology', 'Finance', 'Education',
    'Entertainment', 'Art', 'Culture', 'Local'
  ];
  const { mainArticle, smallerArticles } = await getArticlesForLandingPage();

  return (
<>
 
<main className="flex flex-col justify-between py-8 px-6 bg-background text-foreground font-intrument">
      <div className="flex items-center gap-4 mb-6 font-instrument">
        <Button variant="destructive" >
          LIVE 🔴
        </Button>

        <div className="ml-20 flex gap-4 overflow-x-auto">
          {categories.map((category, index) => (
            <Link
              key={index}
              href={`/${category.toLowerCase()}`}
              className="px-4 py-2 rounded-lg hover:bg-muted hover:text-primary transition whitespace-nowrap"
            >
              {category}
            </Link>
          ))}
        </div>
        
        <div className="ml-auto">
          <Button variant="link" aria-label="Search" >
            <Search />
          </Button>
        </div>
      </div>
<ApiPlaceholder/>

    </main>
    <section>
    <div className="space-y-8">
      {mainArticle && <MainArticleCard article={mainArticle} />}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {smallerArticles.map(article => (
          <SmallerArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
    </section>
    </>
  
  );
}
