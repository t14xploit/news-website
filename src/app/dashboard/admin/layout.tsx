// import Link from "next/link";
import { ReactNode } from "react";
import Sidebar from "@/components/admin/sidebar";

export const metadata = { title: "Admin Dashboard" };

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full">
      <aside className="w-64 bg-card p-4">
        <Sidebar />
      </aside>
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  );
}
