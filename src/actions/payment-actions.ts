"use server";

import { prisma } from "@/lib/prisma";
import { PaymentFormData } from "@/lib/validation/payment-schema";

interface ProcessPaymentResult {
  success: boolean;
  plan: string;
  price: number;
  error?: string;
}

export async function processPayment(data: PaymentFormData, selectedPlan: { id: string; name: string; price: number }): Promise<ProcessPaymentResult> {
  try {
    const cleanedCardNumber = data.cardNumber.replace(/\s/g, "");

    if (cleanedCardNumber.length !== 16) {
      throw new Error("Card number must be exactly 16 digits (excluding spaces)");
    }

    const paymentIntent = { id: "simulated_payment_intent_" + Date.now(), status: "succeeded" };
    console.log("Simulated payment intent:", paymentIntent);

    const subscription = await prisma.subscription.create({
      data: {
        typeId: selectedPlan.id,
        expiresAt: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        users: {
          connect: { id: "user_123" }, 
        },
      },
    });

    const payment = await prisma.payment.create({
      data: {
        userId: "user_123",
        subscriptionId: subscription.id,
        amount: selectedPlan.price,
        status: "succeeded",
        createdAt: new Date(),
      },
    });

    console.log("Subscription created:", subscription);
    console.log("Payment saved:", payment);

    return {
      success: true,
      plan: selectedPlan.name,
      price: selectedPlan.price,
    };
  } catch (error) {
    console.error("Payment processing failed:", error instanceof Error ? error.message : error);
    return {
      success: false,
      plan: selectedPlan.name,
      price: selectedPlan.price,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}