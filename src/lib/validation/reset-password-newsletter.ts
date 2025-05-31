import { z } from "zod";

export const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
});

export const newsletterSchema = z.object({
  categories: z.array(z.string()).min(1, "At least one category is required"),
  frequency: z.enum(["daily", "weekly", "monthly"], {
    errorMap: () => ({
      message: "Frequency must be daily, weekly, or monthly",
    }),
  }),
});

export const passwordChangeSchema = z
  .object({
    oldPassword: z
      .string()
      .min(8, "Current password must be at least 8 characters"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Confirm password must be at least 8 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
