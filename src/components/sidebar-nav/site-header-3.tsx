// "use client";

// import { usePathname } from "next/navigation";
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb";
// import { Separator } from "@/components/ui/separator";
// import { SidebarTrigger } from "@/components/ui/sidebar";
// import { buttonVariants } from "@/components/ui/button";
// import Link from "next/link";
// import { ModeToggle } from "../theme/mode-toggle";
// import { usePlan } from "@/components/subscribe/plan-context";
// import { useUser } from "@/lib/context/user-context";
// import { NavUser } from "./nav-user"; // updated import
// import { Skeleton } from "@/components/ui/skeleton";

// export default function SiteHeader() {
//   const { sessionUser, isLoading: userLoading } = useUser();
//   const pathname = usePathname();
//   const { isLoading: planLoading } = usePlan();

//   // While loading user or plan data:
//   if (userLoading || planLoading) {
//     return (
//       <header className="flex h-16 items-center gap-2 bg-background px-4 border-b border-border">
//         <SidebarTrigger className="-ml-1" />
//         <Separator orientation="vertical" className="h-4" />
//         <div className="ml-auto flex items-center gap-4">
//           <Skeleton className="h-4 w-16" />
//           <ModeToggle />
//           <Skeleton className="h-8 w-8 rounded-full" />
//         </div>
//       </header>
//     );
//   }

//   // If not signed-in, show Sign In + ModeToggle:
//   if (!sessionUser) {
//     return (
//       <header className="flex h-16 items-center gap-2 bg-background px-4 border-b border-border">
//         <SidebarTrigger className="-ml-1" />
//         <Separator orientation="vertical" className="h-4" />
//         <div className="ml-auto flex items-center gap-4">
//           <Link
//             href="/sign-in"
//             className={buttonVariants({ variant: "secondary" })}
//           >
//             Sign In
//           </Link>
//           <ModeToggle />
//         </div>
//       </header>
//     );
//   }

//   // Logged-in state:
//   const name = sessionUser.name || "";
//   const email = sessionUser.email;
//   const avatarSrc = sessionUser.avatar || "/alien/alien_1.jpg";

//   // Breadcrumb logic (only on these routes):
//   const breadcrumbRoutes = ["/dashboard", "/my-page", "/subscribe"];
//   const getBreadcrumbs = () => {
//     if (!breadcrumbRoutes.some((r) => pathname.startsWith(r))) return null;
//     const parts = pathname.split("/").filter(Boolean);
//     const crumbs: Array<{ label: string; href: string; isCurrent: boolean }> =
//       [];
//     crumbs.push({ label: "Home", href: "/", isCurrent: pathname === "/" });
//     let cur = "";
//     for (const part of parts) {
//       cur += `/${part}`;
//       const label = part
//         .split("-")
//         .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
//         .join(" ");
//       crumbs.push({ label, href: cur, isCurrent: cur === pathname });
//     }
//     return crumbs;
//   };
//   const breadcrumbs = getBreadcrumbs();

//   return (
//     <header className="flex h-16 items-center gap-2 bg-background px-4 border-b border-border">
//       <div className="flex items-center gap-2">
//         <SidebarTrigger className="-ml-1" />
//         <Separator orientation="vertical" className="h-4" />
//         {breadcrumbs && (
//           <Breadcrumb>
//             <BreadcrumbList>
//               {breadcrumbs.map((crumb, idx) => (
//                 <div key={crumb.href} className="flex items-center">
//                   <BreadcrumbItem className="hidden md:block">
//                     {crumb.isCurrent ? (
//                       <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
//                     ) : (
//                       <BreadcrumbLink asChild>
//                         <Link href={crumb.href}>{crumb.label}</Link>
//                       </BreadcrumbLink>
//                     )}
//                   </BreadcrumbItem>
//                   {idx < breadcrumbs.length - 1 && (
//                     <BreadcrumbSeparator className="hidden md:block" />
//                   )}
//                 </div>
//               ))}
//             </BreadcrumbList>
//           </Breadcrumb>
//         )}
//       </div>

//       <div className="ml-auto flex items-center gap-4">
//         {/* NavUser shows name, avatar, and dropdown */}
//         <NavUser
//           user={{
//             name,
//             email,
//             avatar: avatarSrc,
//           }}
//           collapsible={undefined}
//         />
//         {/* ModeToggle always on the right */}
//         <ModeToggle />
//       </div>
//     </header>
//   );
// }
