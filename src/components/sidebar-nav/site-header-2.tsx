"use client";

import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BadgeCheck,
  Bell,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Settings,
  Sparkles,
} from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button, buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ModeToggle } from "../theme/mode-toggle";
import SignOutButton from "../auth/sign-out-button";
import { usePlan } from "@/components/subscribe/plan-context";
import { useUser } from "@/lib/context/user-context";

export default function SiteHeader() {
  const { currentPlan, isLoading: planLoading } = usePlan();
  const { sessionUser, isLoading, isAdmin, isEditor } = useUser();
  const pathname = usePathname();
  const router = useRouter();

  if (isLoading || planLoading) {
    return (
      <header className="flex h-16 shrink-0 items-center gap-2 bg-background px-4 border-b border-border">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="h-4 mr-2" />
        <div className="flex-1">
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
      </header>
    );
  }

  if (!sessionUser) {
    return (
      <header className="flex h-16 shrink-0 items-center gap-2 bg-background px-4 border-b border-border">
        <SidebarTrigger className="-ml-1" />

        <div className="ml-auto flex items-center gap-4">
          <Link
            href="/sign-in"
            className={buttonVariants({ variant: "secondary" })}
          >
            Sign In
          </Link>
          <ModeToggle />
        </div>
      </header>
    );
  }

  const displayName = sessionUser.name || "Guest User";
  const displayEmail = sessionUser.email || "";
  const displayAvatar = sessionUser.avatar || "/alien/alien_1.jpg";

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const breadcrumbRoutes = [
    "/dashboard",
    "/my-page",
    "/subscribe",
    "/admin",
    "/authors",
  ];

  const getBreadcrumbs = () => {
    if (!breadcrumbRoutes.some((r) => pathname.startsWith(r))) return null;

    const parts = pathname.split("/").filter(Boolean);
    const crumbs = [];

    crumbs.push({
      label: "Home",
      href: "/",
      isCurrent: pathname === "/",
    });

    // let cur = "";
    // for (const part of parts) {
    //   cur += `/${part}`;
    //   const label = part
    //     .split("-")
    //     .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    //     .join(" ");

    //   crumbs.push({
    //     label,
    //     href: cur,
    //     isCurrent: cur === pathname,
    //   });
    // }
    let cur = "";
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      cur += `/${part}`;

      // Special case for author pages - get author name instead of ID
      if (part === "authors" && i < parts.length - 1 && parts[i + 1]) {
        const authorId = parts[i + 1];
        crumbs.push({
          label: "Authors",
          href: "/authors",
          isCurrent: false,
        });

        crumbs.push({
          label: "Author Profile", // This should be replaced with actual author name when available
          href: cur + `/${authorId}`,
          isCurrent: cur + `/${authorId}` === pathname,
        });
        break;
      } else {
        const label = part
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");

        crumbs.push({
          label,
          href: cur,
          isCurrent: cur === pathname,
        });
      }
    }

    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 bg-background px-4 border-b border-border">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="h-4 mr-2" />

        {breadcrumbs && (
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((crumb, idx) => (
                <div key={crumb.href} className="flex items-center">
                  <BreadcrumbItem className="hidden md:block">
                    {crumb.isCurrent ? (
                      <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link href={crumb.href}>{crumb.label}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {idx < breadcrumbs.length - 1 && (
                    <BreadcrumbSeparator className="hidden md:block" />
                  )}
                </div>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        )}
      </div>

      <div className="ml-auto flex items-center gap-4">
        {/* Welcome message */}
        <div className="hidden md:flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Hi,{" "}
            <span className="font-medium text-foreground">{displayName}</span>
          </span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={displayAvatar} alt={displayName} />
                <AvatarFallback className="rounded-full">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side="bottom"
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={displayAvatar} alt={displayName} />
                  <AvatarFallback className="rounded-lg">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{displayName}</span>
                  <span className="truncate text-xs">{displayEmail}</span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <div className="px-3 py-2 flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">
                Plan:
              </span>
              <Badge
                variant={
                  currentPlan === "Business"
                    ? "destructive"
                    : currentPlan === "Elite"
                    ? "secondary"
                    : "outline"
                }
                className="text-xs"
              >
                {currentPlan || "Free"}
              </Badge>
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => router.push("/subscribe")}
                className="gap-2"
              >
                <Sparkles className="h-4 w-4" />
                Upgrade plan
              </DropdownMenuItem>
            </DropdownMenuGroup>

            {/* Add admin and editor specific options */}
            {(isAdmin || isEditor) && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  {isAdmin && (
                    <DropdownMenuItem
                      onClick={() => router.push("/admin")}
                      className="gap-2"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Admin Dashboard</span>
                    </DropdownMenuItem>
                  )}
                  {isEditor && (
                    <DropdownMenuItem
                      onClick={() => router.push("/editor")}
                      className="gap-2"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Editor Tools</span>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuGroup>
              </>
            )}

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => router.push("/my-page")}
                className="gap-2"
              >
                <BadgeCheck className="h-4 w-4" />
                My Settings
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => router.push("/card-details")}
                className="gap-2"
              >
                <CreditCard className="h-4 w-4" />
                Card Details
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => router.push("/notifications")}
                className="gap-2"
              >
                <Bell className="h-4 w-4" />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <SignOutButton>
                <span className="flex items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  <span>Log Out</span>
                </span>
              </SignOutButton>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <ModeToggle />
      </div>
    </header>
  );
}
