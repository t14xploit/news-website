"use client"

// import { PaymentMethodList } from "@/components/t-two-payment/payment-method-list"
import { PaymentProvider } from "@/components/t-two-payment/payment-context"
import { Toaster } from "sonner"
// import RealisticCardPreview from "@/components/t-two-payment/realistic-card-preview"
// import { RealisticCardDemo } from "@/components/t-two-payment/realistic-card-demo"
import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { CardPreview } from "@/components/payment-card"
import { usePaymentForm } from "@/components/payment-card/hooks/use-payment-form"

export default function PaymentPage() {
  const searchParams = useSearchParams()
  const editCardId = searchParams.get("editCardId")
  const { handleEditCard } = usePaymentForm()

  useEffect(() => {
    if (editCardId) {
      handleEditCard(editCardId)
    }
  }, [editCardId, handleEditCard])

  return (
    <PaymentProvider>
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <div className="px-4 lg:px-6">
                  {/* <PaymentMethodList /> */}
                </div>
              </div>
              {/* <RealisticCardPreview /> */}
            </div>
           {/* <RealisticCardDemo /> */}
          </div>
         <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <CardPreview />
      </div>
      <Toaster position="top-center" /> 
    </PaymentProvider>
  )
}
