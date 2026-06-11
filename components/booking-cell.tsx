"use client"

import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Booking } from "@/lib/booking-data"

type BookingCellProps = {
  booking?: Booking
  onClick: () => void
}

export function BookingCell({ booking, onClick }: BookingCellProps) {
  if (booking) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "group flex h-full w-full flex-col justify-center gap-0.5 border-r border-b border-border px-2 py-1.5 text-left",
          "bg-amber-100 hover:bg-amber-200 transition-colors cursor-pointer",
        )}
        aria-label={`Đã đặt: ${booking.title}`}
      >
        <span className="truncate text-xs font-semibold text-amber-950 leading-tight">
          {booking.title}
        </span>
        <span className="truncate text-[11px] text-amber-800/80">
          {booking.email}
        </span>
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex h-full w-full items-center justify-center border-r border-b border-border",
        "bg-emerald-50/60 hover:bg-emerald-100 transition-colors cursor-pointer",
      )}
      aria-label="Khung giờ trống, nhấn để đặt"
    >
      <span className="flex items-center gap-1 text-xs font-medium text-emerald-700/70 opacity-0 transition-opacity group-hover:opacity-100">
        <Plus className="size-3.5" aria-hidden="true" />
        Trống
      </span>
    </button>
  )
}
