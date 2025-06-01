//WE DON'T USE THIS SIDEBAR ANYMORE,
// WE USE SRC/COMPONENTS/SIDEBAR-NAV/APP-SIDEBAR.TSX

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  UsersIcon,
  LayoutGrid,
  BriefcaseIcon,
  UserIcon,
  FolderOpenIcon,
  CpuIcon,
} from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname() || "";
  const isActive = (prefix: string) => pathname.startsWith(prefix);

  return (
    <div className="h-full border-r bg-background">
      <div className="px-4 py-3 border-b">
        <h2 className="text-xl font-semibold">Admin</h2>
      </div>
      <div className="px-3 py-4">
        <div className="mb-2">
          <p className="text-sm text-muted-foreground font-medium mb-2">
            Management
          </p>
          <nav className="space-y-1">
            <Link
              href="/admin/users"
              className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-sm ${
                isActive("/admin/users")
                  ? "bg-secondary text-secondary-foreground"
                  : "hover:bg-secondary/50"
              }`}
            >
              <UsersIcon className="h-4 w-4" />
              <span>Users</span>
            </Link>

            <Link
              href="/admin/articles"
              className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-sm ${
                isActive("/admin/articles")
                  ? "bg-secondary text-secondary-foreground"
                  : "hover:bg-secondary/50"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
              <span>Articles</span>
            </Link>

            <Link
              href="/admin/categories"
              className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-sm ${
                isActive("/admin/categories")
                  ? "bg-secondary text-secondary-foreground"
                  : "hover:bg-secondary/50"
              }`}
            >
              <BriefcaseIcon className="h-4 w-4" />
              <span>Categories</span>
            </Link>

            <Link
              href="/admin/authors"
              className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-sm ${
                isActive("/admin/authors")
                  ? "bg-secondary text-secondary-foreground"
                  : "hover:bg-secondary/50"
              }`}
            >
              <UserIcon className="h-4 w-4" />
              <span>Authors</span>
            </Link>

            <Link
              href="/admin/ai"
              className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-sm ${
                isActive("/admin/ai")
                  ? "bg-secondary text-secondary-foreground"
                  : "hover:bg-secondary/50"
              }`}
            >
              <CpuIcon className="h-4 w-4" />
              <span>AI Generation</span>
            </Link>

            <Link
              href="/admin/channels"
              className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-sm ${
                isActive("/admin/channels")
                  ? "bg-secondary text-secondary-foreground"
                  : "hover:bg-secondary/50"
              }`}
            >
              <FolderOpenIcon className="h-4 w-4" />
              <span>Channels</span>
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}
