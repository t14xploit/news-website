"use client";

import SubscribePlan from "@/components/subscribe/subscribe-plan";

export default function SubscribePage() {
  const plans = [
    {
      id: "1",
      name: "Basic",
      price: 9.99,
      features: ["Feature 1", "Feature 2", "Support"],
    },
    {
      id: "2",
      name: "Premium",
      price: 19.99,
      features: ["Feature 1", "Feature 2", "Feature 3", "Priority Support"],
    },
    {
      id: "3",
      name: "Pro",
      price: 29.99,
      features: [
        "Feature 1",
        "Feature 2",
        "Feature 3",
        "Feature 4",
        "24/7 Support",
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4">
      <div className="text-center mb-16">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
          Select a Plan
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Choose the perfect plan for your needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full">
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
  );
}
