"use server"

import { prisma } from "@/lib/prisma"
import { PlanType } from "@/components/subscribe/plan-context"

export async function selectSubscription(planId: string, userId: string) {
  try {
    console.log(`Selecting plan with ID: ${planId} for user: ${userId}`);

    const subscriptionType = await prisma.subscriptionType.findUnique({
      where: { id: planId },
    });
    if (!subscriptionType) {
      throw new Error(`Subscription type with ID ${planId} not found`);
    }

    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        email: `${userId}@ufo.io`,
        name: "Alien",
      },
    });


    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: { include: { type: true } } },
    });

    let subscription;
    if (existingUser?.subscriptionId && existingUser?.subscription) {
      subscription = await prisma.subscription.update({
        where: { id: existingUser.subscriptionId },
        data: {
          typeId: planId,
          expiresAt: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        },
      });
      console.log("Updated subscription:", subscription);
    } else {
      subscription = await prisma.subscription.create({
        data: {
          typeId: planId,
          createdAt: new Date(),
          expiresAt: new Date(new Date().setMonth(new Date().getMonth() + 1)),
          users: {
            connect: { id: userId },
          },
        },
      });
      await prisma.user.update({
        where: { id: userId },
        data: { subscriptionId: subscription.id },
      });
      console.log("Created subscription:", subscription);
    }

    return {
      success: true,
      planId,
      planName: subscriptionType.name as PlanType,
      userId,
    };
  } catch (error) {
    console.error("Failed to select subscription:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getActiveSubscription(userId: string): Promise<PlanType | ""> {
  try {
    const subscription = await prisma.subscription.findFirst({
      where: {
        users: { some: { id: userId } },
        expiresAt: { gt: new Date() },
      },
      include: { type: true },
    });
    console.log("Fetched active subscription for user", userId, ":", subscription?.type.name || "none");
    return subscription?.type.name as PlanType || "";
  } catch (error) {
    console.error("Failed to fetch active subscription:", error);
    return "";
  }
}