import AdminDashboard from "@/components/admin/admin-dashboard";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user?.role !== "admin") {
    redirect("/sign-in");
  }
  return (
    <div>
      <div> Admin page</div>
      <AdminDashboard />
    </div>
  );
}
