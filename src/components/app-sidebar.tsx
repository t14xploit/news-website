// "use client";

// import * as React from "react";
// import {
//   IconMap,
//   IconFlag,
//   IconGlobe,
//   IconTrendingUp,
//   IconBallFootball,
//   IconBriefcase,
//   IconCreditCard,
//   IconInfoCircle,
//   IconMail,
//   IconLock,
//   IconFileText,
// } from "@tabler/icons-react";
// import { NavMain } from "@/components/nav-main";
// import { NavSecondary } from "@/components/nav-secondary";
// import { NavUser } from "@/components/nav-user";
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarHeader,
//   SidebarMenu,
//   SidebarMenuItem,
// } from "@/components/ui/sidebar";
// import { User } from "@/generated/prisma";

// import SearchForm from "@/components/SearchForm";

// // const DASHBOARD_TITLE = "Breaking News Only +";

// interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
//   user: User;
// }

// const data = {
//   navMain: [
//     {
//       title: "Explore",
//       isCollapsible: true,
//       items: [
//         { title: "Local", url: "/categories/local", icon: IconMap },
//         { title: "Sweden", url: "/categories/sweden", icon: IconFlag },
//         { title: "World", url: "/categories/world", icon: IconGlobe },
//         { title: "Economy", url: "/categories/economy", icon: IconTrendingUp },
//         { title: "Sports", url: "/categories/sports", icon: IconBallFootball },
//         {
//           title: "Business",
//           url: "/categories/business-economy",
//           icon: IconBriefcase,
//         },
//       ],
//     },
//     {
//       title: "Subscriptions",
//       isCollapsible: true,
//       items: [
//         { title: "Manage Plan", url: "/subscriptions", icon: IconCreditCard },
//       ],
//     },
//     {
//       title: "Info",
//       isCollapsible: true,
//       items: [
//         { title: "About Us", url: "/info/about", icon: IconInfoCircle },
//         { title: "Contact", url: "/info/contact", icon: IconMail },
//       ],
//     },
//     {
//       title: "Legal",
//       isCollapsible: true,
//       items: [
//         { title: "Privacy Policy", url: "/legal/privacy", icon: IconLock },
//         { title: "Terms of Use", url: "/legal/terms", icon: IconFileText },
//       ],
//     },
//   ],
//   navSecondary: [],
// };

// export function AppSidebar({ user, ...props }: AppSidebarProps) {
//   if (!user) {
//     throw new Error("AppSidebar requires a user but received undefined.");
//   }

//   return (
//     <Sidebar collapsible="offcanvas" className="w-64" {...props}>
//       <SidebarHeader className="border-b">
//         <SidebarMenu>
//           <SidebarMenuItem className="py-2">

//             <div className="relative">
//               <SearchForm />
//             </div>

//                 asChild
//                 className="data-[slot=sidebar-menu-button]:!p-1.5"
//               >
//                 <Link href="/admin/dashboard">
//                   <IconInnerShadowTop className="size-5 text-primary" />
//                   <span className="text-base font-semibold">
//                     {DASHBOARD_TITLE}
//                   </span>
//                 </Link>
//               </SidebarMenuButton> */}
//           </SidebarMenuItem>
//         </SidebarMenu>
//       </SidebarHeader>
//       <SidebarContent collapsible="offcanvas" className="w-64" {...props}>
//         <NavMain items={data.navMain} />
//         <NavSecondary items={data.navSecondary} className="mt-auto" />
//       </SidebarContent>
//       <SidebarFooter className="p-2 border-t">
//         <NavUser user={user} />
//       </SidebarFooter>
//     </Sidebar>
//   );
// }
