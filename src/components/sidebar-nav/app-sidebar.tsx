"use client";

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
  CpuIcon,
  // LayoutGrid,
  BriefcaseIcon,
  UserIcon,
  FolderOpenIcon,
} from "lucide-react";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavSecondary } from "./nav-secondary";
import { usePlan, PlanType } from "../subscribe/plan-context";
import { NavMainBottom } from "./nav-bottom";
import { PlanSwitcher } from "./plan-switcher";
import { useUser } from "@/lib/context/user-context";
import { Skeleton } from "@/components/ui/skeleton";

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
}: AppSidebarProps & React.ComponentProps<typeof Sidebar>) {
  const { currentPlan } = usePlan();
  const { user: authUser, isLoading } = useUser();

  console.log("AppSidebar rendered, collapsible:", collapsible, "user:", user);

  if (isLoading) {
    return (
      <Sidebar collapsible={collapsible} className="md:block" {...props}>
        <SidebarHeader>
          <div className="p-4">
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-4 w-24" />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <div className="p-4 space-y-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    );
  }

  const adminData = {
    NavSecondary: [
      // {
      //   title: "Dashboard",
      //   url: "admin/admin-dashboard",
      //   icon: LayoutGrid,
      // },
      {
        title: "Users",
        url: "/admin/users",
        icon: Users,
      },
      {
        title: "Articles",
        url: "/admin/articles",
        icon: Newspaper,
      },
      {
        title: "Categories",
        url: "/admin/categories",
        icon: BriefcaseIcon,
      },
      {
        title: "Authors",
        url: "/admin/authors",
        icon: UserIcon,
      },
      {
        title: "AI Generation",
        url: "/admin/ai",
        icon: CpuIcon,
      },
      {
        title: "Channels",
        url: "/admin/channels",
        icon: FolderOpenIcon,
      },
    ],
    // navMainBottom: [
    //   {
    //     title: "Settings",
    //     url: "/admin/settings",
    //     icon: Info,
    //     isActive: true,
    //     items: [],
    //   },
    // ],
  };

  const userData = {
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
        icon: Menu,
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
            url: "categories/business",
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
        icon: FileText,
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
  };

  const data = authUser?.role === "admin" ? adminData : userData;

  return (
    <Sidebar collapsible={collapsible} className="md:block" {...props}>
      <SidebarHeader>
        <NavUser user={user} collapsible={undefined} />
      </SidebarHeader>
      <SidebarContent>
        <NavSecondary items={data.NavSecondary} />
        {authUser?.role !== "admin" && <NavMain items={userData.navMain} />}
        <NavMainBottom items={userData.navMainBottom} className="mt-auto" />
      </SidebarContent>
      {authUser?.role !== "admin" && (
        <SidebarFooter>
          <PlanSwitcher items={userData.PlanSwitcher} />
        </SidebarFooter>
      )}
      <SidebarRail />
    </Sidebar>
  );
}
