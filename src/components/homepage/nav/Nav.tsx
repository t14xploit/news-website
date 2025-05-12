"use client"

import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import {
  Star,
  Mail,
  Eye,
  Newspaper,
  Users,
} from "lucide-react" // <- Import relevant icons

const navItems = [
  { id: "editors-choice", label: "Editor's Choice", icon: Star },
  { id: "subscription", label: "Subscribe", icon: Mail },
  { id: "most-viewed", label: "Most Viewed", icon: Eye },
  { id: "latest-news", label: "Latest News", icon: Newspaper },
  { id: "expert-insights", label: "Expert Insights", icon: Users },
]

export default function Nav() {
  return (
    <div className="flex flex-wrap w-full justify-between py-4 items-center gap-4">
      {navItems.map((item) => {
        const Icon = item.icon
        return (
          <Card key={item.id} className="bg-muted w-44 h-20 hover:shadow-lg transition">
            <CardContent className="flex flex-col items-center justify-center h-full">
              <Link
                href={`#${item.id}`}
                className="text-sm font-medium hover:underline text-center flex  gap-2"
              >
              <Icon className="h-5 w-5 mb-1 text-primary" />
                {item.label}
              </Link>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
