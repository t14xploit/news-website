"use client";

import { Icon } from "@tabler/icons-react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";

interface NavMainProps {
  items: {
    title: string;
    url?: string;
    icon?: Icon;
    adminOnly?: boolean;
    isCollapsible?: boolean;
    items?: { title: string; url: string; icon?: Icon }[];
  }[];
}

interface CollapsibleItemProps {
  item: {
    title: string;
    icon?: Icon;
    isCollapsible?: boolean;
    items?: { title: string; url: string; icon?: Icon }[];
  };
}

function CollapsibleItem({ item }: CollapsibleItemProps) {
  const [open, setOpen] = useState(true);
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <SidebarMenuButton className="flex items-center">
          {open ? (
            <IconChevronUp className="size-4 mr-2" />
          ) : (
            <IconChevronDown className="size-4 mr-2" />
          )}
          {item.icon && <item.icon className="size-4 mr-2" />}
          <span>{item.title}</span>
        </SidebarMenuButton>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <SidebarMenuSub>
          {item.items?.map((subItem, subIndex) => (
            <SidebarMenuSubItem key={subIndex}>
              <SidebarMenuSubButton asChild>
                <Link href={subItem.url} className="flex items-center">
                  {subItem.icon && <subItem.icon className="size-4 mr-2" />}
                  {subItem.title}
                </Link>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          ))}
        </SidebarMenuSub>
      </CollapsibleContent>
    </Collapsible>
  );
}

export function NavMain({ items }: NavMainProps) {
  return (
    <SidebarMenu>
      {items.map((item, index) => (
        <SidebarMenuItem key={index}>
          {item.isCollapsible ? (
            <CollapsibleItem item={item} />
          ) : (
            <SidebarMenuButton asChild>
              <Link href={item.url!}>
                {item.icon && <item.icon className="size-4 mr-2" />}
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          )}
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}