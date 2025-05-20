"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { CardPreviewFormData, cardPreviewSchema } from "@/lib/validation/card-preview-schema";
import { CardPreview } from "./payment-subscribe";
import { usePlan, PlanType } from "@/components/subscribe/plan-context";
import { useRouter } from "next/navigation";

interface ProcessPaymentResult {
  success: boolean;
  plan: PlanType;
  price: number;
  error?: string;
}

interface PaymentFormProps {
  onSubmit: (data: CardPreviewFormData) => Promise<ProcessPaymentResult>;
  selectedPlan: { id: string; name: PlanType; price: number };
}

export default function PaymentForm({ onSubmit, selectedPlan }: PaymentFormProps) {
  const { setCurrentPlan } = usePlan();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CardPreviewFormData>({
    resolver: zodResolver(cardPreviewSchema),
    defaultValues: {
      cardNumber: "",
      cardHolder: "",
      expiryDate: "",
      cvv: "",
    },
  });

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.replace(/(\d{4})/g, "$1 ").trim();
    e.target.value = value;
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 2) {
      value = value.slice(0, 2) + "/" + value.slice(2, 4);
    }
    e.target.value = value;
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    e.target.value = value;
  };

  const handleFormSubmit = async (data: CardPreviewFormData) => {
    const result = await onSubmit(data);
    if (result.success) {
      setCurrentPlan(result.plan);
      router.push("/thank-you");
    }
  };

  return (
    <form
      id="payment-form"
      onSubmit={handleSubmit(handleFormSubmit)}
      className="w-full h-screen flex flex-col items-center justify-center p-4"
    >
      <CardPreview
        register={register}
        errors={errors}
        onCardNumberChange={handleCardNumberChange}
        onExpiryDateChange={handleExpiryDateChange}
        onCvvChange={handleCvvChange}
        defaultTheme="gradient"
        selectedPlan={selectedPlan} 
        isSubmitting={isSubmitting}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
      />
      <Button
        type="submit"
        disabled={isSubmitting}
        className="mt-8 w-full max-w-md bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors shadow-md"
      >
        Pay ${selectedPlan.price.toFixed(2)}
      </Button>
    </form>
  );
}