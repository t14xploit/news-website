"use server";

import { prisma } from "@/lib/prisma";
import { PlanType } from "@/components/subscribe/plan-context";
import { plans } from "@/lib/subscribe/plans";

export async function selectSubscription(
  planId: string,
  userId: string,
  userEmail?: string
) {
  try {
    console.log(
      `Selecting plan with ID: ${planId} for user: ${userId} at 03:11 PM CEST, May 14, 2025`
    );

    const plan = plans.find((p) => p.id === planId);
    if (!plan) {
      throw new Error(
        `Invalid plan ID: ${planId}. Must be one of: ${plans
          .map((p) => p.id)
          .join(", ")}`
      );
    }

    const subscriptionType = await prisma.subscriptionType.upsert({
      where: { id: planId },
      update: {},
      create: {
        id: planId,
        name: plan.name,
        description: plan.description,
        price: plan.price,
        features: plan.features,
      },
    });

    let user = await prisma.user.findUnique({
      where: { id: userId },
    });

    //Sophie  - if the user does not exist, and if the email is provided -> create
    if (!user) {
      if (userEmail) {
        user = await prisma.user.create({
          data: {
            id: userId,
            email: userEmail,
            name: "",
            role: "",
            emailVerified: false,
          },
        });
        console.log(
          `Created new user with ID: ${userId} and email: ${userEmail}`
        );
      } else {
        throw new Error(
          "User not found and email not provided to create a new user."
        );
      }
    }
    // if (!user) {
    //   user = await prisma.user.create({
    //     data: {
    //       id: userId,
    //       email: `${userId}@ufo.io`,
    //       name: "",
    //       role: "USER",
    //       emailVerified: false,
    //     },
    //   });
    //   console.log(`Created new user with ID: ${userId}`);
    // }

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

    // Sophie - subscription Business -> editor role
    if (plan?.name === "Business") {
      await prisma.user.update({
        where: { id: userId },
        data: { role: "editor" },
      });
    }

    return {
      success: true,
      planId,
      planName: subscriptionType.name as PlanType,
      userId,
      subscriptionId: subscription.id,
    };
  } catch (error) {
    console.error("Failed to select subscription:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getActiveSubscription(
  userId: string
): Promise<{ plan: PlanType | ""; subscriptionId: string | null }> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      console.log(`No user found with ID: ${userId}, returning empty plan`);
      return { plan: "", subscriptionId: null };
    }

    const subscription = await prisma.subscription.findFirst({
      where: {
        users: { some: { id: userId } },
        expiresAt: { gt: new Date() },
      },
      include: { type: true },
    });

    console.log(
      "Fetched active subscription for user",
      userId,
      ":",
      subscription?.type.name || "none",
      "with ID:",
      subscription?.id || "none"
    );
    return {
      plan: (subscription?.type.name as PlanType) || "",
      subscriptionId: subscription?.id || null,
    };
  } catch (error) {
    console.error("Failed to fetch active subscription:", error);
    return { plan: "", subscriptionId: null };
  }
}
