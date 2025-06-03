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
  BookOpen,
  LucideIcon,
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
  myChannelSection: SidebarItem;
}

interface EliteData {
  NavSecondary: SidebarItem[];
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
  const adminData: AdminData = {
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

  // Business subscription
  const businessData: BusinessData = {
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
    myChannelSection: {
      title: "My Channel",
      url: "#",
      icon: BookOpen,
      isActive: true,
      items: [
        {
          title: "Dashboard",
          url: "/my-channel",
        },
        {
          title: "Create Article",
          url: "/my-channel/create",
        },
        {
          title: "Invite Members",
          url: "/my-channel/invite",
        },
        {
          title: "Settings",
          url: "/my-channel/settings",
        },
      ],
    },
  };

  // Elite subscription
  const eliteData: EliteData = {
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
      {
        title: "My Channel",
        url: "/my-channel",
        icon: BookOpen,
      },
    ],
  };

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

  let sidebarData: AdminData | BusinessData | EliteData | UserData;
  if (sessionUser?.role === "admin") {
    sidebarData = adminData;
  } else if (
    sessionUser?.subscription?.type?.name === "Business" ||
    sessionUser?.role === "editor"
  ) {
    sidebarData = businessData;
  } else if (sessionUser?.subscription?.type?.name === "Elite") {
    sidebarData = eliteData;
  } else {
    sidebarData = userData;
  }

  return (
    <Sidebar collapsible={collapsible} className="md:block" {...props}>
      <SidebarHeader>
        {/* <NavUser user={user} collapsible={undefined} /> */}
        <div className="p-4 flex items-center">
          <h1 className="text-2xl font-semibold transition-all duration-200 group-data-[collapsible=icon]/sidebar-wrapper:text-lg group-data-[collapsible=icon]/sidebar-wrapper:text-center group-data-[collapsible=icon]/sidebar-wrapper:overflow-hidden">
            OpenNews
          </h1>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <NavSecondary items={sidebarData.NavSecondary} />

        {sidebarData === businessData && (
          <NavMain items={[businessData.myChannelSection]} />
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
