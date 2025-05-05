"use server";

export async function selectSubscription(planId: string) {
  console.log(`Selected plan with ID: ${planId}`);
  return { success: true, planId };
}
