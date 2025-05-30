import Link from "next/link";

export default function Sidebar() {
  return (
    <nav className="space-y-2">
      <Link href="/dashboard/admin" className="block">
        Overview
      </Link>
      <Link href="/dashboard/admin/users" className="block">
        Users
      </Link>
      <Link href="/dashboard/admin/sessions" className="block">
        Sessions
      </Link>
      <Link href="/dashboard/admin/subscriptions" className="block">
        Plans
      </Link>
      <Link href="/dashboard/admin/stats" className="block">
        Stats
      </Link>
    </nav>
  );
}
