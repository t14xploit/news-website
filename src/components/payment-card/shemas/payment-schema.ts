import { z } from "zod"

export const paymentSchema = z.object({
  cardNumber: z
    .string()
    .min(19, "Card number must be 16 digits")
    .regex(/^\d{4} \d{4} \d{4} \d{4}$/, "Invalid card number format"),
  cardHolder: z.string().min(2, "Cardholder name must be at least 2 characters"),
  expiryDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/[0-9]{2}$/, "Invalid expiry date (MM/YY)"),
  cvv: z.string().regex(/^\d{3,4}$/, "CVV must be 3 or 4 digits"),
})