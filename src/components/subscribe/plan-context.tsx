"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { getActiveSubscription } from "@/actions/subscribe-action"

export type PlanType = "Basic" | "Premium" | "Pro" | ""

interface PlanContextType {
  currentPlan: PlanType
  setCurrentPlan: React.Dispatch<React.SetStateAction<PlanType>>
}

const PlanContext = createContext<PlanContextType>({
  currentPlan: "",
  setCurrentPlan: () => {},
})

export function PlanProvider({ children }: { children: React.ReactNode }) {
  const getInitialPlan = (): PlanType => {
    if (typeof window === "undefined") {
      console.log("SSR: Initializing currentPlan as ''")
      return ""
    }
   
   console.log("Client: Clearing localStorage and initializing currentPlan as ''")
    localStorage.removeItem("currentPlan")
    localStorage.removeItem("userId")
    return ""
  }

  const [currentPlan, setCurrentPlan] = useState<PlanType>(getInitialPlan())

 useEffect(() => {
    async function syncPlan() {
      let userId = localStorage.getItem("userId")
      if (!userId) {
        userId = `user_${Date.now()}`
        localStorage.setItem("userId", userId)
      }
      console.log("Fetching backend plan for user", userId)
      const backendPlan = await getActiveSubscription(userId)
      console.log("Backend plan:", backendPlan)
      if (backendPlan) {
        console.log("Setting currentPlan from backend:", backendPlan)
        setCurrentPlan(backendPlan)
        localStorage.setItem("currentPlan", backendPlan)
      } else {
        console.log("No backend plan, setting to ''")
        setCurrentPlan("")
        localStorage.setItem("currentPlan", "")
      }
    }
    syncPlan()
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined" ) {
      console.log("Saving currentPlan to localStorage:", currentPlan)
      localStorage.setItem("currentPlan", currentPlan)
    }
  }, [currentPlan])

  return (
    <PlanContext.Provider value={{ currentPlan, setCurrentPlan }}>
      {children}
    </PlanContext.Provider>
  )
}

export const usePlan = () => {
  const context = useContext(PlanContext)
  if (!context) {
    throw new Error("usePlan must be used within a PlanProvider")
  }
  return context
}