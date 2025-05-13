import * as React from "react";
import { getArticlesForLandingPage } from "@/actions/articles";
import { getTopAuthorsWithRandomArticles } from "@/actions/authors";
import EditorsChoiceSection from "@/components/homepage/EditorsChoiceSection";
import LatestNewsBlock from "@/components/homepage/LatestNewsBlock";
import MainArticleCard from "@/components/homepage/MainArticleCard";
import MostViewed from "@/components/homepage/MostViewed";
import SmallerArticleCard from "@/components/homepage/SmallerArticleCard";
import SubscriptionSection from "@/components/homepage/SubscriptionSection";
import ExpertInsightsSection from "@/components/homepage/ExpertInsightsSection";
import CookieConsent from "@/components/homepage/CookieConsent";
import { cookies } from "next/headers";
import WeatherCard from "@/components/api/WeatherCard";
import SpotPriceCard from "@/components/api/SpotPriceCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/homepage/Tabs";
import { FaFire, FaRegEye, FaRegStar } from "react-icons/fa";
import { BsEnvelopeCheck, BsPeople } from "react-icons/bs";
import { GiNewspaper } from "react-icons/gi";

// Memoizing the cards to prevent unnecessary re-renders
const MemoizedWeatherCard = React.memo(WeatherCard);
const MemoizedSpotPriceCard = React.memo(SpotPriceCard);

async function getCookieConsent() {
  const cookieStore = await cookies();
  const consentCookie = cookieStore.get("cookie_consent");

  if (consentCookie?.value) {
    return consentCookie.value; // Return the consent status ('accepted' or 'declined')
  }

  return null; // No consent yet
}

export default async function Home() {
  // Fetch articles and authors data
  const { mainArticle, smallerArticles, editorsChoice } = await getArticlesForLandingPage();
  const topAuthors = await getTopAuthorsWithRandomArticles();
  const consent = await getCookieConsent();

  return (
    <div className="max-w-screen-xl mx-auto">
      <main className="flex flex-col justify-between bg-background text-foreground">
        {consent === null && <CookieConsent />}

       

        <Tabs defaultValue="latest-news">
          <TabsList className="flex gap-6">
            <TabsTrigger value="latest-news" className="text-lg font-semibold">
              <div className="flex w-full items-center justify-center gap-2">
                <FaFire className="text-orange-500" size={24} />
                Latest News
              </div>
            </TabsTrigger>
            <TabsTrigger value="editors-choice" className="text-lg font-semibold flex gap-2">
              <div className="flex gap-2 w-full items-center justify-center">
                <FaRegStar className="text-purple-600" size={24} />
                Editor&apos;s Choice
              </div>
            </TabsTrigger>
            <TabsTrigger value="subscription" className="text-lg font-semibold">
              <div className="flex gap-2 w-full items-center justify-center">
                <BsEnvelopeCheck className="text-blue-600" size={24} />
                Subscription
              </div>
            </TabsTrigger>
            <TabsTrigger value="most-viewed" className="text-lg font-semibold">
              <div className="flex gap-2 w-full items-center justify-center">
                <FaRegEye className="text-emerald-600" size={24} />
                Most Viewed
              </div>
            </TabsTrigger>
            <TabsTrigger value="expert-insights" className="text-lg font-semibold">
              <div className="flex gap-2 w-full items-center justify-center">
                <BsPeople className="text-amber-300" size={24} />
                Expert Insights
              </div>
            </TabsTrigger>
          </TabsList>
 {/* Weather and SpotPrice Cards  */}
 <div className="flex flex-col lg:flex-row gap-4 w-full">
          <div className="w-full lg:w-[75%]">
            <MemoizedSpotPriceCard />
          </div>
          <div className="w-full lg:w-[23%]">
            <MemoizedWeatherCard />
          </div>
        </div>
          {/* Tab Content */}
          <TabsContent value="latest-news">
            <section className="mt-8">
                <h2 className="text-4xl font-bold my-6 flex items-center gap-2 py-3 border-b">
                        <GiNewspaper/> Latest News 
                        </h2>
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="w-full lg:w-[75%]">
                  {mainArticle && <MainArticleCard article={mainArticle} />}
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {smallerArticles.slice(0, 8).map((article) => (
                      <SmallerArticleCard key={article.id} article={article} />
                    ))}
                  </div>
                </div>
                <div className="w-full lg:w-[23%] space-y-4">
                  <LatestNewsBlock articles={smallerArticles.slice(0, 8)} />
                </div>
              </div>
            </section>
          </TabsContent>

          <TabsContent value="editors-choice">
            <section className="mt-8">
              <EditorsChoiceSection articles={editorsChoice} />
            </section>
          </TabsContent>

          <TabsContent value="subscription">
            <section className="mt-8">
              <SubscriptionSection />
            </section>
          </TabsContent>

          <TabsContent value="most-viewed">
            <section className="mt-8">
              <MostViewed />
            </section>
          </TabsContent>

          <TabsContent value="expert-insights">
            <section className="mt-8">
              <ExpertInsightsSection authors={topAuthors} />
            </section>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
