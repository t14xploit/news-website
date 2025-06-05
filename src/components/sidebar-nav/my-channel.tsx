"use client";

import { ChevronRight, FolderOpen } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

export function MyChannel() {
  const myChannelSection = {
    title: "My Channel",
    url: "#",
    icon: FolderOpen,
    isActive: true,
    items: [
      {
        title: "Create Article",
        url: "/my-channel/create",
      },
      {
        title: "Invite Members",
        url: "/my-channel/invite",
      },
    ],
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Management</SidebarGroupLabel>
      <SidebarMenu>
        <Collapsible
          key={myChannelSection.title}
          asChild
          defaultOpen={myChannelSection.isActive}
          className="group/collapsible"
        >
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton tooltip={myChannelSection.title}>
                {myChannelSection.icon && (
                  <myChannelSection.icon className="h-5 w-5 text-chart-5" />
                )}
                <span>{myChannelSection.title}</span>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {myChannelSection.items?.map((subItem) => (
                  <SidebarMenuSubItem key={subItem.title}>
                    <SidebarMenuSubButton asChild>
                      <a href={subItem.url}>
                        <span>{subItem.title}</span>
                      </a>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
  );
}
