import { PlanType } from "@/components/subscribe/plan-context"

export interface Plan {
  id: string
  name: PlanType
  price: number
  description: string
  features: string[]
}

export const plans: Plan[] = [
  {
    id: "1",
    name: "Basic",
    price: 9.99,
    description: "Essential news access for casual readers",
    features: ["Access to 10+ news articles", "Basic support", "Standard updates"],
  },
  {
    id: "2",
    name: "Premium",
    price: 19.99,
    description: "Enhanced news access with exclusive content",
    features: [
      "Access to 50+ news articles",
      "Priority support",
      "Advanced updates",
      "Exclusive content",
    ],
  },
  {
    id: "3",
    name: "Pro",
    price: 29.99,
    description: "Unlimited news access with premium features",
    features: [
      "Unlimited news access",
      "24/7 support",
      "Premium updates",
      "Exclusive reports",
      "Custom alerts",
    ],
  },
]