"use client";

import { Button } from "@/components/ui/button";
import { Subscription } from "./types";
import { CardContent } from "@/components/ui/card";
import Link from "next/link";
import { usePlan } from "@/components/subscribe/plan-context";

export default function SubscriptionsList({ userId }: { userId: string }) {
  const { currentPlan, isLoading } = usePlan();

  const priceMap: Record<"Free" | "Elite" | "Business", number> = {
    Free: 0,
    Elite: 19.99,
    Business: 49.99,
  };

  //   useEffect(() => {
  //     const fetchSubscriptions = async () => {
  //       const response = await fetch(`/api/subscriptions?userId=${userId}`);
  //       const data = await response.json();
  //       setSubscriptions(data);
  //     };
  //     fetchSubscriptions();
  //   }, [userId]);

  const subscription: Subscription | null = currentPlan
    ? {
        id: `sub_${userId}_${Date.now()}`,
        plan: currentPlan,
        status: "Active",
        price: priceMap[currentPlan],
        expiresAt: new Date(
          new Date().setMonth(new Date().getMonth() + 1)
        ).toISOString(),
      }
    : null;

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (isLoading) {
    return <p className="text-white/60">Loading subscription...</p>;
  }

  if (!subscription) {
    return <p className="text-white/60 text-center">No active subscription.</p>;
  }

  return (
    <div className="space-y-4">
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div className="mb-20">
            <p className="mb-2">
              Plan: <span className="text-blue-400">{subscription.plan}</span>
            </p>
            <p className="mb-2">
              Price:{" "}
              <span className="text-blue-400">
                ${subscription.price.toFixed(2)}
              </span>
            </p>
            <p className="mb-2">
              Status:{" "}
              <span className="text-blue-400">{subscription.status}</span>
            </p>
            <p className="mb-2">
              Expires: {formatDate(new Date(subscription.expiresAt))}
            </p>
          </div>
          <div className="mt-45 flex-justify-end">
            <Link href="/card-details">
              <Button variant="default" className="btn-blue">
                Manage
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </div>
  );
}
