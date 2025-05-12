"use client"

import * as React from "react"
import { Sparkles, EllipsisVertical, CreditCard } from "lucide-react"
// import { useRouter } from "next/navigation"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  // DropdownMenuLabel,
  // DropdownMenuSeparator,
  // DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"

type PlanType = "Basic" | "Premium" | "Pro" | ""

export function PlanSwitcher({
  items,
  currentPlan,
}: {
  items: {
    title: PlanType
    url: string
    icon: React.ElementType
    isActive?: boolean
  }[]
  currentPlan: PlanType
  setCurrentPlan: React.Dispatch<React.SetStateAction<PlanType>>
}) {
  const { isMobile } = useSidebar()
  const [isManageClicked, setIsManageClicked] = React.useState(false)
  // const router = useRouter()

  const plans = items.filter((item) => item.title !== "").map((item) => ({
    name: item.title,
    icon: item.icon,
    description: "Subscription plan",
  }))

  const activePlan =
    plans.find((plan) => plan.name === currentPlan) ||
    { name: "Choose a plan", icon: Sparkles, description: "No subscription" }

    const planColors: Record<PlanType | "Choose a plan", string> = {
      Basic: "text-gray-300",
      Premium: "text-gray-300",
      Pro: "text-gray-300",
      "": "text-gray-300",
      "Choose a plan": "text-gray-300",
    }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-opacity-20 bg-gray-700-600 backdrop-blur-md border shadow-lg">
                <activePlan.icon className="size-4 text-gray-300" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className={`truncate font-semibold text-md ${planColors[activePlan.name]}`}>
                  {activePlan.name}
                </span>
                <span className="truncate text-xs text-gray-400">
                  {activePlan.description}
                </span>
              </div>
              <EllipsisVertical className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            {/* <DropdownMenuLabel className="text-xs text-muted-foreground"></DropdownMenuLabel> */}
            {/* {plans.map((plan, index) => (
              <DropdownMenuItem
                key={plan.name}
                onClick={() => router.push("/subscribe")}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <plan.icon className="size-4 shrink-0" />
                </div>
                {plan.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))} */}
            {/* <DropdownMenuSeparator /> */}
      <DropdownMenuItem
              className={`gap-2 p-2 ${isManageClicked ? "ml-6" : ""}`}
              onClick={() => setIsManageClicked(true)}
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <CreditCard className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">
                <a href="/subscribe">Manage subscription</a>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}