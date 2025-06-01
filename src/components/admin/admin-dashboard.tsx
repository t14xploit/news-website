"use client";

import Link from "next/link";
import React from "react";
import { UsersIcon, LayoutGrid, BriefcaseIcon, UserIcon } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboard() {
  return (
    <div className="p-6 space-y-8 justify-center">
      <div>
        <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Choose a section to manage</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
        {/* Manage Users */}
        <Link href="/admin/users" passHref>
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <div className="block h-full">
              <CardHeader className="p-6">
                <UsersIcon className="h-8 w-8 text-blue-500" />
                <CardTitle className="mt-4 text-lg font-medium">
                  Manage Users
                </CardTitle>
              </CardHeader>
            </div>
          </Card>
        </Link>

        {/* Manage Articles */}
        <Link href="/admin/articles" passHref>
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <div className="block h-full">
              <CardHeader className="p-6">
                <LayoutGrid className="h-8 w-8 text-green-500" />
                <CardTitle className="mt-4 text-lg font-medium">
                  Manage Articles
                </CardTitle>
              </CardHeader>
            </div>
          </Card>
        </Link>

        {/* Manage Categories */}
        <Link href="/admin/categories" passHref>
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <div className="block h-full">
              <CardHeader className="p-6">
                <BriefcaseIcon className="h-8 w-8 text-orange-500" />
                <CardTitle className="mt-4 text-lg font-medium">
                  Manage Categories
                </CardTitle>
              </CardHeader>
            </div>
          </Card>
        </Link>

        {/* Manage Authors */}
        <Link href="/admin/authors" passHref>
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <div className="block h-full">
              <CardHeader className="p-6">
                <UserIcon className="h-8 w-8 text-teal-500" />
                <CardTitle className="mt-4 text-lg font-medium">
                  Manage Authors
                </CardTitle>
              </CardHeader>
            </div>
          </Card>
        </Link>

        {/* (Optional) Manage Subscriptions—placeholder for future */}
        <Link href="/admin/subscriptions" passHref>
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <div className="block h-full">
              <CardHeader className="p-6">
                <BriefcaseIcon className="h-8 w-8 text-purple-500" />
                <CardTitle className="mt-4 text-lg font-medium">
                  Subscription Stats
                </CardTitle>
              </CardHeader>
            </div>
          </Card>
        </Link>

        {/* (Optional) Manage Channels—placeholder for future */}
        <Link href="/admin/channels" passHref>
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <div className="block h-full">
              <CardHeader className="p-6">
                <LayoutGrid className="h-8 w-8 text-red-500" />
                <CardTitle className="mt-4 text-lg font-medium">
                  Manage Channels
                </CardTitle>
              </CardHeader>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
