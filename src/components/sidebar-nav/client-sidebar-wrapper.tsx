"use client";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar-nav/app-sidebar";
import React, { useEffect, useState } from "react";
import { useUser } from "@/lib/context/user-context";
import { usePathname } from "next/navigation";

interface SidebarStyle extends React.CSSProperties {
  "--sidebar-width"?: string;
  "--sidebar-width-icon"?: string;
  "--header-height"?: string;
}

interface ClientSidebarWrapperProps {
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    role: string;
    subscriptionId: string | null;
  };
  children: React.ReactNode;
}

export function ClientSidebarWrapper({
  children,
  user,
}: ClientSidebarWrapperProps) {
  const { sessionUser } = useUser();
  const hideSidebarRoutes = ["/sign-in", "/sign-up", "/sign-out"];
  const pathname = usePathname();
  const [sidebarState, setSidebarState] = useState<{
    collapsible: "none" | "icon" | "offcanvas" | undefined;
    variant: string;
  }>({
    collapsible: "icon",
    variant: "sidebar",
  });

  // const { data: session } = authClient.useSession();

  // interface BetterAuthUser {
  //   id: string;
  //   email: string;
  //   role: string;
  //   subscriptionId?: string | null;
  //   name?: string | null;
  //   avatar?: string | null;
  // }

  // const effectiveUser = session?.user
  //   ? (() => {
  //       const su = session.user as BetterAuthUser;
  //       return {
  //         name: su.name ?? user.name,
  //         email: su.email ?? user.email,
  //         avatar: su.avatar ?? user.avatar,
  //         role: su.role ?? user.role,
  //       };
  //     })()
  //   : {
  //       name: user.name,
  //       email: user.email,
  //       avatar: user.avatar,
  //       role: user.role,
  //     };

  const shouldHideSidebar = hideSidebarRoutes.includes(pathname);

  const displayUser = sessionUser
    ? {
        name: sessionUser.name || user.name,
        email: sessionUser.email || user.email,
        avatar: sessionUser.avatar || user.avatar,
        role: sessionUser.role || user.role,
      }
    : {
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      };

  useEffect(() => {
    const savedState = localStorage.getItem("sidebar-state");
    if (savedState) {
      const validStates: Array<"none" | "icon" | "offcanvas"> = [
        "none",
        "icon",
        "offcanvas",
      ];
      if (validStates.includes(savedState as "none" | "icon" | "offcanvas")) {
        setSidebarState({
          collapsible: savedState as "none" | "icon" | "offcanvas",
          variant: "sidebar",
        });
      }
    }
  }, []);

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
      <>
      {!shouldHideSidebar && (
        <AppSidebar
        collapsible={sidebarState.collapsible}
        user={displayUser}
        />
      )}
        <SidebarInset>{children}</SidebarInset>
        </>
    </SidebarProvider>
  );
}
