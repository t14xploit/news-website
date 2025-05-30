export type PaymentFormData = {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

export type SavedCard = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isDefault: any;
  id: string;
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
  cardType: CardType;
  cardBackground: CardBackground;
  plan: string;
  price: number;
  lastUsed: string;
}

export type CardBackground = "blue" | "purple" | "black" | "gradient";
export type CardType = "visa" | "mastercard" | "amex" | "discover" | "generic";