"use client"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar-nav/app-sidebar"
import { useEffect, useState } from "react"

interface SidebarStyle extends React.CSSProperties {
  "--sidebar-width"?: string
  "--sidebar-width-icon"?: string
  "--header-height"?: string
}

export function ClientSidebarWrapper({ children }: { children: React.ReactNode }) {
  const [sidebarState, setSidebarState] = useState<{
    collapsible: "none" | "icon" | "offcanvas" | undefined
    variant: string
  }>({
    collapsible: "icon", 
    variant: "sidebar",
  })

  useEffect(() => {
    const savedState = localStorage.getItem("sidebar-state")
    if (savedState) {
      const validStates: Array<"none" | "icon" | "offcanvas"> = ["none", "icon", "offcanvas"]
      if (validStates.includes(savedState as "none" | "icon" | "offcanvas")) {
        setSidebarState({ collapsible: savedState as "none" | "icon" | "offcanvas", variant: "sidebar" })
      }
    }
  }, [])

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "18rem",
          "--sidebar-width-icon": "3rem",
          "--header-height": "4rem",
        } as SidebarStyle
      }
    >
      <AppSidebar collapsible={sidebarState.collapsible} />
      <SidebarInset>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}