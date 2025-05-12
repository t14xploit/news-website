import { getArticlesForLandingPage } from "@/actions/articles";
import { getTopAuthorsWithRandomArticles } from "@/actions/authors";
import EditorsChoiceSection from "@/components/homepage/EditorsChoiceSection";
import LatestNewsBlock from "@/components/homepage/LatestNewsBlock";
import MainArticleCard from "@/components/homepage/MainArticleCard";
import MostViewed from "@/components/homepage/MostViewed";
import SmallerArticleCard from "@/components/homepage/SmallerArticleCard";
import SubscriptionSection from "@/components/homepage/SubscriptionSection";
import Link from "next/link";
import ExpertInsightsSection from "@/components/homepage/ExpertInsightsSection";
import CookieConsent from "@/components/homepage/CookieConsent";
import { cookies } from "next/headers";
import WeatherCard from "@/components/api/WeatherCard";
import SpotPriceCard from "@/components/api/SpotPriceCard";

// Fetch categories from Prisma server action
// async function getCategories() {
//   return await prisma.category.findMany();
// }

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
  // const categories = await getCategories();

  // Fetch articles and authors data
  const { mainArticle, smallerArticles, editorsChoice } = await getArticlesForLandingPage();
  const topAuthors = await getTopAuthorsWithRandomArticles();
  const consent = await getCookieConsent();

  return (
    <div className=" max-w-screen-xl mx-auto">
      <main className="flex flex-col justify-between py-8 bg-background text-foreground">

        {/* Header with Categories and Search */}
        <div className="mb-6">
       {/* Navigation Links to Page Sections */}
<div className="sticky top-0 z-10 bg-background py-2 mb-4 border-b border-muted shadow-sm">
  <div className="flex gap-4 overflow-x-auto px-4 md:px-0 text-sm">
    <Link href="#editors-choice" className="hover:underline whitespace-nowrap">
      Editor&apos;s Choice
    </Link>
    <Link href="#subscription" className="hover:underline whitespace-nowrap">
      Subscribe
    </Link>
    <Link href="#most-viewed" className="hover:underline whitespace-nowrap">
      Most Viewed
    </Link>
    <Link href="#expert-insights" className="hover:underline whitespace-nowrap">
      Expert Insights
    </Link>
  </div>
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
          {consent === null && <CookieConsent />}
        </div>


        {/* Content Section */}
        <section id="latest-news" className="mx-auto mt-8">

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
        <section id="editors-choice">
  <EditorsChoiceSection articles={editorsChoice} />
</section>

<section id="subscription">
  <SubscriptionSection />
</section>

<section id="most-viewed">
  <MostViewed />
</section>

<section id="expert-insights">
  <ExpertInsightsSection authors={topAuthors} />
</section>

      </main>
    </div>
  );
}
