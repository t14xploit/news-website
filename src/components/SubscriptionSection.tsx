import { prisma } from "@/lib/prisma";  
import SubscriptionCard from "@/components/SubscriptionCard";
import { ArrowBigRight } from "lucide-react";
import { Decimal } from "@/generated/prisma/runtime/library";

const colorCombos = [
  { bg: "bg-blue-600", footer: "bg-blue-100 text-blue-800" },
  { bg: "bg-yellow-500", footer: "bg-yellow-100 text-yellow-800" },
  { bg: "bg-green-600", footer: "bg-green-100 text-green-800" },
];
const formatPrice = (price: number | Decimal) => {
    return price ? `${price.toFixed(0)}` : "$0";
  };
  export default async function SubscriptionSection() {
    try {
      const subscriptionTypes = await prisma.subscriptionType.findMany();
  
      // If no subscription types are found
      if (subscriptionTypes.length === 0) {
        console.log("No subscription types found.");
        return <div className="text-center text-lg text-gray-600">No subscription types available.</div>;
      }
  
      return (
        <section className="py-10 mx-auto">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            Choose your subscription <ArrowBigRight className="w-6 h-6 text-primary" />
          </h2>
  
          {/* Adjust the grid layout for responsive design */}
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 justify-center">
            {subscriptionTypes.map((plan, index) => {
              const colors = colorCombos[index % colorCombos.length];
              return (
                <SubscriptionCard
                  key={plan.id}
                  title={plan.name}
                  description={plan.description}
                  features={plan.features}
                  price={formatPrice(plan.price)}
                  bgColor={colors.bg}
                  footerColor={colors.footer}
                />
              );
            })}
          </div>
        </section>
      );
    } catch (error) {
      console.error("Error fetching subscription types:", error);
      return (
        <div className="text-center text-lg text-red-600">
          Error loading subscription types. Please try again later.
        </div>
      );
    }
  }
  
