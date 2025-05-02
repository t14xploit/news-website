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
    const name = searchParams.get("name") || "Basic";
    const price = parseFloat(searchParams.get("price") || "9.99");
    const [error, setError] = useState<string | null>(null);
  
    const selectedPlan = { id: planId || "", name, price };
  
    const handlePaymentSubmit = async (data: PaymentFormData) => {
      setError(null);
      const result: ProcessPaymentResult = await processPayment(data, selectedPlan);
      if (result.success) {
        router.push(`/thank-you?plan=${encodeURIComponent(result.plan)}&price=${result.price}`);
      } else {
        setError(result.error || "Payment failed. Please try again.");
      }
    };
  
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          {error && <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>}
          <PaymentForm onSubmit={handlePaymentSubmit} selectedPlan={selectedPlan} />
        </div>
      </div>
    );
  }