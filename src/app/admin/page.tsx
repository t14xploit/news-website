// import AdminDashboard from "@/components/admin/admin-dashboard";
// import { redirect } from "next/navigation";
// import { auth } from "@/lib/auth";
// import { headers } from "next/headers";

// export default async function AdminIndexPage() {
//   const incomingHeaders = await headers();

//   const nativeHeaders = new Headers();
//   for (const [key, value] of incomingHeaders.entries()) {
//     if (value !== undefined) nativeHeaders.set(key, value);
//   }

//   const session = await auth.api.getSession({
//     headers: nativeHeaders,
//   });

//   if (!session || !session.user || session.user.role !== "admin") {
//     redirect("/sign-in");
//   }

//   return <AdminDashboard />;
// }

"use client";
import AdminDashboard from "@/components/admin/admin-dashboard";
import { useUser } from "@/lib/context/user-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminIndexPage() {
  const { sessionUser, isLoading, isAdmin } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!sessionUser || !isAdmin)) {
      router.replace("/sign-in");
    }
  }, [sessionUser, isLoading, isAdmin, router]);

  if (isLoading) return <div>Loading...</div>;
  if (!isAdmin) return null;

  return <AdminDashboard />;
}
