import { CardType } from "../types"

export const detectCardType = (cardNumber: string): CardType => {
  const value = cardNumber.replace(/\D/g, "")
  if (value.startsWith("4")) return "visa"
  if (value.startsWith("5")) return "mastercard"
  if (value.startsWith("34") || value.startsWith("37")) return "amex"
  if (value.startsWith("6")) return "discover"
  return "generic"
}

export const formatCardNumber = (value: string): string => {
  const cleanValue = value.replace(/\D/g, "").slice(0, 16)
  return cleanValue.replace(/(\d{4})(?=\d)/g, "$1 ")
}

export const formatExpiryDate = (value: string): string => {
  const cleanValue = value.replace(/\D/g, "").slice(0, 4)
  return cleanValue.length > 2 ? `${cleanValue.slice(0, 2)}/${cleanValue.slice(2)}` : cleanValue
}

export const formatCvv = (value: string): string => {
  return value.replace(/\D/g, "").slice(0, 4)
}