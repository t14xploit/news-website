"use server"; 

import { prisma } from "@/lib/prisma";
import { ReceiptData } from "@/components/receipt/types";
import { CardType } from "@/components/payment-card";

interface SavedCard {
  id: string;
  cardNumber: string;
  cardHolder: string;
  cardType: CardType;
  plan: string;
  price: number;
}

export async function generateReceiptData(
    card: SavedCard, 
    userId: string
): Promise<ReceiptData> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  });

  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const startDate = new Date();
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + 1);

  return {
    id: `2025-OPEN-${card.id.slice(0, 8)}`,
    cardNumber: card.cardNumber,
    cardHolder: card.cardHolder,
    cardType: card.cardType,
    plan: card.plan,
    price: card.price,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    transactionId: `TXN-OPEN-${generateUUID().slice(0, 8)}`,
    userEmail: user?.email || "",
    userAddress: "Downing Street 15, Great London, United Kingdom",
  };
}