import { z } from "zod";

const validPlanIds = ["1", "2", "3"] as const;

export const subscribeSchema = z.object({
  planId: z.enum(validPlanIds, {
    errorMap: (issue, ctx) => ({
      message: `Invalid plan ID: "${ctx.data}". Must be one of: ${validPlanIds.join(", ")}`,
    }),
  }),
  userId: z.string()
    .min(1, "User ID is required")
    .regex(/^user_\d+$|^[a-zA-Z0-9]+$/, "User ID must be in the format 'user_<timestamp>' or a valid identifier"),
});

export type SubscribeFormData = z.infer<typeof subscribeSchema>;