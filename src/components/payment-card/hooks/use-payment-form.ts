"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { paymentSchema } from "../../../lib/validation/payment-schema"
import { PaymentFormData, SavedCard, CardBackground, CardType } from "../types"
import { detectCardType, formatCardNumber, formatExpiryDate, formatCvv } from "../utils/card-utils"
import { toast } from "react-hot-toast"
import router from "next/router"

interface UsePaymentFormOptions {
  initialCards?: SavedCard[]
  defaultTheme?: CardBackground
}

export const usePaymentForm = ({ initialCards = [], defaultTheme = "gradient" }: UsePaymentFormOptions = {}) => {
  const [cardType, setCardType] = useState<CardType>("visa")
  const [cardBackground, setCardBackground] = useState<CardBackground>(defaultTheme)
  const [savedCards, setSavedCards] = useState<SavedCard[]>(initialCards)
  const [editingCardId, setEditingCardId] = useState<string | null>(null)
  const [updatedCardId, setUpdatedCardId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [formMode, setFormMode] = useState<"payment" | "add" | "edit">("payment")

  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardNumber: "",
      cardHolder: "",
      expiryDate: "",
      cvv: "",
    },
  })

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value)
    form.setValue("cardNumber", formatted)
    setCardType(detectCardType(formatted))
  }

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value)
    form.setValue("expiryDate", formatted)
  }

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCvv(e.target.value)
    form.setValue("cvv", formatted)
  }

  const onSubmit = async (data: PaymentFormData) => {
    setIsLoading(true)
    try {
      if (editingCardId) {
        setSavedCards((prev) =>
          prev.map((card) =>
            card.id === editingCardId
              ? {
                  ...card,
                  cardNumber: data.cardNumber,
                  cardHolder: data.cardHolder,
                  expiryDate: data.expiryDate,
                  cardType,
                }
              : card
          )
        )
        setUpdatedCardId(editingCardId)
        setTimeout(() => setUpdatedCardId(null), 2000)
        toast.success("Changes updated!")
        setEditingCardId(null)
        form.reset()
        router.push("/card-list")
      } else {
        const newCard: SavedCard = {
          id: `card-${Date.now()}`,
          cardNumber: data.cardNumber,
          cardHolder: data.cardHolder,
          expiryDate: data.expiryDate,
          cardType,
          isDefault: savedCards.length === 0,
        }
        setSavedCards((prev) => [...prev, newCard])
        if (formMode === "add") {
          toast.success("Card added successfully!")
          setFormMode("payment")
          form.reset()
        } else {
          router.push("/thank-you")
        }
      }
    } catch {
      toast.error("Failed to save card. Please check your inputs.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteCard = (id: string) => {
    setSavedCards((prev) => prev.filter((card) => card.id !== id))
    if (editingCardId === id) {
      setEditingCardId(null)
      setFormMode("payment")
      form.reset()
    }
  }

  const handleSetDefaultCard = (id: string) => {
    setSavedCards((prev) =>
      prev.map((card) => ({
        ...card,
        isDefault: card.id === id,
      }))
    )
  }

  const handleEditCard = (id: string) => {
    const card = savedCards.find((card) => card.id === id)
    if (card) {
      form.reset({
        cardNumber: card.cardNumber,
        cardHolder: card.cardHolder,
        expiryDate: card.expiryDate,
        cvv: "", 
      })
      setCardType(card.cardType)
      setEditingCardId(id)
      setFormMode("edit")
    }
  }

  const handleCancelEdit = () => {
    setEditingCardId(null)
    setFormMode("payment")
    form.reset()
  }

  const handleCancel = () => {
    setFormMode("payment")
    form.reset()
  }

  const handleAddCard = () => {
    setEditingCardId(null)
    setFormMode("add")
    form.reset()
  }

  return {
    form,
    cardType,
    cardBackground,
    savedCards,
    editingCardId,
    updatedCardId,
    isLoading,
    formMode,
    setCardBackground,
    handleCardNumberChange,
    handleExpiryDateChange,
    handleCvvChange,
    onSubmit,
    handleDeleteCard,
    handleSetDefaultCard,
    handleEditCard,
    handleCancelEdit,
    handleCancel,
    handleAddCard,
  }
}