"use client";

import * as React from "react";
import { Sparkles, EllipsisVertical, CreditCard } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { usePlan } from "@/components/subscribe/plan-context";

type PlanType = "Free" | "Elite" | "Business" | "";

export function PlanSwitcher({
  items,
}: {
  items: {
    title: PlanType;
    url: string;
    icon: React.ElementType;
    isActive?: boolean;
  }[];
}) {
  const { isMobile } = useSidebar();
  const { currentPlan, isLoading } = usePlan();
  const [isManageClicked, setIsManageClicked] = React.useState(false);

  const plans = items
    .filter((item) => item.title !== "")
    .map((item) => ({
      name: item.title,
      icon: item.icon,
      description: "Subscription plan",
    }));

  const activePlan = plans.find((plan) => plan.name === currentPlan) || {
    name: "Choose a plan",
    icon: Sparkles,
    description: "No subscription",
  };

  const planColors: Record<PlanType | "Choose a plan", string> = {
    Free: "text-gray-300",
    Elite: "text-gray-300",
    Business: "text-gray-300",
    "": "text-gray-300",
    "Choose a plan": "text-gray-300",
  };

  if (isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-opacity-20 bg-gray-700-600 backdrop-blur-md border shadow-lg">
              <Sparkles className="size-4 text-gray-300" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold text-md text-gray-300">
                Loading...
              </span>
              <span className="truncate text-xs text-gray-400">
                Subscription plan
              </span>
            </div>
            <EllipsisVertical className="ml-auto" />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
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
                <span
                  className={`truncate font-semibold text-md ${
                    planColors[activePlan.name]
                  }`}
                >
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
  );
}
