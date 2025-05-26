"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
// import { Button } from "@/components/ui/button"
// import {
//   paymentSchema,
//   PaymentFormData,
// } from "@/lib/validation/payment-schema"
// import CardPreview from "./card-preview"
// import RealisticCardPreview from "@/components/t-two-payment/realistic-card-preview"
import { CardPreviewFormData, cardPreviewSchema } from "@/lib/validation/card-preview-schema"
// import { usePlan } from "../subscribe/plan-context"
import { CardPreview } from "../payment-card/ui/payment-subscribe"
import { Button } from "../ui/button"
// type PlanType = "Basic" | "Premium" | "Pro"

interface ProcessPaymentResult {
  success: boolean
  plan: string
  price: number
  error?: string
}

interface PaymentFormProps {
  onSubmit: (data: CardPreviewFormData) => Promise<ProcessPaymentResult>;
  selectedPlan: { id: string; name: string; price: number };
  cardBackground?: string;
}
// interface PaymentFormProps {
//   onSubmit: (data: PaymentFormData) => Promise<ProcessPaymentResult>
//   selectedPlan: { name: PlanType; price: number }
// }

export default function PaymentForm({
  onSubmit,
  selectedPlan,
  cardBackground = "gradient",
}: PaymentFormProps) {
  // const { setCurrentPlan } = usePlan()
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
     cardBackground: cardBackground as "blue" | "purple" | "black" | "gradient",
      plan: selectedPlan.name as "Free" | "Elite" | "Business",
    },
  })

  // const formData = watch()

const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 16) {
      value = value.slice(0, 16);
    }
    value = value.replace(/(\d{4})/g, "$1 ").trim();
    e.target.value = value;
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "")
    if (value.length > 2) {
      value = value.slice(0, 2) + "/" + value.slice(2, 4)
    }
    e.target.value = value
  }

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    e.target.value = value;
  };

  // const handleFormSubmit = async (data: CardPreviewFormData) => {
  //  await onSubmit(data)
    // const result = await onSubmit(data)
    // if (result.success) {
    //   setCurrentPlan(selectedPlan.name)
    // }
  // }

  return (
    <form
      id="payment-form"
      onSubmit={handleSubmit(async (data) => await onSubmit(data))}
      className="flex flex-col items-center pt-8"
    >
      <CardPreview
        // formData={formData}
        register={register}
        errors={errors}
        onCardNumberChange={handleCardNumberChange}
        onExpiryDateChange={handleExpiryDateChange}
        onCvvChange={handleCvvChange}
        selectedPlan={selectedPlan}
        isSubmitting={isSubmitting}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit} 
      />
      <input type="hidden" {...register("cardBackground")} />
      <input type="hidden" {...register("plan")} />
      <Button
        type="submit"
        disabled={isSubmitting}
        className="mt-8 w-[120px] bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors shadow-md"
      >
        {isSubmitting ? "Processing..." : `Pay $${selectedPlan.price.toFixed(2)}`}
      </Button>
      {/* <Button
        type="submit"
        className="mt-8 w-[120px] bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors shadow-md"
      >
        Pay ${selectedPlan.price.toFixed(2)}
      </Button> */}
    </form>
  );
}