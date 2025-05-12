"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import PaymentForm from "@/components/payment/payment-form"
import { processPayment } from "@/actions/payment-actions"
import { PaymentFormData } from "@/lib/validation/payment-schema"
import { usePlan } from "@/components/subscribe/plan-context"
import { selectSubscription } from "@/actions/subscribe-action"

type PlanType = "Basic" | "Premium" | "Pro"

interface ProcessPaymentResult {
  success: boolean
  plan: string
  price: number
  userId?: string
  error?: string
}

export default function PaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const planId = searchParams.get("planId") || ""
  const nameFromParams = searchParams.get("name")
  const priceFromParams = searchParams.get("price")
  const { setCurrentPlan } = usePlan()
  const validPlans: PlanType[] = ["Basic", "Premium", "Pro"]
  const name: PlanType = validPlans.includes(nameFromParams as PlanType)
    ? (nameFromParams as PlanType)
    : "Basic" 

  const priceMap: Record<PlanType, number> = {
    Basic: 9.99,
    Premium: 19.99,
    Pro: 29.99,
  }
  const price = priceFromParams && !isNaN(parseFloat(priceFromParams))
    ? parseFloat(priceFromParams)
    : priceMap[name]

  const [error, setError] = useState<string | null>(null)

 const selectedPlan = { id: planId, name, price }

  const handlePaymentSubmit = async (data: PaymentFormData) => {
    setError(null)
    console.log("Processing payment for plan:", selectedPlan.name)

   let userId = localStorage.getItem("userId")
    if (!userId) {
      userId = `user_${Date.now()}`
      localStorage.setItem("userId", userId)
    }

    const subscriptionResult = await selectSubscription(selectedPlan.id, userId)
    if (!subscriptionResult.success) {
      console.error("Subscription selection failed:", subscriptionResult.error)
      setError(subscriptionResult.error || "Failed to select subscription.")
      return {
        success: false,
        plan: selectedPlan.name,
        price: selectedPlan.price,
        error: subscriptionResult.error
      }
    }

    const paymentResult: ProcessPaymentResult = await processPayment(data, selectedPlan)
    if (paymentResult.success) {
      console.log("Payment successful, setting currentPlan to:", selectedPlan.name)
      setCurrentPlan(selectedPlan.name)
      localStorage.setItem("currentPlan", selectedPlan.name)
      if (paymentResult.userId) {
        console.log("Storing userId in localStorage:", paymentResult.userId)
        localStorage.setItem("userId", paymentResult.userId)
      }
      await new Promise((resolve) => setTimeout(resolve, 500))
      console.log("Redirecting to /thank-you")
      router.replace(
        `/thank-you?plan=${encodeURIComponent(paymentResult.plan)}&price=${paymentResult.price}`
      )
    } else {
      console.error("Payment failed:", paymentResult.error)
      setError(paymentResult.error || "Payment failed. Please try again.")
    }
    return paymentResult
  }

  // const handlePaymentSubmit = async (data: PaymentFormData) => {
  //   setError(null)
  //   const result: ProcessPaymentResult = await processPayment(data, selectedPlan)
  //   if (result.success) {
  //     setCurrentPlan(selectedPlan.name) 
  //     await new Promise((resolve) => setTimeout(resolve, 100)) 
  //     router.push(
  //       `/thank-you?plan=${encodeURIComponent(result.plan)}&price=${result.price}`
  //     )
  //   } else {
  //     setError(result.error || "Payment failed. Please try again.")
  //   }
  //   return result
  // }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-16">
      <div className="text-center">
        {error && (
          <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
        )}
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Subscribe to <span className="text-blue-400">{name}</span> News
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Enjoy the Best Updates Every Month
        </p>
        <PaymentForm
          onSubmit={handlePaymentSubmit}
          selectedPlan={selectedPlan}
        />
      </div>
    </div>
  )
}