"use client"

import * as React from "react";
import {
  FileText,
  Home,
  Info,
  Menu,
  Newspaper,
  Radio,
  Sparkles,
  Users,
} from "lucide-react"
import { NavMain } from "./nav-main"
// import { NavProjects } from "./nav-projects"
import { NavUser } from "./nav-user"
// import { TeamSwitcher } from "./team-switcher"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"
import { NavSecondary } from "./nav-secondary"
// import { NavSubscriptions } from "./nav-subscriptions"
import { usePlan, PlanType } from "../subscribe/plan-context"
import { NavMainBottom } from "./nav-bottom"
import { PlanSwitcher } from "./plan-switcher"
interface AppSidebarProps {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  collapsible?: "none" | "icon" | "offcanvas";
}

export function AppSidebar({ 
  user,
  collapsible,
  ...props 
}: AppSidebarProps & 
React.ComponentProps<typeof Sidebar>) {
  const { currentPlan } = usePlan();
  console.log("AppSidebar rendered, collapsible:", collapsible, "user:", user);

  
  const data = {
    PlanSwitcher: [
        {
            title: "Free" as PlanType,
            url: "#",
            icon: Sparkles,
            isActive: currentPlan === "Free",
        },
        {
            title: "Elite" as PlanType,
            url: "#",
            icon: Sparkles,
            isActive: currentPlan === "Elite",
        },
        {
            title: "Business" as PlanType,
            url: "#",
            icon: Sparkles,
            isActive: currentPlan === "Business",
        },
    ],
    // teams: [
    //   {
    //     name: "Acme Inc",
    //     logo: GalleryVerticalEnd,
    //     plan: "Enterprise",
    //   },
    //   {
    //     name: "Acme Corp.",
    //     logo: AudioWaveform,
    //     plan: "Startup",
    //   },
    //   {
    //     name: "Evil Corp.",
    //     logo: Command,
    //     plan: "Free",
    //   },
    // ],
    NavSecondary: [
      {
        title: "Home",
        url: "/",
        icon: Home,
      },
      {
        title: "Articles",
        url: "/articles",
        icon: Newspaper,
      },
      {
        title: "Authors",
        url: "/authors",
        icon: Users,
      },
       {
        title: "Live",
        url: "#",
        icon: Radio,
      },
    ],
    navMain: [
      {
        title: "Explore",
        url: "#",
        icon: Menu, //Eye,
        isActive: true,
        items: [
          {
            title: "Local",
            url: "/categories/local",
          },
          {
            title: "Sweden",
            url: "/categories/sweden",
          },
          {
            title: "World",
            url: "/categories/world",
          },
          {
            title: "Economy",
            url: "categories/economy",
          },
          {
            title: "Sports",
            url: "categories/sports",
          },
          {
            title: "Business",
            url: "cqategories/business",
          },
        ],
      },
    ],
    // NavSubscriptions: [
    //   {
    //     title: "Subscription",
    //     url: "app/subscribe",
    //     icon: CreditCard,
    //     isActive: false,
    //     items: [
    //     //   {
    //     //     title: `Manage plan: ${currentPlan}`,
    //     //     url: "#",
    //     //     isActive: false,
    //     //   },
    //       {
    //         title: "Basic",
    //         url: "#",
    //         isActive: currentPlan === "Basic",
    //       },
    //       {
    //         title: "Premium",
    //         url: "#",
    //         isActive: currentPlan === "Premium",
    //       },
    //       {
    //         title: "Pro",
    //         url: "#",
    //         isActive: currentPlan === "Pro",
    //       },
    //     ],
    //   },
    // ],
     navMainBottom: [
      {
        title: "Info",
        url: "#",
        icon: Info,
        isActive: true,
        items: [
          {
            title: "About Us",
            url: "/about",
          },
          {
            title: "Contact Us",
            url: "/contact",
          },
        ],
        },
        {
            title: "Legal",
            url: "#",
            icon: FileText,    //Waypoints, //ShieldHalf
            isActive: true,
            items: [
              {
                title: "Privacy Policy",
                url: "#",
              },
              {
                title: "Terms of Use",
                url: "#",
              },
            ],
            },
    ],
    
    // projects: [
    //   {
    //     name: "Design Engineering",
    //     url: "#",
    //     icon: Frame,
    //   },
    //   {
    //     name: "Sales & Marketing",
    //     url: "#",
    //     icon: PieChart,
    //   },
    //   {
    //     name: "Travel",
    //     url: "#",
    //     icon: Map,
    //   },
    // ],
  }

  return (
    <Sidebar
      collapsible={collapsible}
      className="md:block"
      {...props}
    >
      <SidebarHeader>
         <NavUser user={user} />
      </SidebarHeader>
      <SidebarContent>
        <NavSecondary items={data.NavSecondary} />
        <NavMain items={data.navMain} />
        {/* <NavSubscriptions items={data.NavSubscriptions} currentPlan={currentPlan} setCurrentPlan={setCurrentPlan} /> */}
        <NavMainBottom items={data.navMainBottom} 
        className="mt-auto"
        />
      </SidebarContent>
      <SidebarFooter>
      <PlanSwitcher
          items={data.PlanSwitcher}
          // currentPlan={currentPlan}
          // setCurrentPlan={setCurrentPlan}
        />
        {/* <TeamSwitcher teams={data.teams} /> */}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}