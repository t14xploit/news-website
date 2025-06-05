"use client";

import type * as React from "react";
import Link from "next/link";
import { Globe } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function OpenChannel() {
  const openChannelItem = {
    title: "Open Channel",
    url: "/open-channel",
    icon: Globe,
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Elite</SidebarGroupLabel>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem key={openChannelItem.title}>
            <SidebarMenuButton
              asChild
              tooltip={openChannelItem.title}
              className={openChannelItem.url === "#" ? "cursor-default" : ""}
            >
              {openChannelItem.url === "#" ? (
                <div className="flex items-center gap-2">
                  {openChannelItem.icon && (
                    <openChannelItem.icon className="h-5 w-5 text-chart-3" />
                  )}
                  <span>{openChannelItem.title}</span>
                </div>
              ) : (
                <Link
                  href={openChannelItem.url}
                  className="flex items-center gap-2"
                >
                  {openChannelItem.icon && (
                    <openChannelItem.icon className="h-5 w-5 text-chart-3" />
                  )}
                  <span>{openChannelItem.title}</span>
                </Link>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
