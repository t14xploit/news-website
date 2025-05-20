"use client";

import { CheckCircle } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

const validPlans = ["Basic", "Premium", "Pro"];

export default function ThankYouPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const rawPlan = searchParams.get("plan") || "Basic";
  const plan = validPlans.includes(rawPlan) ? rawPlan : "Basic";
  const priceMap: Record<string, number> = {
    Basic: 9.99,
    Premium: 19.99,
    Pro: 29.99,
  };
  const rawCardHolder = searchParams.get("cardHolder") || "User";
  const cardHolder = rawCardHolder.replace(/[<>]/g, "");

  useEffect(() => {
    if (!validPlans.includes(rawPlan) || !rawCardHolder) {
      router.push("/");
    }
  }, [rawPlan, rawCardHolder, router]);

  return (
    <div className="min-h-screen pt-20 flex flex-col items-center justify-start gap-2">
      <div className="text-center mb-10">
        <h1 className="text-4xl mb-4 text-white/90">
          Thank You for Your{" "}
          <span className="text-blue-400">{plan}</span> Subscription,{""}
          <span className="text-white/90">{cardHolder}</span>!
        </h1>
        <p className="text-lg text-white/90">
          Your payment was processed successfully
          <CheckCircle className="inline-block text-green-600 opacity-70 w-5 h-5" />
        </p>
      </div>
      <div className="flex flex-col items-center justify-center w-full gap-8">
        <div className="text-center max-w-md">
          <div className="relative rounded-lg p-6 flex flex-col h-[250px] w-120 transform hover:scale-105 transition-transform duration-300  border border-gray-700 shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br  backdrop-blur-md rounded-lg" />
            <div className="relative flex flex-col h-full text-white/90 pt-2">
              <h2 className="text-2xl mb-4 text-white/90">
                Subscription Details:
              </h2>
              <p className="mb-4 text-white/90">
                Plan: <span className="text-blue-400">{plan}</span>
              </p>
              <p className="mb-4 text-white/90">
                Price: ${priceMap[plan].toFixed(2)}/month
              </p>
              <p className="text-white/60">
                You now have access to {plan} content.
              </p>
              <p className="text-white/60">Enjoy your subscription!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}