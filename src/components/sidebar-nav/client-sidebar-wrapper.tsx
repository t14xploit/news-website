"use client";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar-nav/app-sidebar";
import { useEffect, useState } from "react";

interface SidebarStyle extends React.CSSProperties {
  "--sidebar-width"?: string;
  "--sidebar-width-icon"?: string;
  "--header-height"?: string;
}

interface ClientSidebarWrapperProps {
  children: React.ReactNode;
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}

export function ClientSidebarWrapper({ children, user }: ClientSidebarWrapperProps) {
  const [sidebarState, setSidebarState] = useState<{
    collapsible: "none" | "icon" | "offcanvas" | undefined;
    variant: string;
  }>({
    collapsible: "icon",
    variant: "sidebar",
  });

  useEffect(() => {
    const savedState = localStorage.getItem("sidebar-state");
    if (savedState) {
      const validStates: Array<"none" | "icon" | "offcanvas"> = ["none", "icon", "offcanvas"];
      if (validStates.includes(savedState as "none" | "icon" | "offcanvas")) {
        setSidebarState({ collapsible: savedState as "none" | "icon" | "offcanvas", variant: "sidebar" });
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
      <AppSidebar collapsible={sidebarState.collapsible} user={user} />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}