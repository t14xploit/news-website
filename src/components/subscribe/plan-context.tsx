"use client"

import { createContext, useContext, useState } from "react"

interface PlanContextType {
  currentPlan: string
  setCurrentPlan: React.Dispatch<React.SetStateAction<string>>
}

const PlanContext = createContext<PlanContextType>({
  currentPlan: "",
  setCurrentPlan: () => {},
})

export function PlanProvider({ children }: { children: React.ReactNode }) {
  const [currentPlan, setCurrentPlan] = useState("")
  return (
    <PlanContext.Provider value={{ currentPlan, setCurrentPlan }}>
      {children}
    </PlanContext.Provider>
  )
}

export const usePlan = () => useContext(PlanContext)