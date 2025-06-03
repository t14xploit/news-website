"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import PaymentForm from "@/components/t-one-payment/payment-form";
import { processPayment } from "@/actions/payment-actions";
import {
  subscribeSchema,
  SubscribeFormData,
} from "@/lib/validation/subscribe-schema";
import { usePlan, UserData } from "@/components/subscribe/plan-context";
import { selectSubscription } from "@/actions/subscribe-action";
import { z } from "zod";
import { CardPreviewFormData } from "@/lib/validation/card-preview-schema";
import {
  CardBackground,
  CardType,
  SavedCard,
} from "@/components/payment-card/types";
import { authClient } from "@/lib/auth-client"; // Sophie
import { FaCheck } from "react-icons/fa";

const session = await authClient.getSession(); // Sophie
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const userId = session?.data?.user?.id; //Sophie

type PlanType = "Free" | "Elite" | "Business";

interface ProcessPaymentResult {
  success: boolean;
  plan: string;
  price: number;
  userId?: string;
  error?: string;
}

const detectCardType = (cardNumber: string): CardType => {
  const cleaned = cardNumber.replace(/\D/g, "");
  if (/^4/.test(cleaned)) return "visa";
  if (/^5[1-5]/.test(cleaned)) return "mastercard";
  if (/^3[47]/.test(cleaned)) return "amex";
  if (/^6(?:011|5)/.test(cleaned)) return "discover";
  return "generic";
};

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;
  const [userId, setUserId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
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

  useEffect(() => {
    setIsClient(true);
    const fetchSession = async () => {
      try {
        const session = await authClient.getSession();
        setUserId(session?.data?.user?.id || null);
      } catch (err) {
        console.error("Failed to fetch session:", err);
        setError("Unable to authenticate. Please log in again.");
      }
    };
    fetchSession();
  }, []);

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePaymentSubmit = async (data: CardPreviewFormData) => {
    setError(null);
    console.log("Starting payment process for plan:", selectedPlan.name, {
      userId,
      data,
    });

    if (!userId) {
      const errorMessage = "User ID not found. Please try again.";
      setError(errorMessage);
      console.error(errorMessage);
      return {
        success: false,
        plan: selectedPlan.name,
        price: selectedPlan.price,
        error: errorMessage,
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

    try {
      const subscriptionResult = await selectSubscription(
        selectedPlan.id,
        userId
      );
      if (!subscriptionResult.success) {
        const errorMessage = subscriptionResult.error?.includes(
          "Invalid plan ID"
        )
          ? "Selected plan is not available. Please choose another plan."
          : subscriptionResult.error || "Failed to select subscription.";
        console.error("Subscription selection failed:", errorMessage);
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
        console.log("Storing userId in localStorage:", userId);
        localStorage.setItem("userId", userId);

        const generateUUID = () => {
          return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
            /[xy]/g,
            (c) => {
              const r = (Math.random() * 16) | 0;
              const v = c === "x" ? r : (r & 0x3) | 0x8;
              return v.toString(16);
            }
          );
        };

        const cardDetails: SavedCard = {
          id: generateUUID(),
          cardNumber: data.cardNumber.replace(/\s/g, ""),
          cardHolder: data.cardHolder,
          expiryDate: data.expiryDate,
          cvv: data.cvv,
          cardType: detectCardType(data.cardNumber),
          cardBackground: data.cardBackground as CardBackground,
          plan: data.plan,
          price: selectedPlan.price,
          lastUsed: new Date().toISOString(),
          isDefault: undefined,
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

        handleNextStep();
        return paymentResult;
      } else {
        console.error("Payment failed:", paymentResult.error);
        setError(paymentResult.error || "Payment failed. Please try again.");
        return paymentResult;
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      console.error("Unexpected error during payment process:", errorMessage);
      setError(errorMessage);
      return {
        success: false,
        plan: selectedPlan.name,
        price: selectedPlan.price,
        error: errorMessage,
      };
    }
  };

  if (!isClient) {
    return (
      <div className="text-center">
        <div>Loading...</div>
      </div>
    );
  }

  //       console.log("Initiating redirect to /thank-you with params:", {
  //         plan: paymentResult.plan,
  //         price: paymentResult.price,
  //         cardHolder: data.cardHolder,
  //         cardNumber: data.cardNumber,
  //         cardBackground: data.cardBackground,
  //       });
  //       router.replace(
  //         `/thank-you?plan=${encodeURIComponent(paymentResult.plan)}` +
  //           `&price=${paymentResult.price}` +
  //           `&cardHolder=${encodeURIComponent(data.cardHolder)}` +
  //           `&cardNumber=${encodeURIComponent(data.cardNumber)}` +
  //           `&cardBackground=${encodeURIComponent(data.cardBackground)}`
  //       );
  //       return paymentResult;
  //     } else {
  //       console.error("Payment failed:", paymentResult.error);
  //       setError(paymentResult.error || "Payment failed. Please try again.");
  //       return paymentResult;
  //     }
  //   } catch (error) {
  //     const errorMessage =
  //       error instanceof Error ? error.message : "An unexpected error occurred";
  //     console.error("Unexpected error during payment process:", errorMessage);
  //     setError(errorMessage);
  //     return {
  //       success: false,
  //       plan: selectedPlan.name,
  //       price: selectedPlan.price,
  //       error: errorMessage,
  //     };
  //   }
  // };

  // if (!isClient) {
  //   return (
  //     <div className="text-center">
  //       <div>Loading...</div>
  //     </div>
  //   );
  // }

  return (
    <div className="">
      <div className="mt-4 mb-6">
        <div className="flex justify-center items-center relative">
          {[...Array(2)].map((_, index) => (
            <div key={index} className="flex flex-col items-center mx-90">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep > index + 1
                    ? "bg-green-600 text-white"
                    : currentStep === index + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {currentStep > index + 1 ? <FaCheck /> : index + 1}
              </div>
              <span className="text-xs mt-1">
                {index === 0 ? "Card Details" : "Confirm"}
              </span>
            </div>
          ))}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-180 h-1 bg-gray-200 rounded-full">
            <div
              className="h-1 bg-blue-500 transition-all duration-300 rounded-full"
              style={{ width: `${(currentStep / 2) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="text-center p-20">
        {error && <p className="text-red-400 mb-4">{error}</p>}
        <h2 className="text-3xl font-medium mb-2 text-white/90">
          Subscribe to <span className="text-blue-400">{name}</span> News
        </h2>

        <div className="text-gray-400 mb-20">
          <p>Enter your card details to complete the payment and</p>
          <p>Enjoy the Best Updates Every Month</p>
        </div>
        <PaymentForm
          onSubmit={handlePaymentSubmit}
          selectedPlan={selectedPlan}
          cardBackground={cardBackground}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          handleNextStep={handleNextStep}
          handlePreviousStep={handlePreviousStep}
        />
      </div>
    </div>
  );
}
