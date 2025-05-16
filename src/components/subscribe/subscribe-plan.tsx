import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { usePlan } from "@/components/subscribe/plan-context"
import { subscribeSchema } from "@/lib/validation/subscribe-schema"
import { z } from "zod"

interface SubscribePlanProps {
  id: string
  name: string
  price: number
  features: string[]
}

export default function SubscribePlan({
  id,
  name,
  price,
  features,
}: SubscribePlanProps) {
  const router = useRouter()
  const { userId } = usePlan()

  const handleSelect = () => {
    if (!userId) {
      console.error("No userId available")
      alert("User ID not found. Please try again.")
      return
    }

    try {
      subscribeSchema.parse({
        planId: id,
        userId,
      })
    } catch (validationError) {
      const errorMessage = validationError instanceof z.ZodError
        ? validationError.errors.map((e: z.ZodIssue) => e.message).join(", ")
        : "Invalid subscription data"
      console.error("Subscription validation failed:", errorMessage)
      alert(errorMessage)
      return
    }

    router.push(
      `/payment?planId=${id}&name=${encodeURIComponent(name)}&price=${price}&userId=${userId}`
    )
  }

  return (
    <div className="relative rounded-lg p-6 flex flex-col h-[400px] transform hover:scale-105 transition-transform duration-300  border border-gray-700 shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-br  backdrop-blur-md rounded-lg" />
      {/* <div className="absolute w-20 h-20 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-20 blur-xl top-20 -left-10" /> */}
      <div className="relative flex flex-col h-full text-white/90 pt-2">
     
      <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-bold">
            <span className="text-blue-400">{name}</span>
          </h3>
          {id === "2" && (
            <span className="bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
              Popular
            </span>
          )}
        </div>

     
        <p className="text-2xl font-semibold mb-2">
          ${price.toFixed(2)}/month
        </p>

        <p className="text-sm text-gray-300 mb-4">
          {name === "Basic" && "Essential news access for casual readers and even more"}
          {name === "Premium" && "Enhanced news access with exclusive content"}
          {name === "Pro" && "Unlimited news access with premium features"}
        </p>

        <Button
          onClick={handleSelect}
          className="w-full bg-blue-500 text-white hover:bg-blue-600 mb-4"
        >
          Get {name}
        </Button>

       <ul className="space-y-2 text-sm flex-grow">
          {name !== "Basic" && (
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Everything in {name === "Pro" ? "Premium" : "Basic"}
            </li>
          )}
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              {feature}
            </li>
            
          ))}
        </ul>
      </div>
    </div>
  )
}