"use client"

import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatRange, type Booking } from "@/lib/booking-data"

type BookingCellProps = {
  onClick: () => void
}

/** Empty 30-minute slot. */
export function EmptyCell({ onClick }: BookingCellProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex h-full min-h-[76px] w-full items-center justify-center border-r border-b border-border",
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

type BookedBlockProps = {
  booking: Booking
  /** Number of 30-minute columns this booking spans. */
  span: number
  onClick: () => void
}

/** A booked block that spans `span` columns across the time grid. */
export function BookedBlock({ booking, span, onClick }: BookedBlockProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ gridColumn: `span ${span}` }}
      className={cn(
        "group flex h-full min-h-[76px] w-full flex-col justify-center gap-1 overflow-hidden border-r border-b border-border px-2.5 py-1.5 text-left",
        "bg-amber-100 hover:bg-amber-200 transition-colors cursor-pointer",
      )}
      aria-label={`Đã đặt: ${booking.title}`}
    >
      {/* Meeting title — bold, top line */}
      <span className="truncate text-[13px] font-semibold leading-tight text-amber-950">
        {booking.title}
      </span>
      {/* Booker — smaller, muted, second line */}
      {booking.bookerName && (
        <span className="truncate text-[11px] leading-tight text-amber-800/70">
          {booking.bookerName} ({booking.department})
        </span>
      )}
      <span className="truncate text-[11px] font-medium text-amber-700/90">
        {formatRange(booking.start_time, booking.end_time)}
      </span>
    </button>
  )
}
