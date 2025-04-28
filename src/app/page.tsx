import { getArticlesForLandingPage } from "@/actions/articles";
import { getTopAuthorsWithMostViewedArticles } from "@/actions/authors";
import ApiPlaceholder from "@/components/ApiPlaceholder";
import EditorsChoiceSection from "@/components/EditorsChoiceSection";
import LatestNewsBlock from "@/components/LatestNewsBlock";
import MainArticleCard from "@/components/MainArticleCard";
import MostViewed from "@/components/MostViewed";
import SmallerArticleCard from "@/components/SmallerArticleCard";
import SubscriptionSection from "@/components/SubscriptionSection";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Link from "next/link";
import ExpertInsightsSection from "@/components/ExpertInsightsSection"; // Import the new section

export default async function Home() {
  const categories = [
    'Sports', 'Politics', 'Technology', 'Finance', 'Education',
    'Entertainment', 'Art', 'Culture', 'Local'
  ];

  const { mainArticle, smallerArticles, editorsChoice } = await getArticlesForLandingPage();
  const topAuthors = await getTopAuthorsWithMostViewedArticles();

  return (
    <div className="font-inika">
      <main className="flex flex-col justify-between py-8  bg-background text-foreground font-instrument">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="destructive" className="text-md">LIVE 🔴</Button>

          <div className=" flex gap-2 overflow-x-auto text-lg">
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
      <section className="  mx-auto">
      <div className="flex flex-col lg:flex-row gap-4">
          {/* LEFT SECTION */}
          <div className="w-full lg:w-[75%] ">
            {mainArticle && <MainArticleCard article={mainArticle} />}

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-2">
              {smallerArticles.slice(0, 8).map(article => (
                <SmallerArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>

          {/* RIGHT SECTION - placeholder for Latest News */}
          <div className="w-full lg:w-[25%] space-y-4 h-full">
            <LatestNewsBlock articles={smallerArticles.slice(0, 8)} />

            
          </div>
        </div>
      </section>
      
      <EditorsChoiceSection articles={editorsChoice} />
<SubscriptionSection/>
<MostViewed />
<ExpertInsightsSection authors={topAuthors} />

    </div>
  );
}

