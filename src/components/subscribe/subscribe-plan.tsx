"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { usePlan } from "@/components/subscribe/plan-context";
import { subscribeSchema } from "@/lib/validation/subscribe-schema";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";

interface SubscribePlanProps {
  id: string;
  name: string;
  price: number;
  features: string[];
}

export default function SubscribePlan({
  id,
  name,
  price,
  features,
}: SubscribePlanProps) {
  const router = useRouter();
  const { userId } = usePlan();

  const handleSelect = () => {
    if (!userId) {
      console.error("No userId available");
      alert("User ID not found. Please try again.");
      return;
    }

    try {
      subscribeSchema.parse({
        planId: id,
        userId,
      });
    } catch (validationError) {
      const errorMessage =
        validationError instanceof z.ZodError
          ? validationError.errors.map((e: z.ZodIssue) => e.message).join(", ")
          : "Invalid subscription data";
      console.error("Subscription validation failed:", errorMessage);
      alert(errorMessage);
      return;
    }

    router.push(
      `/payment?planId=${id}&name=${encodeURIComponent(
        name
      )}&price=${price}&userId=${userId}`
    );
  };

  const isPopular = id === "2";
  const isFree = name === "Free";

  return (
    <Card className="w-full md:w-auto transition-transform hover:scale-105 duration-300 max-w-md ">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span className="text-2xl font-bold">{name}</span>
          {isPopular && (
            <span className="bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
              Popular
            </span>
          )}
        </CardTitle>
        <CardDescription className="text-lg font-semibold flex justify-between mt-2">
          ${price.toFixed(2)}/month
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          {isFree && "Essential news access for casual readers and even more"}
          {!isFree &&
            name === "Elite" &&
            "Enhanced news access with exclusive content"}
          {!isFree &&
            name === "Business" &&
            "Unlimited news access with premium features"}
        </p>
        <Button
          onClick={handleSelect}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white/90 font-semibold"
        >
          Get {name}
        </Button>
      </CardContent>
      <CardFooter>
        <ul className="space-y-2 text-sm">
          {!isFree && (
            <li className="flex items-center">
              <Check className="mr-2 h-4 w-4" />
              Everything in {name === "Business" ? "Elite" : "Free"}
            </li>
          )}
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <Check className="mr-2 h-4 w-4" />
              {feature}
            </li>
          ))}
        </ul>
      </CardFooter>
    </Card>
  );
}
