"use client"

import { Check, CreditCard, MoreVertical, Star, Trash, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SavedCard } from "../types"
import { cn } from "@/lib/utils"

interface SavedCardsListProps {
  cards: SavedCard[]
  updatedCardId: string | null
  onDeleteCard: (id: string) => void
  onSetDefaultCard: (id: string) => void
  onEditCard: (id: string) => void
}

export function SavedCardsList({ cards, updatedCardId, onDeleteCard, onSetDefaultCard, onEditCard }: SavedCardsListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Saved Cards</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {cards.map((card) => (
            <div
              key={card.id}
              className={cn(
                "flex items-center justify-between p-3 rounded-lg border transition-colors duration-300",
                card.isDefault ? "border-primary bg-primary/5" : "border-border",
                card.id === updatedCardId ? "bg-green-100/50 dark:bg-green-900/50" : ""
              )}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-medium">
                    •••• •••• •••• {card.cardNumber.slice(-4)}
                    {card.isDefault && (
                      <span className="ml-2 text-xs text-primary">
                        <Star className="inline w-3 h-3 mr-1" />
                        Default
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {card.cardHolder} • Expires {card.expiryDate}
                  </div>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="w-4 h-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {!card.isDefault && (
                    <DropdownMenuItem onClick={() => onSetDefaultCard(card.id)}>
                      <Check className="w-4 h-4 mr-2" />
                      Set as default
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => onEditCard(card.id)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit card
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDeleteCard(card.id)} className="text-destructive">
                    <Trash className="w-4 h-4 mr-2" />
                    Delete card
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}