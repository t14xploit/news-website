import { prisma } from "@/lib/prisma";
import { getArticlesForLandingPage } from "@/actions/articles";
import { getTopAuthorsWithRandomArticles } from "@/actions/authors";
import EditorsChoiceSection from "@/components/EditorsChoiceSection";
import LatestNewsBlock from "@/components/LatestNewsBlock";
import MainArticleCard from "@/components/MainArticleCard";
import MostViewed from "@/components/MostViewed";
import SmallerArticleCard from "@/components/SmallerArticleCard";
import SubscriptionSection from "@/components/SubscriptionSection";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ExpertInsightsSection from "@/components/ExpertInsightsSection";
import SearchForm from "@/components/SearchForm";
import CookieConsent from "@/components/CookieConsent";
import { cookies } from "next/headers";
import WeatherCard from "@/components/api/WeatherCard";
import SpotPriceCard from "@/components/api/SpotPriceCard";

// Fetch categories from Prisma server action
async function getCategories() {
  return await prisma.category.findMany();
}

async function getCookieConsent() {
  const cookieStore = await cookies();
  const consentCookie = cookieStore.get("cookie_consent");

  if (consentCookie?.value) {
    return consentCookie.value; // Return the consent status ('accepted' or 'declined')
  }

  return null; // No consent yet
}

export default async function Home() {
  // Fetch categories from Prisma
  const categories = await getCategories();

  // Fetch articles and authors data
  const { mainArticle, smallerArticles, editorsChoice } = await getArticlesForLandingPage();
  const topAuthors = await getTopAuthorsWithRandomArticles();
  const consent = await getCookieConsent();

  return (
    <div className="font-inika max-w-screen-xl mx-auto">
      <main className="flex flex-col justify-between py-8 bg-background text-foreground font-instrument">

        {/* Header with Categories and Search */}
        <div className="mb-6">
          {/* Top Row for all screens */}
          <div className="flex flex-col md:flex-row md:items-center md:gap-4 w-full mb-4">
            {/* LIVE Button */}
            <div className="w-full md:w-auto mb-4 md:mb-0">
              <Button variant="destructive" className="w-full md:w-auto text-md">
                LIVE 🔴
              </Button>
            </div>


            {/* Large screens: categories in one line */}
            <div className="hidden md:flex flex-wrap gap-2 flex-grow">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.title.toLowerCase()}`}
                  className="px-3 py-2 rounded-lg hover:bg-muted hover:text-primary transition whitespace-nowrap"
                >
                  {category.title.charAt(0).toUpperCase() + category.title.slice(1)}
                </Link>
              ))}
            </div>

            {/* Search Form */}
            <div className="w-full md:w-auto md:ml-auto">
              <SearchForm showResults={false} />
            </div>
          </div>

          {/* Small screens: categories as 2-column grid */}
          <div className="grid grid-cols-2 gap-2 md:hidden w-full">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.title.toLowerCase()}`}
                className="px-3 py-2 rounded-lg hover:bg-muted hover:text-primary transition whitespace-nowrap"
              >
                {category.title.charAt(0).toUpperCase() + category.title.slice(1)}
              </Link>
            ))}
          </div>
        </div>




        {/* Weather & Spot Price Cards */}
        <div className="flex flex-col lg:flex-row gap-4 w-full">
          <div className="w-full lg:w-[75%]">
            <SpotPriceCard />
          </div>
          <div className="w-full lg:w-[25%]">
            <WeatherCard />
          </div>
        </div>


        {/* Content Section */}
        <section className="mx-auto mt-8">
          {consent === null && <CookieConsent />}

          <div className="flex flex-col lg:flex-row gap-4">
            {/* LEFT SECTION */}
            <div className="w-full lg:w-[75%]">
              {mainArticle && <MainArticleCard article={mainArticle} />}

              {/* Smaller Article Cards Grid */}
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                {smallerArticles.slice(0, 8).map((article) => (
                  <SmallerArticleCard key={article.id} article={article} />
                ))}
              </div>
            </div>

            {/* RIGHT SECTION - Latest News */}
            <div className="w-full lg:w-[25%] space-y-4 h-full">
              <LatestNewsBlock articles={smallerArticles.slice(0, 8)} />
            </div>
          </div>
        </section>

        {/* Other Sections */}
        <EditorsChoiceSection articles={editorsChoice} />
        <SubscriptionSection />
        <MostViewed />
        <ExpertInsightsSection authors={topAuthors} />

      </main>
    </div>
  );
}
