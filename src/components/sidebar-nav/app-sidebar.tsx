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
  LucideIcon,
  FolderOpen,
  Globe,
  // MessageSquare,
} from "lucide-react";
import { NavMain } from "./nav-main";
// import { NavUser } from "./nav-user";
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
import { OpenChannelElite } from "./open-channel-elite";
import { ManagementMyChannel } from "./management-my-channel";

// import { OpenChannel } from "./open-channel"
// import { MyChannel } from "./my-channel"

interface AppSidebarProps {
  user: {
    name: string;
    email: string;
    avatar: string;
    role?: string;
  };
  collapsible?: "none" | "icon" | "offcanvas";
}
interface SidebarItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: Array<{ title: string; url: string }>;
}

interface AdminData {
  NavSecondary: SidebarItem[];
}

interface BusinessData {
  NavSecondary: SidebarItem[];
  OpenChannelElite: SidebarItem[];
  ManagementMyChannel: SidebarItem[];
}

interface EliteData {
  NavSecondary: SidebarItem[];
  OpenChannelElite: SidebarItem[];
}

interface UserData {
  PlanSwitcher: Array<{
    title: PlanType;
    url: string;
    icon: LucideIcon;
    isActive: boolean;
  }>;
  NavSecondary: SidebarItem[];
  navMain: SidebarItem[];
  navMainBottom: SidebarItem[];
}

export function AppSidebar({
  user,
  collapsible,
  ...props
}: AppSidebarProps & React.ComponentProps<typeof Sidebar>) {
  const { currentPlan, isLoading: planLoading } = usePlan();
  const { sessionUser, isLoading: userLoading } = useUser();

  console.log(
    "AppSidebar rendered, collapsible:",
    collapsible,
    "user:",
    user,
    "contextUser:",
    sessionUser
  );

  if (userLoading || planLoading) {
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

  const userData: UserData = {
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
            url: "/about-us",
          },
          {
            title: "Contact Us",
            url: "/contact-us",
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
            url: "/privacy-policy",
          },
          {
            title: "Terms of Use",
            url: "/terms-of-use",
          },
        ],
      },
    ],
  };

  const adminData: AdminData = {
    NavSecondary: [
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
  };

  // Elite subscription
  const eliteData: EliteData = {
    NavSecondary: userData.NavSecondary,
    OpenChannelElite: [
      {
        title: "Open Channel",
        url: "/open-channel",
        icon: Globe,
      },
    ],
  };

  // Business subscription
  const businessData: BusinessData = {
    NavSecondary: userData.NavSecondary,
    OpenChannelElite: [
      {
        title: "Open Channel",
        url: "/open-channel",
        icon: Globe,
      },
    ],
    ManagementMyChannel: [
      {
        title: "My Channel",
        url: "/my-channel",
        icon: FolderOpen,
        isActive: true,
        items: [
          {
            title: "Create Articles",
            url: "/my-channel/create",
          },
          {
            title: "Invite Members",
            url: "/my-channel/[id]/invite",
          },
        ],
      },
    ],
    // myChannelSection: {
    //   title: "My Channel",
    //   url: "#",
    //   icon: BookOpen,
    //   isActive: true,
    //   items: [
    //     {
    //       title: "Dashboard",
    //       url: "/my-channel",
    //     },
    //     {
    //       title: "Create Article",
    //       url: "/my-channel/create",
    //     },
    //     {
    //       title: "Invite Members",
    //       url: "/my-channel/invite",
    //     },
    //     {
    //       title: "Settings",
    //       url: "/my-channel/settings",
    //     },
    //   ],
    // },
  };

  let sidebarData: AdminData | BusinessData | EliteData | UserData;
  if (sessionUser?.role === "admin") {
    sidebarData = adminData;
    console.log("sidebarData set to adminData");
  } else if (
    sessionUser?.subscriptionType === "Business" ||
    sessionUser?.role === "editor"
  ) {
    sidebarData = businessData;
    console.log("sidebarData set to businessData");
  } else if (sessionUser?.subscriptionType === "Elite") {
    sidebarData = eliteData;
    console.log("sidebarData set to eliteData");
  } else {
    sidebarData = userData;
    console.log("sidebarData set to userData");
  }
  console.log("Selected sidebarData:", sidebarData);

  return (
    <Sidebar collapsible={collapsible} className="md:block" {...props}>
      <SidebarHeader>
        <div className="p-4 flex items-center">
          <h1
            className="text-2xl font-semibold transition-all duration-200 overflow-hidden whitespace-nowrap text-ellipsis"
            data-collapsible-hide
          >
            OpenNews
          </h1>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <NavSecondary items={sidebarData.NavSecondary} />

        {"OpenChannelElite" in sidebarData && (
          <OpenChannelElite items={sidebarData.OpenChannelElite} />
        )}

        {"ManagementMyChannel" in sidebarData && (
          <ManagementMyChannel items={sidebarData.ManagementMyChannel} />
        )}

        {sessionUser?.role !== "admin" && <NavMain items={userData.navMain} />}
        {sessionUser?.role !== "admin" && (
          <NavMainBottom items={userData.navMainBottom} className="mt-auto" />
        )}
      </SidebarContent>

      {sessionUser?.role !== "admin" && (
        <SidebarFooter>
          <PlanSwitcher items={userData.PlanSwitcher} />
        </SidebarFooter>
      )}
      <SidebarRail />
    </Sidebar>
  );
}
