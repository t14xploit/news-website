export type PaymentFormData = {
  cardNumber: string
  cardHolder: string
  expiryDate: string
  cvv: string
}

export type SavedCard = {
  id: string
  cardNumber: string
  cardHolder: string
  expiryDate: string
  cardType: CardType
  isDefault: boolean
}

export type CardBackground = "blue" | "purple" | "black" | "gradient"
export type CardType = "visa" | "mastercard" | "amex" | "discover" | "generic"