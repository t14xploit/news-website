"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import PaymentForm from "@/components/payment/payment-form";
import { processPayment } from "@/actions/payment-actions";
import { PaymentFormData } from "@/lib/validation/payment-schema";

interface ProcessPaymentResult {
  success: boolean;
  plan: string;
  price: number;
  error?: string;
}

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get("planId");
  const name = searchParams.get("name") || "Basic" || "Premium" || "Pro";
  const price = parseFloat(
    searchParams.get("price") || "9.99" || "19.99" || "29.99"
  );
  const [error, setError] = useState<string | null>(null);

  const selectedPlan = { id: planId || "", name, price };

  const handlePaymentSubmit = async (data: PaymentFormData) => {
    setError(null);
    const result: ProcessPaymentResult = await processPayment(
      data,
      selectedPlan
    );
    if (result.success) {
      router.push(
        `/thank-you?plan=${encodeURIComponent(result.plan)}&price=${
          result.price
        }`
      );
    } else {
      setError(result.error || "Payment failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-16">
      <div className="text-center">
        {error && (
          <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
        )}
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Subscribe to <span className="text-blue-400">{name}</span> News
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Enjoy the Best Updates Every Month
        </p>
        <PaymentForm
          onSubmit={handlePaymentSubmit}
          selectedPlan={selectedPlan}
        />
      </div>
    </div>
  );
}
