"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CardList } from "@/components/payment-card/ui/card-list"
import { SavedCard } from "@/components/payment-card/types"

export default function CardListPage() {
  const router = useRouter()
  const [cards, setCards] = useState<SavedCard[]>([])
  const [updatedCardId] = useState<string | null>(null)

  const handleEditCard = (id: string) => {
    router.push(`/payment?editCardId=${id}`)
  }

  const handleDeleteCard = (id: string) => {
    setCards((prev) => prev.filter((card) => card.id !== id))
  }

  const handleSetDefaultCard = (id: string) => {
    setCards((prev) =>
      prev.map((card) => ({
        ...card,
        isDefault: card.id === id,
      }))
    )
  }

  return (
    <div className="min-h-screen p-6">
      <CardList
        initialCards={cards}
        updatedCardId={updatedCardId}
        onEditCard={handleEditCard}
        onDeleteCard={handleDeleteCard}
        onSetDefaultCard={handleSetDefaultCard}
      />
    </div>
  )
}