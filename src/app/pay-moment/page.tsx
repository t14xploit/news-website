"use client";

import PaymentForm from "@/components/payment-card/ui/payment-form";
import { PlanProvider, PlanType } from "@/components/subscribe/plan-context";
import { useSearchParams } from "next/navigation";
import { CardPreviewFormData } from "@/lib/validation/card-preview-schema";
import { Toaster } from "sonner";

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const planId = searchParams.get("plan");
  const plans: { id: string; name: PlanType; price: number }[] = [
    { id: "Free", name: "Free", price: 0 },
    { id: "Elite", name: "Elite", price: 19.99 },
    { id: "Business", name: "Business", price: 49.99 },
  ];
  const selectedPlan = plans.find((plan) => plan.id === planId) || plans[0];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSubmit = async (data: CardPreviewFormData) => {
    // Simulate payment processing (replace with real API call)
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      success: true,
      plan: selectedPlan.name,
      price: selectedPlan.price,
    };
  };

  const defaultUserData = {
    name: "",
    email: "",
    avatar: "",
  };

  return (
    <PlanProvider initialUserData={defaultUserData}>
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-4">
        <PaymentForm onSubmit={handleSubmit} selectedPlan={selectedPlan} />
        <Toaster position="top-center" />
      </div>
    </PlanProvider>
  );
}
