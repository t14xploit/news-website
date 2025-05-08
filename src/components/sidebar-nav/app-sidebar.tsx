"use client"

import type * as React from "react"
import {
  AudioWaveform,
  Command,
  CreditCard,
  Eye,
  Flame,
  GalleryVerticalEnd,
  Home,
  Info,
  Star,
  Waypoints,
} from "lucide-react"
import { NavMain } from "./nav-main"
// import { NavProjects } from "./nav-projects"
import { NavUser } from "./nav-user"
import { TeamSwitcher } from "./team-switcher"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"
import { NavSecondary } from "./nav-secondary"
import { NavSubscriptions } from "./nav-subscriptions"
import { usePlan } from "../subscribe/plan-context"
import { NavMainBottom } from "./nav-bottom"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { currentPlan, setCurrentPlan } = usePlan()

  const data = {
    user: {
      name: "Alien",
      email: "ninja@ufo.io",
      avatar: "/avatars/user.png",
    },
    teams: [
      {
        name: "Acme Inc",
        logo: GalleryVerticalEnd,
        plan: "Enterprise",
      },
      {
        name: "Acme Corp.",
        logo: AudioWaveform,
        plan: "Startup",
      },
      {
        name: "Evil Corp.",
        logo: Command,
        plan: "Free",
      },
    ],
    NavSecondary: [
      {
        title: "Home",
        url: "/",
        icon: Home,
      },
      {
        title: "Latest News",
        url: "#",
        icon: Flame,
      },
      {
        title: "Editor's Choice",
        url: "#",
        icon: Star,
      },
    ],
    navMain: [
      {
        title: "Explore",
        url: "#",
        icon: Eye,
        isActive: true,
        items: [
          {
            title: "Local",
            url: "#",
          },
          {
            title: "Sweden",
            url: "#",
          },
          {
            title: "World",
            url: "#",
          },
          {
            title: "Economy",
            url: "#",
          },
          {
            title: "Sports",
            url: "#",
          },
          {
            title: "Business",
            url: "#",
          },
        ],
      },
    ],
    NavSubscriptions: [
      {
        title: "Subscription",
        url: "app/subscribe",
        icon: CreditCard,
        isActive: false,
        items: [
        //   {
        //     title: `Manage plan: ${currentPlan}`,
        //     url: "#",
        //     isActive: false,
        //   },
          {
            title: "Basic",
            url: "#",
            isActive: currentPlan === "Basic",
          },
          {
            title: "Premium",
            url: "#",
            isActive: currentPlan === "Premium",
          },
          {
            title: "Pro",
            url: "#",
            isActive: currentPlan === "Pro",
          },
        ],
      },
    ],
     navMainBottom: [
      {
        title: "Info",
        url: "#",
        icon: Info,
        isActive: true,
        items: [
          {
            title: "About Us",
            url: "app/about",
          },
          {
            title: "Contact Us",
            url: "app/contact",
          },
        ],
        },
        {
            title: "Legal",
            url: "#",
            icon: Waypoints, //ShieldHalf
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
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavSecondary items={data.NavSecondary} />
        <NavMain items={data.navMain} />
        <NavSubscriptions items={data.NavSubscriptions} currentPlan={currentPlan} setCurrentPlan={setCurrentPlan} />
        <NavMainBottom items={data.navMainBottom} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}