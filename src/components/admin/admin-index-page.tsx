import { AppSidebar } from "../sidebar-nav/app-sidebar";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Administration area for site management",
};

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

  return (
    <AppSidebar
      user={{
        name: "",
        email: "",
        avatar: "",
      }}
    />
  );
}
