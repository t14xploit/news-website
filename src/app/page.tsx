import { getArticlesForLandingPage } from "@/actions/articles";
import ApiPlaceholder from "@/components/ApiPlaceholder";
import EditorsChoiceSection from "@/components/EditorsChoiceSection";
import LatestNewsBlock from "@/components/LatestNewsBlock";
import MainArticleCard from "@/components/MainArticleCard";
import SmallerArticleCard from "@/components/SmallerArticleCard";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const categories = [
    'Sports', 'Politics', 'Technology', 'Finance', 'Education',
    'Entertainment', 'Art', 'Culture', 'Local'
  ];

  const { mainArticle, smallerArticles, editorsChoice } = await getArticlesForLandingPage();

  return (
    <>
      <main className="flex flex-col justify-between py-8 px-6 bg-background text-foreground font-instrument">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="destructive" className="text-xl">LIVE 🔴</Button>

          <div className="ml-20 flex gap-4 overflow-x-auto text-xl">
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
            <Button variant="link" aria-label="Search">
              <Search />
            </Button>
          </div>
        </div>

        <ApiPlaceholder />
      </main>

      {/* Content Section */}
      <section className="px-6 py-10  mx-auto">
      <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT SECTION */}
          <div className="w-full lg:w-[70%] space-y-8">
            {mainArticle && <MainArticleCard article={mainArticle} />}

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-6">
              {smallerArticles.slice(0, 8).map(article => (
                <SmallerArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>

          {/* RIGHT SECTION - placeholder for Latest News */}
          <div className="w-full lg:w-[30%] space-y-4 h-full">
            <LatestNewsBlock articles={smallerArticles.slice(0, 8)} />

            
          </div>
        </div>
      </section>
      <section>
      <EditorsChoiceSection articles={editorsChoice} />

      </section>
    </>
  );
}

