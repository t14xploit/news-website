"use client";

import * as React from "react";
import { Sparkles } from "lucide-react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { usePlan } from "@/components/subscribe/plan-context";
import Link from "next/link";

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
  // const { isMobile } = useSidebar();
  const { currentPlan, isLoading } = usePlan();
  // const [isManageClicked, setIsManageClicked] = React.useState(false);

  const plans = items
    .filter((item) => item.title !== "")
    .map((item) => ({
      name: item.title,
      icon: item.icon,
      description: "Subscription plan",
    }));

  const activePlan = plans.find((plan) => plan.name === currentPlan) || {
    name: "View plans",
    icon: Sparkles,
    description: "Discover a lot of new things",
  };
  console.log("Active plan in PlanSwitcher:", activePlan.name, "currentPlan:", currentPlan);
  
  const planColors: Record<PlanType | "View plans", string> = {
    Free: "text-gray-100",
    Elite: "text-gray-100",
    Business: "text-gray-100",
    "": "text-gray-300",
    "View plans": "text-gray-100",
  };

  if (isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg  backdrop-blur-md  border">
              <Sparkles className="" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold text-md">
                Loading...
              </span>
              <span className="truncate text-xs block">
                Subscription plan
              </span>
            </div>
            {/* <EllipsisVertical className="ml-auto" /> */}
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Link href="/subscribe">
        {/* <DropdownMenu> */}
          {/* <DropdownMenuTrigger asChild> */}
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground w-full"
              aria-label={`Go to subscription page, current plan: ${activePlan.name}`}            
            >
              <div className="flex aspect-square size-10 items-center justify-center rounded-lg backdrop-blur-md border">
                {React.createElement(activePlan.icon, { className: "size-5" })}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight ">
                <span
                  className={`truncate font-semibold text-md ${
                    planColors[activePlan.name]
                  }`}
                >
                  {activePlan.name}
                </span>
                <span className="truncate text-xs block text-gray-400">
                  {activePlan.description}
                </span>
              </div>
              {/* <EllipsisVertical className="ml-auto" /> */}
            </SidebarMenuButton>
          </Link>
          {/* </DropdownMenuTrigger> */}
          {/* <DropdownMenuContent
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
              </div> */}
            {/* </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
