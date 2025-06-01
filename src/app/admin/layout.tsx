import React from "react";
import AdminSidebar from "@/components/admin/admin-sidebar";
import { UserProvider } from "@/lib/context/user-context";
import "@/app/globals.css";

export const metadata = {
  title: "Admin Dashboard",
  description: "Administration area for site management",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>{/* Any head tags if needed */}</head>
      <body className="flex h-screen overflow-hidden">
        {/* We wrap everything in UserProvider so any hooks inside can access user context */}
        <UserProvider>
          {/* Sidebar occupies fixed width on the left */}
          <div className="flex-shrink-0">
            <AdminSidebar />
          </div>

          {/* Main content: fill remaining width, allow vertical scrolling */}
          <main className="flex-1 overflow-y-auto bg-background p-6">
            {children}
          </main>
        </UserProvider>
      </body>
    </html>
  );
}
