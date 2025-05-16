"use client"

import { SavedCardsList } from "./saved-card-list"
import { SavedCard } from "../types"

interface CardListProps {
  initialCards?: SavedCard[]
  onEditCard: (id: string) => void
  onDeleteCard: (id: string) => void
  onSetDefaultCard: (id: string) => void
  updatedCardId?: string | null
}

export function CardList({ 
  initialCards = [], 
  onEditCard, 
  onDeleteCard, 
  onSetDefaultCard, 
  updatedCardId = null 
}: CardListProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-6">Saved Cards</h1>
      <SavedCardsList
        cards={initialCards}
        updatedCardId={updatedCardId}
        onEditCard={onEditCard}
        onDeleteCard={onDeleteCard}
        onSetDefaultCard={onSetDefaultCard}
      />
    </div>
  )
}