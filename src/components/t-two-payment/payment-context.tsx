"use client"

import * as React from "react"

export type PaymentMethodType = {
  id: string
  type: "card" | "paypal" | "apple"
  cardNumber?: string
  cardExpiry?: string
  name?: string
  city?: string
  isDefault: boolean
}

interface PaymentContextType {
  methods: PaymentMethodType[]
  addMethod: (method: Omit<PaymentMethodType, "id">) => void
  setDefaultMethod: (id: string) => void
  deleteMethod: (id: string) => void
}

export const PaymentContext = React.createContext<PaymentContextType | undefined>(undefined)

export function PaymentProvider({ children }: { children: React.ReactNode }) {
  const [methods, setMethods] = React.useState<PaymentMethodType[]>([
    {
      id: "card-1",
      type: "card",
      cardNumber: "•••• •••• •••• 1234",
      cardExpiry: "06/24",
      name: "John Doe",
      city: "New York",
      isDefault: true,
    },
    {
      id: "card-2",
      type: "card",
      cardNumber: "•••• •••• •••• 5678",
      cardExpiry: "07/25",
      name: "Jane Smith",
      city: "Los Angeles",
      isDefault: false,
    },
  ])

  const addMethod = React.useCallback((method: Omit<PaymentMethodType, "id">) => {
    setMethods((prev) => [
      ...prev,
      {
        ...method,
        id: `card-${Date.now()}`,
      },
    ])
  }, [])

  const setDefaultMethod = React.useCallback((id: string) => {
    setMethods((prev) =>
      prev.map((method) => ({
        ...method,
        isDefault: method.id === id,
      })),
    )
  }, [])

  const deleteMethod = React.useCallback((id: string) => {
    setMethods((prev) => prev.filter((method) => method.id !== id))
  }, [])

  return (
    <PaymentContext.Provider value={{ methods, addMethod, setDefaultMethod, deleteMethod }}>
      {children}
    </PaymentContext.Provider>
  )
}

export function usePayment() {
  const context = React.useContext(PaymentContext)
  if (context === undefined) {
    throw new Error("usePayment must be used within a PaymentProvider")
  }
  return context
}
