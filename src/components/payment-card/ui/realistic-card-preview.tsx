"use client"

import * as React from "react"
import { CreditCard, RefreshCw } from "lucide-react"
import type { UseFormRegister, FieldErrors } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { PaymentFormData } from "../types"
import { CardType, CardBackground } from "../types"
import { JSX } from "react"

interface RealisticCardPreviewProps {
  register: UseFormRegister<PaymentFormData>
  errors: FieldErrors<PaymentFormData>
  onCardNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onExpiryDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onCvvChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  cardType: CardType
  cardBackground: CardBackground
}

export function RealisticCardPreview({
  register,
  errors,
  onCardNumberChange,
  onExpiryDateChange,
  onCvvChange,
  cardType,
  cardBackground,
}: RealisticCardPreviewProps) {
  const [isFlipped, setIsFlipped] = React.useState(false)

  const getCardBgClass = () => {
    const bgClasses: Record<CardBackground, string> = {
      gradient: "bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600",
      blue: "bg-gradient-to-br from-blue-400 via-blue-600 to-blue-900",
      purple: "bg-gradient-to-br from-purple-400 via-purple-600 to-purple-900",
      black: "bg-gradient-to-br from-gray-900 via-black to-gray-900",
    }
    return bgClasses[cardBackground]
  }

  const getCardLogo = () => {
    const logos: Record<CardType, JSX.Element> = {
      visa: <div className="text-white font-bold tracking-tighter text-2xl">
            <span className="italic">VISA</span>
          </div>,
      mastercard: <div className="flex">
            <div className="h-8 w-8 rounded-full bg-red-500 opacity-80"></div>
            <div className="h-8 w-8 -ml-4 rounded-full bg-yellow-500 opacity-80"></div>
          </div>,
      amex:  <div className="text-white font-bold text-xl">
            <span>AMERICAN EXPRESS</span>
          </div>,
      discover:  <div className="text-white font-bold text-xl">
            <span>DISCOVER</span>
          </div>,
      generic: <div className="text-white font-bold tracking-tighter text-2xl">
            <span className="italic">Bank</span>
          </div>,
    }
    return logos[cardType]
  }

  React.useEffect(() => {
    const cvvInput = document.getElementById("cvv-input")
    if (isFlipped && cvvInput) {
      setTimeout(() => cvvInput.focus(), 500)
    }
  }, [isFlipped])

  const handleFlipClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsFlipped(!isFlipped)
  }

  return (
    <div className="relative w-full max-w-[380px] h-[240px] perspective-1000 my-8">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="absolute -top-10 right-0 z-10"
        onClick={handleFlipClick}
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        Flip Card
      </Button>

      <div className={cn("relative w-full h-full transition-transform duration-700 transform-style-3d", isFlipped ? "rotate-y-180" : "")}>
        <div className={cn("absolute w-full h-full backface-hidden rounded-xl p-6 flex flex-col border border-gray-700/30 shadow-xl", isFlipped ? "pointer-events-none" : "")}>
          <div className={cn("absolute inset-0 backdrop-blur-md rounded-xl", getCardBgClass(), "before:absolute before:inset-0 before:rounded-xl before:bg-white/10 before:backdrop-blur-sm before:opacity-30")} />
          <div className="absolute inset-0 rounded-xl overflow-hidden">
            <div className="absolute -inset-[400%] bg-gradient-to-r from-transparent via-white/20 to-transparent card-shine"></div>
          </div>

          <div className="relative flex flex-col h-full text-white/90 pt-2">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-9 bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-md border border-yellow-700/50 shadow-inner flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full relative">
                    <div className="absolute inset-1 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-sm border border-yellow-700/70">
                      <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-yellow-300 rounded-sm"></div>
                      <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-yellow-300 rounded-sm"></div>
                      <div className="absolute bottom-1 left-1 w-1.5 h-1.5 bg-yellow-300 rounded-sm"></div>
                      <div className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-yellow-300 rounded-sm"></div>
                      <div className="absolute inset-2 border border-dashed border-yellow-700/70 rounded-sm"></div>
                    </div>
                  </div>
                </div>
                <CreditCard className="w-7 h-7 text-white/90 rotate-90" />
              </div>
              {getCardLogo()}
            </div>

            <div className="space-y-4 flex-grow">
              <div className="text-center">
                <Input
                  {...register("cardNumber")}
                  placeholder="•••• •••• •••• ••••"
                  className="w-full text-center font-mono tracking-wider text-xl bg-transparent border-none focus-visible:ring-1 focus-visible:ring-white/30 placeholder:text-white/70 text-white/90"
                  onChange={onCardNumberChange}
                />
                {errors.cardNumber && <p className="text-red-300 text-xs mt-1">{errors.cardNumber.message}</p>}
              </div>

              <div className="flex justify-between items-end">
                <div className="space-y-1 w-1/2">
                  <div className="text-xs text-white/70 uppercase">Card Holder</div>
                  <Input
                    {...register("cardHolder")}
                    placeholder="CARD HOLDER"
                    className="w-full bg-transparent border-none focus-visible:ring-1 focus-visible:ring-white/30 text-white/90 placeholder:text-white/70 text-sm"
                  />
                  {errors.cardHolder && <p className="text-red-300 text-xs">{errors.cardHolder.message}</p>}
                </div>
                <div className="space-y-1 w-1/3">
                  <div className="text-xs text-white/70 uppercase">Expires</div>
                  <Input
                    {...register("expiryDate")}
                    placeholder="MM/YY"
                    className="w-full bg-transparent border-none focus-visible:ring-1 focus-visible:ring-white/30 text-white/90 placeholder:text-white/70 text-sm"
                    onChange={onExpiryDateChange}
                  />
                  {errors.expiryDate && <p className="text-red-300 text-xs">{errors.expiryDate.message}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={cn("absolute w-full h-full backface-hidden rounded-xl border border-gray-700/30 shadow-xl rotate-y-180", !isFlipped ? "pointer-events-none" : "")}>
          <div className={cn("absolute inset-0 backdrop-blur-md rounded-xl", getCardBgClass(), "before:absolute before:inset-0 before:rounded-xl before:bg-white/10 before:backdrop-blur-sm before:opacity-30")} />
          <div className="absolute inset-0 rounded-xl overflow-hidden">
            <div className="absolute -inset-[400%] bg-gradient-to-r from-transparent via-white/20 to-transparent card-shine"></div>
          </div>

          <div className="relative h-full flex flex-col">
            <div className="w-full h-12 bg-black/90 mt-6"></div>
            <div className="flex flex-col items-end px-6 mt-6">
              <div className="w-3/4 h-10 bg-white/90 rounded-sm flex items-center">
                <div className="w-3/4 h-8 mx-2 bg-gray-100 overflow-hidden">
                  <div className="w-full h-full font-mono text-xs text-gray-400 italic flex items-center px-2 overflow-hidden">
                    Signature
                  </div>
                </div>
                <div className="w-1/4 h-8 bg-white border border-gray-300 rounded-sm flex items-center justify-center">
                  <Input
                    id="cvv-input"
                    {...register("cvv")}
                    placeholder="***"
                    className="w-full h-full text-center font-mono bg-transparent border-none focus-visible:ring-0 text-black placeholder:text-gray-400 text-sm"
                    onChange={onCvvChange}
                  />
                </div>
              </div>
              {errors.cvv && <p className="text-red-300 text-xs mt-1">{errors.cvv.message}</p>}
              <div className="text-xs text-white/70 mt-1">CVV</div>
            </div>
            <div className="mt-auto p-4 text-white/80 text-xs">
              <p>This card is property of the issuing bank.</p>
              <p className="text-[10px] mt-1">
                Use of this card is subject to the terms and conditions of your agreement with the issuer.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}