"use client";

import SubscribePlan from "@/components/subscribe/subscribe-plan";
import { PlanProvider } from "@/components/subscribe/plan-context";
import { plans } from "@/lib/subscribe/plans";

export default function SubscribePage() {
  const defaultUserData = {
    name: "",
    email: "",
    avatar: "",
  };

  return (
    <PlanProvider initialUserData={defaultUserData}>
      <div className="min-h-screen pt-20 flex flex-col items-center justify-start gap-4">
        <div className="text-center">
          <h2 className="text-4xl font-medium">
            Choose Your <span className="text-blue-400">Subscription</span> Plan
          </h2>
          <p className="text-gray-400 mb-10">
            Select a plan that best suits your news experience
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl px-4 mt-15">
            {plans.map((plan) => (
              <SubscribePlan
                key={plan.id}
                id={plan.id}
                name={plan.name}
                price={plan.price}
                features={plan.features}
              />
            ))}
          </div>
        </div>
      </div>
    </PlanProvider>
  );
}
