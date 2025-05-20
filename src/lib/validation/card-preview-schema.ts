import { z } from "zod";

export const cardPreviewSchema = z.object({
  cardNumber: z.string()
    .transform((val) => val.replace(/\s/g, "")) 
    .pipe(
      z.string()
        .length(16, "Card number must be 16 digits (excluding spaces)")
        .regex(/^\d+$/, "Card number must contain only digits")
    ),
  cardHolder: z.string()
    .min(1, "Cardholder name is required")
    .max(50, "Cardholder name is too long"),
  expiryDate: z.string()
    .regex(/^\d{2}\/\d{2}$/, "Format must be MM/YY")
    .refine((val) => {
      const [month, year] = val.split("/").map(Number);
      const currentDate = new Date(); 
      const currentYear = currentDate.getFullYear() % 100; 
      const currentMonth = currentDate.getMonth() + 1; 

      if (month < 1 || month > 12) return false;
      if (year < currentYear) return false;
      if (year === currentYear && month < currentMonth) return false;
      return true;
    }, {
      message: "Expiry date must be in the future",
    }),
  cvv: z.string()
    .min(3, "CVV must be at least 3 digits")
    .max(4, "CVV must be at most 4 digits")
    .regex(/^\d+$/, "CVV must contain only digits"),
});

export type CardPreviewFormData = z.infer<typeof cardPreviewSchema>;