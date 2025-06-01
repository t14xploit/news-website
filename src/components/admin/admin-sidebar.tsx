"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  UsersIcon,
  LayoutGrid,
  BriefcaseIcon,
  UserIcon,
  FolderOpenIcon,
  CpuIcon,
} from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname() || "";

  const isActive = (prefix: string) => pathname.startsWith(prefix);

  return (
    <Sidebar className="w-64 bg-surface border-r">
      {/* Sidebar Header */}
      <SidebarHeader className="px-4 py-3 border-b">
        <h2 className="text-xl font-semibold">Admin</h2>
      </SidebarHeader>

      {/* Sidebar Content */}
      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarMenu>
            {/* Users */}
            <SidebarMenuItem>
              <Link href="/admin/users" passHref>
                <SidebarMenuButton asChild isActive={isActive("/admin/users")}>
                  <div className="flex items-center gap-2 px-2 py-1 rounded hover:bg-muted">
                    <UsersIcon className="h-5 w-5" />
                    <span>Users</span>
                  </div>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>

            {/* Articles */}
            <SidebarMenuItem>
              <Link href="/admin/articles" passHref>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/admin/articles")}
                >
                  <a className="flex items-center gap-2 px-2 py-1 rounded hover:bg-muted">
                    <LayoutGrid className="h-5 w-5" />
                    <span>Articles</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>

            {/* Categories */}
            <SidebarMenuItem>
              <Link href="/admin/categories" passHref>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/admin/categories")}
                >
                  <a className="flex items-center gap-2 px-2 py-1 rounded hover:bg-muted">
                    <BriefcaseIcon className="h-5 w-5" />
                    <span>Categories</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>

            {/* Authors */}
            <SidebarMenuItem>
              <Link href="/admin/authors" passHref>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/admin/authors")}
                >
                  <a className="flex items-center gap-2 px-2 py-1 rounded hover:bg-muted">
                    <UserIcon className="h-5 w-5" />
                    <span>Authors</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>

            {/* AI */}
            <SidebarMenuItem>
              <Link href="/admin/ai" passHref>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/admin/authors")}
                >
                  <a className="flex items-center gap-2 px-2 py-1 rounded hover:bg-muted">
                    <CpuIcon className="h-5 w-5" />
                    <span>AI Generation</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>

            {/* Channels (optional placeholder) */}
            <SidebarMenuItem>
              <Link href="/admin/channels" passHref>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/admin/channels")}
                >
                  <a className="flex items-center gap-2 px-2 py-1 rounded hover:bg-muted">
                    <FolderOpenIcon className="h-5 w-5" />
                    <span>Channels</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
