// "use client";

// import { BadgeCheck, Bell, CreditCard, LogOut, Sparkles } from "lucide-react";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   useSidebar,
// } from "@/components/ui/sidebar";
// import { useRouter } from "next/navigation";
// import SignOutButton from "@/components/auth/sign-out-button";
// import { usePlan } from "@/components/subscribe/plan-context";
// import { useUser } from "@/lib/context/user-context";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Badge } from "@/components/ui/badge";

// interface NavUserProps {
//   user: {
//     name: string;
//     email?: string;
//     avatar: string;
//   };
//   collapsible: "none" | "icon" | "offcanvas" | undefined;
// }

// export function NavUser({ user }: NavUserProps) {
//   const { isMobile } = useSidebar();
//   const router = useRouter();
//   const { sessionUser, isLoading: userLoading } = useUser();
//   const { currentPlan, isLoading: planLoading } = usePlan();

//   if (userLoading || planLoading) {
//     return (
//       <SidebarMenu>
//         <SidebarMenuItem>
//           <SidebarMenuButton size="lg" disabled>
//             <Avatar className="h-8 w-8 rounded-lg">
//               <AvatarFallback className="rounded-lg">
//                 <Skeleton className="h-8 w-8" />
//               </AvatarFallback>
//             </Avatar>
//             <div className="ml-2 grid flex-1 text-left text-sm leading-tight">
//               <Skeleton className="h-4 w-24 mb-1" />
//               <Skeleton className="h-3 w-20" />
//             </div>
//           </SidebarMenuButton>
//         </SidebarMenuItem>
//       </SidebarMenu>
//     );
//   }

//   if (!sessionUser) {
//     return null;
//   }

//   const displayName = sessionUser.name || user.name || "";
//   const displayEmail = sessionUser.email || user.email || "";
//   const displayAvatar =
//     sessionUser.avatar || user.avatar || "/alien/alien_1.jpg";
//   const initials = displayName
//     .split(" ")
//     .map((word) => word.charAt(0))
//     .join("")
//     .toUpperCase();

//   return (
//     <SidebarMenu>
//       <SidebarMenuItem>
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <SidebarMenuButton
//               size="lg"
//               className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
//               aria-label={`User profile: ${displayName} (${displayEmail})`}
//             >
//               <div className="flex w-full items-center justify-between">
//                 <div className="grid flex-1 text-left text-sm leading-tight">
//                   <span className="truncate font-semibold">{displayName}</span>
//                   <span className="truncate text-xs">{displayEmail}</span>
//                 </div>
//                 <Avatar className="h-8 w-8 rounded-lg ml-2">
//                   <AvatarImage src={displayAvatar} alt={displayName} />
//                   <AvatarFallback className="rounded-lg">
//                     {initials}
//                   </AvatarFallback>
//                 </Avatar>
//               </div>
//             </SidebarMenuButton>
//           </DropdownMenuTrigger>

//           <DropdownMenuContent
//             className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
//             side={isMobile ? "bottom" : "right"}
//             align="end"
//             sideOffset={4}
//           >
//             <DropdownMenuLabel className="p-0 font-normal">
//               <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
//                 <div className="grid flex-1 text-left text-sm leading-tight">
//                   <span className="truncate font-semibold">{displayName}</span>
//                   <span className="truncate text-xs">{displayEmail}</span>
//                 </div>
//                 <Avatar className="h-8 w-8 rounded-lg">
//                   <AvatarImage src={displayAvatar} alt={displayName} />
//                   <AvatarFallback className="rounded-lg">
//                     {initials}
//                   </AvatarFallback>
//                 </Avatar>
//               </div>
//             </DropdownMenuLabel>

//             <DropdownMenuSeparator />

//             <div className="px-3 py-2 flex items-center gap-2">
//               <span className="text-xs font-medium text-muted-foreground">
//                 Plan:
//               </span>
//               <Badge
//                 variant={
//                   currentPlan === "Business"
//                     ? "destructive"
//                     : currentPlan === "Elite"
//                     ? "secondary"
//                     : "outline"
//                 }
//                 className="text-xs"
//               >
//                 {currentPlan || "Free"}
//               </Badge>
//             </div>

//             <DropdownMenuSeparator />

//             <DropdownMenuGroup>
//               <DropdownMenuItem
//                 onClick={() => router.push("/subscribe")}
//                 className="gap-2"
//               >
//                 <Sparkles className="h-4 w-4" />
//                 Upgrade plan
//               </DropdownMenuItem>
//             </DropdownMenuGroup>

//             <DropdownMenuSeparator />

//             <DropdownMenuGroup>
//               <DropdownMenuItem
//                 onClick={() => router.push("/my-page")}
//                 className="gap-2"
//               >
//                 <BadgeCheck className="h-4 w-4" />
//                 My Account
//               </DropdownMenuItem>
//               <DropdownMenuItem
//                 onClick={() => router.push("/card-details")}
//                 className="gap-2"
//               >
//                 <CreditCard className="h-4 w-4" />
//                 Card Details
//               </DropdownMenuItem>
//               <DropdownMenuItem
//                 onClick={() => router.push("/notifications")}
//                 className="gap-2"
//               >
//                 <Bell className="h-4 w-4" />
//                 Notifications
//               </DropdownMenuItem>
//             </DropdownMenuGroup>

//             <DropdownMenuSeparator />

//             <DropdownMenuItem asChild className="gap-2">
//               <SignOutButton
//                 onSignOutSuccess={() => {
//                   router.push("/sign-int");
//                 }}
//               >
//                 <LogOut className="h-4 w-4" />
//                 Log Out
//               </SignOutButton>
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </SidebarMenuItem>
//     </SidebarMenu>
//   );
// }
