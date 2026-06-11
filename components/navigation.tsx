"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { CalendarDays, Users, Building, Settings } from "lucide-react"

const navItems = [
  { href: "/", label: "Lịch đặt phòng", icon: CalendarDays },
  { href: "/users", label: "Quản lý User", icon: Users },
  { href: "/rooms", label: "Quản lý Phòng", icon: Building },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <>
      {/* 1. DESKTOP SIDEBAR (Ẩn trên Mobile, hiện từ màn hình md trở lên) */}
      <aside className="hidden md:flex w-[260px] bg-slate-900 flex-col h-screen shrink-0 border-r border-slate-800/60 shadow-xl z-20">
        <div className="h-16 flex items-center px-6 border-b border-slate-800/60">
          <div className="flex items-center gap-3 font-semibold text-slate-100 text-[15px] tracking-wide">
            <div className="size-7 bg-blue-600 rounded flex items-center justify-center shadow-inner">
              <CalendarDays className="size-4 text-white" strokeWidth={2.5} />
            </div>
            Cybozu Booking
          </div>
        </div>

        <div className="flex-1 py-6 px-4">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">
            Menu chính
          </div>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-100"
                  )}
                >
                  <Icon className={cn("size-4", isActive ? "text-white" : "text-slate-400")} />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800/60">
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 transition-colors hover:bg-slate-800/80 hover:text-slate-100 w-full">
            <Settings className="size-4" />
            Cài đặt hệ thống
          </button>
        </div>
      </aside>

      {/* 2. MOBILE BOTTOM NAV (Hiện trên Mobile, ẩn từ màn hình md trở lên) */}
      {/* Tính năng pb-safe giúp tương thích hoàn hảo với thanh gạt Home của iPhone */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.05)] z-50 pb-safe">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors",
                  isActive ? "text-blue-600" : "text-slate-500 hover:text-slate-900"
                )}
              >
                <Icon 
                  className={cn("size-[22px]", isActive && "fill-blue-100")} 
                  strokeWidth={isActive ? 2.5 : 2} 
                />
                <span className={cn("text-[10px] font-medium", isActive && "font-semibold")}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
