"use client";

import { useRouter } from "next/navigation";
import {
  BadgeCheck,
  CreditCard,
  LogOut,
  Sparkles,
  EllipsisVertical,
  Bell,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/components/ui/sidebar";
import SignOutButton from "@/components/auth/sign-out-button";
import { usePlan } from "@/components/subscribe/plan-context";

interface UserSidebarProps {
  collapsible: "none" | "icon" | "offcanvas" | undefined;
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function UserSidebar({ collapsible, user }: UserSidebarProps) {
  const router = useRouter();
  const { isMobile } = useSidebar();
  const { userData, isLoading } = usePlan();

  const name = userData.name || user.name || "";
  const email = userData.email || user.email || "";
  const avatar = userData.avatar || user.avatar || "/alien/alien_1.jpg";
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  if (isLoading) {
    return (
      <div className="h-full border-r bg-background">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarFallback>...</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">Loading...</p>
              <p className="text-xs text-muted-foreground">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="px-4 py-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 cursor-pointer hover:bg-secondary/50 px-2 py-1 rounded-md">
              <Avatar className="h-9 w-9">
                <AvatarImage src={avatar} alt={name} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium">{name || "Guest User"}</p>
                {email && (
                  <p className="text-xs text-muted-foreground">{email}</p>
                )}
              </div>
              <EllipsisVertical className="h-4 w-4" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={avatar} alt={name} />
                  <AvatarFallback className="rounded-lg">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{name}</span>
                  <span className="truncate text-xs">{email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => router.push("/subscribe")}
                className="gap-2"
              >
                <Sparkles className="size-5" />
                Upgrade plan
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => router.push("/my-page")}
                className="gap-2"
              >
                <BadgeCheck className="size-5" />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/card-details")}
                className="gap-2"
              >
                <CreditCard className="size-5" />
                Card details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/notifications")}
                className="gap-2"
              >
                <Bell className="size-5" />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="gap-2">
              <SignOutButton
                onSignOutSuccess={() => {
                  router.push("/sign-out");
                }}
              >
                <LogOut className="size-5" />
                Log out
              </SignOutButton>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
