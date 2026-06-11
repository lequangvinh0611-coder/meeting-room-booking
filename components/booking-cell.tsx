"use client"

import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatRange, type Booking } from "@/lib/booking-data"

type BookingCellProps = {
  onClick: () => void
}

export function EmptyCell({ onClick }: BookingCellProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex h-full min-h-[60px] w-full items-center justify-center border-r border-b border-slate-200",
        "bg-emerald-50/40 hover:bg-emerald-100 transition-colors cursor-pointer",
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
  span: number
  onClick: () => void
}

export function BookedBlock({ booking, span, onClick }: BookedBlockProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ gridColumn: `span ${span}` }}
      className={cn(
        "group flex h-full min-h-[60px] w-full flex-col items-start justify-center gap-0.5 overflow-hidden border-r border-b border-slate-200 px-2 py-1 text-left",
        "bg-amber-100/80 hover:bg-amber-200 transition-colors cursor-pointer min-w-0 relative",
      )}
      aria-label={`Đã đặt: ${booking.title}`}
    >
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400 rounded-r-sm" />
      
      <div className="w-full truncate text-[11px] font-bold text-amber-950 leading-tight">
        {booking.title}
      </div>
      
      {booking.bookerName && (
        <div className="w-full truncate text-[10px] text-amber-800/80 font-medium leading-tight mt-0.5">
          {booking.bookerName} <span className="opacity-70 font-normal">({booking.department})</span>
        </div>
      )}
      
      <div className="w-full truncate text-[9px] font-semibold text-amber-700/90 leading-tight">
        {formatRange(booking.start_time, booking.end_time)}
      </div>
    </button>
  )
}
