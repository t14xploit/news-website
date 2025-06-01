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

import AdminDashboard from "@/components/admin/admin-dashboard";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function AdminIndexPage() {
  const incomingHeaders = await headers();

  const nativeHeaders = new Headers();
  for (const [key, value] of incomingHeaders.entries()) {
    nativeHeaders.set(key, value ?? "");
  }

  const session = await auth.api.getSession({
    headers: nativeHeaders,
  });

  if (!session || !session.user || session.user.role !== "admin") {
    redirect("/sign-in");
  }

  return <AdminDashboard />;
}
