"use server";

import { prisma } from "@/lib/prisma";
import { PaymentFormData } from "@/lib/validation/payment-schema";
import { PlanType } from "@/components/subscribe/plan-context";

interface ProcessPaymentResult {
  success: boolean;
  plan: string;
  price: number;
  userId?: string;
  error?: string;
}

export async function processPayment(
  data: PaymentFormData,
  selectedPlan: { id: string; name: PlanType; price: number },
  userId: string
): Promise<ProcessPaymentResult> {
  try {
    const cleanedCardNumber = data.cardNumber.replace(/\s/g, "");
    if (cleanedCardNumber.length !== 16) {
      throw new Error(
        "Card number must be exactly 16 digits (excluding spaces)"
      );
    }

    // const paymentIntent = {
    //   id: "simulated_payment_intent_" + Date.now(),
    //   status: "succeeded",
    // };
    // console.log("Simulated payment intent:", paymentIntent);

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    const subscription = await prisma.subscription.findFirst({
      where: {
        users: { some: { id: userId } },
        typeId: selectedPlan.id,
      },
    });
    if (!subscription) {
      throw new Error(
        `No subscription found for user ${userId} with plan ID ${selectedPlan.id}`
      );
    }

    const payment = await prisma.payment.create({
      data: {
        userId,
        subscriptionId: subscription.id,
        amount: selectedPlan.price,
        status: "succeeded",
        createdAt: new Date(),
      },
    });
    console.log("Payment saved:", payment);

    return {
      success: true,
      plan: selectedPlan.name,
      price: selectedPlan.price,
      userId: userId,
    };
  } catch (error) {
    console.error(
      "Payment processing failed:",
      error instanceof Error ? error.message : error
    );
    return {
      success: false,
      plan: selectedPlan.name,
      price: selectedPlan.price,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
