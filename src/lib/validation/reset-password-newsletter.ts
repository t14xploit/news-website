import { z } from "zod";

export const passwordResetSchema = z.object({
  email: z.string().email(),
});

export const newsletterSchema = z.object({
  categories: z.array(z.string().min(1)),
  frequency: z.enum(["daily", "weekly", "monthly"]),
});
