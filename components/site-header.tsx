"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { CalendarDays, Users, Building } from "lucide-react"

export function SiteHeader() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Lịch đặt phòng", icon: CalendarDays },
    { href: "/users", label: "Quản lý User", icon: Users },
    { href: "/rooms", label: "Quản lý Phòng", icon: Building },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-14 items-center mx-auto px-4">
        <div className="mr-4 flex items-center gap-2 font-bold text-emerald-700">
          <div className="size-6 bg-emerald-600 rounded-md flex items-center justify-center">
            <CalendarDays className="size-4 text-white" />
          </div>
          Cybozu Booking
        </div>
        
        <nav className="flex items-center space-x-6 ml-6 text-sm font-medium">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 transition-colors hover:text-emerald-600",
                  isActive ? "text-emerald-700 font-semibold" : "text-muted-foreground"
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
