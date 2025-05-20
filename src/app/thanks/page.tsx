"use client"

import { CheckCircle } from "lucide-react"
import { useSearchParams, useRouter } from "next/navigation"
import { useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { CardBackground } from "@/components/payment-card"

const validPlans = ["Basic", "Premium", "Pro"]
const validCardBackgrounds = ["blue", "purple", "black", "gradient"]

export default function ThankYouPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const rawPlan = searchParams.get("plan") || "Basic"
  const plan = validPlans.includes(rawPlan) ? rawPlan : "Basic"
  const priceMap: Record<string, number> = {
    Basic: 9.99,
    Premium: 19.99,
    Pro: 29.99,
  }
  const rawCardHolder = searchParams.get("cardHolder") || "User"
  const cardHolder = rawCardHolder.replace(/[<>]/g, "")
  const lastFour = searchParams.get("lastFour") || "****"
  const cardType = searchParams.get("cardType") || "visa"

  const rawCardBackground = searchParams.get("cardBackground") || "gradient"
  const cardBackground = validCardBackgrounds.includes(rawCardBackground)
    ? (rawCardBackground as CardBackground)
    : "gradient"

  useEffect(() => {
    if (!validPlans.includes(rawPlan) || !rawCardHolder) {
      router.push("/")
    }
  }, [rawPlan, rawCardHolder, router])

  const getCardBgClass = () => {
    switch (cardBackground) {
      case "blue":
        return "bg-gradient-to-br from-blue-400 via-blue-600 to-blue-800"
      case "purple":
        return "bg-gradient-to-br from-purple-400 via-purple-600 to-purple-900"
      case "black":
        return "bg-gradient-to-br from-gray-700 via-gray-900 to-black"
      case "gradient":
      default:
        return "bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-600"
    }
  }

  const getCardLogo = () => {
    switch (cardType) {
      case "visa":
        return <div className="text-white font-bold text-xl tracking-wider">VISA</div>
      case "mastercard":
        return <div className="text-white font-bold text-xl tracking-wider">MASTERCARD</div>
      case "amex":
        return <div className="text-white font-bold text-xl tracking-wider">AMEX</div>
      case "discover":
        return <div className="text-white font-bold text-xl tracking-wider">DISCOVER</div>
      default:
        return <div className="text-white font-bold text-xl tracking-wider">CARD</div>
    }
  }

  return (
    <div className="container mx-auto py-12 flex flex-col items-center justify-start gap-6">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold mb-4">
          Thank You for Your <span className="text-primary">{plan}</span> Subscription,{" "}
          <span className="font-medium">{cardHolder}</span>!
        </h1>
        <p className="text-lg text-muted-foreground flex items-center justify-center gap-2">
          Your payment was processed successfully
          <CheckCircle className="text-green-600 w-5 h-5" />
        </p>
      </div>

      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div
            className={cn(
              "relative rounded-lg p-6 flex flex-col h-[250px] w-full transform hover:scale-105 transition-transform duration-300 border border-gray-700/30 shadow-lg overflow-hidden",
            )}
          >
            <div className={cn("absolute inset-0 backdrop-blur-md rounded-lg", getCardBgClass())} />

            {/* Card shine effect */}
            <div className="absolute inset-0 rounded-lg overflow-hidden">
              <div className="absolute -inset-[400%] bg-gradient-to-r from-transparent via-white/20 to-transparent card-shine"></div>
            </div>

            <div className="relative flex flex-col h-full text-white/90 pt-2">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  {/* Card Chip */}
                  <div className="w-10 h-7 bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-md border border-yellow-700/50 shadow-inner"></div>
                </div>
                {getCardLogo()}
              </div>

              <h2 className="text-2xl font-semibold mb-6">Subscription Details:</h2>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Plan:</span>
                  <span className="font-medium text-white">{plan}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-white/70">Price:</span>
                  <span className="font-medium text-white">${priceMap[plan].toFixed(2)}/month</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-white/70">Card:</span>
                  <span className="font-medium text-white">•••• •••• •••• {lastFour}</span>
                </div>
              </div>

              <div className="mt-auto">
                <p className="text-white/80 text-sm">You now have access to all {plan} content.</p>
                <p className="text-white/80 text-sm mt-1">Enjoy your subscription!</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
