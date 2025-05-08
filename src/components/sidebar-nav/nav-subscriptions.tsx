"use client"

import type * as React from "react"
import type { LucideIcon } from "lucide-react"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

export function NavSubscriptions({
  items,
  setCurrentPlan,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
      isActive?: boolean
    }[]
  }[]
  currentPlan: string
  setCurrentPlan: React.Dispatch<React.SetStateAction<string>>
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Plan</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild tooltip={item.title} isActive={item.isActive}>
                <a href={item.url}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
              {item.items && (
                <SidebarMenuSub>
                  {item.items.map((subItem) => {
                    const planName =
                      subItem.title.startsWith("Manage plan: ")
                        ? subItem.title.replace("Manage plan: ", "")
                        : subItem.title

                    return (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={subItem.isActive}
                          onClick={(e) => {
                            e.preventDefault()
                            if (planName === "Basic" || planName === "Premium" || planName === "Pro") {
                              setCurrentPlan(planName)
                            }
                          }}
                        >
                          <a href={subItem.url}>
                            <span>{subItem.title}</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    )
                  })}
                </SidebarMenuSub>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}