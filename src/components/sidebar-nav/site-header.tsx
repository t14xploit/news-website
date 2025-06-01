"use client";

import { usePathname } from "next/navigation";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button, buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { ModeToggle } from "../theme/mode-toggle";
import { authClient } from "@/lib/auth-client";
import SignOutButton from "../auth/sign-out-button";
import { usePlan } from "@/components/subscribe/plan-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SiteHeader() {
  const { data: session } = authClient.useSession();
  const pathname = usePathname();
  const { userData, isLoading: planLoading } = usePlan();
  const router = useRouter();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const name = userData.name || "";
  const email = userData.email || "";
  const avatar = userData.avatar || "/alien/alien_1.jpg";
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "ON";

  const breadcrumbRoutes = ["/dashboard", "/"];

  const getBreadcrumbs = () => {
    if (!breadcrumbRoutes.some((route) => pathname.startsWith(route))) {
      return null;
    }

    const pathParts = pathname.split("/").filter((part) => part);
    const breadcrumbs = [];

    breadcrumbs.push({
      label: "Home",
      href: "/",
      isCurrent: pathname === "/",
    });

    let currentPath = "";
    pathParts.forEach((part) => {
      currentPath += `/${part}`;
      const label = part
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      breadcrumbs.push({
        label,
        href: currentPath,
        isCurrent: currentPath === pathname,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  if (!isMounted) {
    return (
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 px-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          {breadcrumbs && (
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((crumb, index) => (
                  <div key={crumb.href} className="flex items-center">
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                    </BreadcrumbItem>
                    {index < breadcrumbs.length - 1 && (
                      <BreadcrumbSeparator className="hidden md:block" />
                    )}
                  </div>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          )}
        </div>
        <div className="ml-auto flex items-center gap-4">
          <Button variant="ghost" disabled>
            Loading...
          </Button>
          <ModeToggle />
          <Button variant="secondary" size="icon" disabled>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="rounded-full">...</AvatarFallback>
            </Avatar>
          </Button>
        </div>
      </header>
    );
  }

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        {breadcrumbs && (
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((crumb, index) => (
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
                  {index < breadcrumbs.length - 1 && (
                    <BreadcrumbSeparator className="hidden md:block" />
                  )}
                </div>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        )}
      </div>

      <div className="ml-auto flex items-center gap-4">
        {session?.user ? (
          <SignOutButton>Sign Out</SignOutButton>
        ) : (
          <Link
            href="/sign-in"
            className={buttonVariants({ variant: "secondary" })}
          >
            Sign In
          </Link>
        )}

        <ModeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                {planLoading ? (
                  <AvatarFallback className="rounded-full">...</AvatarFallback>
                ) : (
                  <>
                    <AvatarImage src={avatar} alt={name} />
                    <AvatarFallback className="rounded-full">
                      {initials}
                    </AvatarFallback>
                  </>
                )}
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={avatar} alt={name} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{name}</span>
                  <span className="truncate text-xs">{email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/my-page")}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/my-page")}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <SignOutButton>Logout</SignOutButton>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
