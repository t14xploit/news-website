"use client"


import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import { RealisticCardPreview } from "./realistic-card-preview"
import { usePaymentForm } from "../hooks/use-payment-form"
import { CardBackground, SavedCard, PaymentFormData } from "../types"
import { Toaster } from "react-hot-toast"

interface CardPreviewProps {
  initialCards?: SavedCard[]
  onCardAdded?: (card: SavedCard) => void 
  defaultTheme?: CardBackground
}

export function CardPreview({ 
  initialCards = [], 
  onCardAdded, 
  defaultTheme = "gradient" 
}: CardPreviewProps) {
  const {
    form: { 
      register, 
      handleSubmit, 
      formState: { errors } 
    },
    cardType,
    cardBackground,
    savedCards,
    editingCardId,
    isLoading,
    formMode,
    setCardBackground,
    handleCardNumberChange,
    handleExpiryDateChange,
    handleCvvChange,
    onSubmit,
    handleCancelEdit,
    handleCancel,
    handleAddCard,
  } = usePaymentForm({ 
    initialCards, 
    defaultTheme 
  })

  const handleFormSubmit = async (data: PaymentFormData) => {
    await onSubmit(data)
    if (!editingCardId && !errors.cardNumber && !errors.cardHolder && !errors.expiryDate && !errors.cvv) {
      const newCard: SavedCard = {
        id: `card-${Date.now()}`,
        cardNumber: data.cardNumber,
        cardHolder: data.cardHolder,
        expiryDate: data.expiryDate,
        cvv: data.cvv,
        cardType,
        isDefault: savedCards.length === 0,
      }
      onCardAdded?.(newCard)
    }
  }

 return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold mb-6">Payment Details</h1>

      <Card className="w-full max-w-lg mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{editingCardId ? "Edit Card" : formMode === "add" ? "Add Card" : "Enter Card"}</CardTitle>
            {(formMode === "payment") && (
              <Button
                variant="outline"
                size="icon"
                onClick={handleAddCard}
                aria-label="Add new card"
              >
                <Plus className="h-5 w-5" />
              </Button>
            )}
          </div>
          <CardDescription>
            {editingCardId ? "Update your card information." : formMode === "add" ? "Enter details to add a new card." : "Enter your card details to complete the payment."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="payment-form" className="space-y-6" onSubmit={handleSubmit(handleFormSubmit)}>
            <div className="flex justify-center">
              <RealisticCardPreview
                register={register}
                errors={errors}
                onCardNumberChange={handleCardNumberChange}
                onExpiryDateChange={handleExpiryDateChange}
                onCvvChange={handleCvvChange}
                cardType={cardType}
                cardBackground={cardBackground}
              />
            </div>

            <div className="grid gap-4 pt-4">
              <div>
                <h3 className="mb-2 text-sm font-medium">Card Theme</h3>
                <RadioGroup
                  defaultValue={defaultTheme}
                  value={cardBackground}
                  onValueChange={(value: string) => setCardBackground(value as CardBackground)}
                  aria-label="Select card theme"
                  className="grid grid-cols-4 gap-2"
                >
                  {["gradient", "blue", "purple", "black"].map((theme) => (
                    <div key={theme}>
                      <RadioGroupItem value={theme} id={theme} className="peer sr-only" />
                      <Label
                        htmlFor={theme}
                        className={`flex h-10 cursor-pointer items-center justify-center rounded-md border-2 border-muted text-xs text-white peer-data-[state=checked]:border-primary ${
                          theme === "gradient"
                            ? "bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600"
                            : theme === "blue"
                            ? "bg-gradient-to-br from-blue-400 via-blue-600 to-blue-900"
                            : theme === "purple"
                            ? "bg-gradient-to-br from-purple-400 via-purple-600 to-purple-900"
                            : theme === "black"
                            ? "bg-gradient-to-br from-gray-900 via-black to-gray-900"
                            : "bg-gradient-to-br from-gray-900 via-black to-gray-900"
                        }`}
                      >
                        {theme.charAt(0).toUpperCase() + theme.slice(1)}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={editingCardId ? handleCancelEdit : handleCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            form="payment-form" 
            disabled={isLoading}
            className="relative"
          >
            {isLoading && (
              <span className="absolute left-3 top-1/2 -translate-y-1/2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
            )}
            <span className={isLoading ? "pl-6" : ""}>
              {formMode === "add" || editingCardId ? "Save Changes" : "Pay Now"}
            </span>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}