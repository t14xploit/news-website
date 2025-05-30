"use client";

import Link from "next/link";
import { UsersIcon, LayoutGrid, BriefcaseIcon } from "lucide-react";

const AdminDashboard = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
          href="/admin/users"
          className="p-4 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <div className="flex items-center space-x-2">
            <UsersIcon className="h-6 w-6" />
            <span>Manage Users</span>
          </div>
        </Link>
        <Link
          href="/admin/articles"
          className="p-4 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <div className="flex items-center space-x-2">
            <LayoutGrid className="h-6 w-6" />
            <span>Manage Articles</span>
          </div>
        </Link>
        <Link
          href="/admin/categories"
          className="p-4 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <div className="flex items-center space-x-2">
            <BriefcaseIcon className="h-6 w-6" />
            <span>Manage Categories</span>
          </div>
        </Link>
        <Link
          href="/admin/authors"
          className="p-4 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <div className="flex items-center space-x-2">
            <BriefcaseIcon className="h-6 w-6" />
            <span>Manage Authors</span>
          </div>
        </Link>
        {/* Add other links to manage subscription stats, etc. */}
      </div>
    </div>
  );
};

export default AdminDashboard;
