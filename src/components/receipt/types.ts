import { CardType } from "../payment-card";

export interface ReceiptData {
  id: string;
  cardNumber: string;
  cardHolder: string;
  cardType: CardType;
  plan: string;
  price: number;
  startDate: string;
  endDate: string;
  transactionId: string;
  userEmail: string;
  userAddress: string;
}