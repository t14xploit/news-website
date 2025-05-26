import { z } from "zod";

export const paymentSchema = z.object({
  cardNumber: z
    .string()
    .transform((val) => val.replace(/\s/g, ""))
    .pipe(
      z
        .string()
        .length(16, "Card number must be 16 digits (excluding spaces)")
        .regex(/^\d+$/, "Card number must contain only digits")
    ),
  cardHolder: z
    .string()
    .min(1, "Cardholder name is required")
    .max(50, "Cardholder name is too long"),
  expiryDate: z.string().regex(/^\d{2}\/\d{2}$/, "Format must be MM/YY"),
  cvv: z
    .string()
    .length(3, "CVV must be 3 digits")
    .regex(/^\d+$/, "CVV must contain only digits"),
  // email: z.string().min(1, "Email is required").email("Invalid email address"),
});

export type PaymentFormData = z.infer<typeof paymentSchema>;
