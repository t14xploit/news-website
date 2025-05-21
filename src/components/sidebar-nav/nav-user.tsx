"use client"

import { BadgeCheck, Bell, EllipsisVertical, CreditCard, LogOut, Sparkles } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import SignOutButton from "@/components/auth/sign-out-button"
import toast from "react-hot-toast"

interface NavUserProps {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}

export function NavUser({
  user,
}: NavUserProps ){
  const { isMobile } = useSidebar()
  const [loadedUser, setLoadedUser] = useState(user);
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();
  const initials = user.name
  ? user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    : "ON";

// useEffect(() => {
//   async function fetchUser() {
//     try {
//       const response = await fetch("/api/user");
//       if (!response.ok) throw new Error("Failed to fetch user");
//       const data = await response.json();
//       setLoadedUser({
//         name: data.name || "",
//         email: data.email || "",
//         avatar: data.avatar || "/alien/alien_1.jpg",
//       });
//     } catch (error) {
//       console.error("Fetch user error:", error);
//       toast.error("Failed to load user data");
//       setLoadedUser(user);
//     } finally {
//       setIsLoaded(true);
//     }
//   }
//   fetchUser();
// }, [user]);

const displayUser = isLoaded ? loadedUser : user;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              aria-label={`User profile: ${displayUser.name} (${displayUser.email})`}
           >
              <Avatar className="h-8 w-8 rounded-lg">
                {displayUser.avatar && <AvatarImage src={displayUser.avatar} alt={displayUser.name} />}
                <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{displayUser.name}</span>
                <span className="truncate text-xs">{displayUser.email}</span>
              </div>
              <EllipsisVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={displayUser.avatar} alt={displayUser.name} />
                  <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{displayUser.name}</span>
                  <span className="truncate text-xs">{displayUser.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => router.push("/subscribe")}
                className="gap-2"
              >
                <Sparkles />
                Upgrade plan
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem 
                onClick={() => router.push("/account")} 
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
                  router.push("/sign-in")
                }}
              >
               <LogOut className="size-5" />
                Log out
              </SignOutButton>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
