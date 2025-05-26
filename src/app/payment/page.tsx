"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import PaymentForm from "@/components/t-one-payment/payment-form";
import { processPayment } from "@/actions/payment-actions";
// import { PaymentFormData } from "@/lib/validation/payment-schema";
import {
  subscribeSchema,
  SubscribeFormData,
} from "@/lib/validation/subscribe-schema";
import { usePlan, UserData } from "@/components/subscribe/plan-context";
import { selectSubscription } from "@/actions/subscribe-action";
import { z } from "zod";
import { CardPreviewFormData } from "@/lib/validation/card-preview-schema";
import { authClient } from "@/lib/auth-client"; // Sophie

type PlanType = "Free" | "Elite" | "Business";

interface ProcessPaymentResult {
  success: boolean;
  plan: string;
  price: number;
  userId?: string;
  error?: string;
}

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get("planId") || "";
  const nameFromParams = searchParams.get("name");
  const priceFromParams = searchParams.get("price");
  const { setCurrentPlan, setUserData } = usePlan(); // Sophie - userId removed from here
  const cardBackground = searchParams.get("cardBackground") || "gradient";
  const validPlans: PlanType[] = ["Free", "Elite", "Business"];
  const name: PlanType = validPlans.includes(nameFromParams as PlanType)
    ? (nameFromParams as PlanType)
    : "Free";

  const priceMap: Record<PlanType, number> = {
    Free: 0,
    Elite: 19.99,
    Business: 49.99,
  };
  const price =
    priceFromParams && !isNaN(parseFloat(priceFromParams))
      ? parseFloat(priceFromParams)
      : priceMap[name];

  const [error, setError] = useState<string | null>(null);

  const selectedPlan = { id: planId, name, price };

  const handlePaymentSubmit = async (data: CardPreviewFormData) => {
    setError(null);
    console.log("Processing payment for plan:", selectedPlan.name);

    const session = await authClient.getSession(); // Sophie
    const userId = session?.data?.user?.id; //Sophie

    if (!userId) {
      setError("User ID not found. Please try again.");
      return {
        success: false,
        plan: selectedPlan.name,
        price: selectedPlan.price,
        error: "User ID not found",
      };
    }

    try {
      const subscribeData: SubscribeFormData = subscribeSchema.parse({
        planId: selectedPlan.id,
        userId,
      });
      console.log("Validated subscription data:", subscribeData);
    } catch (validationError) {
      const errorMessage =
        validationError instanceof z.ZodError
          ? validationError.errors.map((e: z.ZodIssue) => e.message).join(", ")
          : "Invalid subscription data";
      console.error("Subscription validation failed:", errorMessage);
      setError(errorMessage);
      return {
        success: false,
        plan: selectedPlan.name,
        price: selectedPlan.price,
        error: errorMessage,
      };
    }

    const subscriptionResult = await selectSubscription(
      selectedPlan.id,
      userId
    );
    if (!subscriptionResult.success) {
      console.error("Subscription selection failed:", subscriptionResult.error);
      const errorMessage = subscriptionResult.error?.includes("Invalid plan ID")
        ? "Selected plan is not available. Please choose another plan."
        : subscriptionResult.error || "Failed to select subscription.";
      setError(errorMessage);
      return {
        success: false,
        plan: selectedPlan.name,
        price: selectedPlan.price,
        error: errorMessage,
      };
    }

    if (subscriptionResult.subscriptionId) {
      sessionStorage.setItem(
        "subscriptionId",
        subscriptionResult.subscriptionId
      );
      console.log(
        "Stored subscriptionId in sessionStorage:",
        subscriptionResult.subscriptionId
      );
    }

    const paymentResult: ProcessPaymentResult = await processPayment(
      data,
      selectedPlan,
      userId
    );
    if (paymentResult.success) {
      console.log(
        "Payment successful, setting currentPlan to:",
        selectedPlan.name
      );
      setCurrentPlan(selectedPlan.name);
      localStorage.setItem("currentPlan", selectedPlan.name);
      // console.log("Storing userId in localStorage:", userId); // Sophie
      // localStorage.setItem("userId", userId); // Sophie

      const cardDetails = {
        cardNumber: data.cardNumber.replace(/\s/g, ""),
        cardHolder: data.cardHolder,
        cardType: detectCardType(data.cardNumber),
        cardBackground,
        plan: selectedPlan.name,
        lastUsed: new Date().toISOString(),
      };
      const savedCards = JSON.parse(
        localStorage.getItem(`cards_${userId}`) || "[]"
      );
      localStorage.setItem(
        `cards_${userId}`,
        JSON.stringify([...savedCards, cardDetails])
      );
      console.log("Saved card details:", cardDetails);

      setUserData((prev: UserData) => ({
        ...prev,
        name: data.cardHolder,
        avatar: prev.avatar || "/alien/alien_1.jpg",
      }));
      console.log("Storing cardholder name in PlanContext:", data.cardHolder);

      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log("Redirecting to /thank-you");
      router.replace(
        `/thank-you?plan=${encodeURIComponent(paymentResult.plan)}
        &price=${paymentResult.price}
        &cardHolder=${encodeURIComponent(data.cardHolder)}
        &cardNumber=${encodeURIComponent(data.cardNumber)}
        &cardBackground=${encodeURIComponent(cardBackground)}`
      );
    } else {
      console.error("Payment failed:", paymentResult.error);
      setError(paymentResult.error || "Payment failed. Please try again.");
    }
    return paymentResult;
  };

  const detectCardType = (cardNumber: string) => {
    const cleaned = cardNumber.replace(/\D/g, "");
    if (/^4/.test(cleaned)) return "visa";
    if (/^5[1-5]/.test(cleaned)) return "mastercard";
    if (/^3[47]/.test(cleaned)) return "amex";
    if (/^6(?:011|5)/.test(cleaned)) return "discover";
    return "generic";
  };

  return (
    <div className="">
      <div className="text-center">
        {error && <p className="text-red-400 mb-4">{error}</p>}
        <h2 className="text-3xl font-medium mb-2 text-white/90">
          Subscribe to <span className="text-blue-400">{name}</span> News
        </h2>
        <div className="text-gray-400 mb-6">
          <p>Enter your card details to complete the payment and</p>
          <p>Enjoy the Best Updates Every Month</p>
        </div>
        <PaymentForm
          onSubmit={handlePaymentSubmit}
          selectedPlan={selectedPlan}
        />
      </div>
    </div>
  );
}
