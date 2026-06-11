"use client"

import { Users, Layers } from "lucide-react"
import { type Room } from "@/lib/booking-data"

type RoomLabelProps = {
  room: Room
  onViewLocation: () => void
}

export function RoomLabel({ room, onViewLocation }: RoomLabelProps) {
  return (
    <button
      type="button"
      onClick={onViewLocation}
      className="flex w-full h-full min-h-[60px] flex-col items-start justify-center px-4 py-1.5 bg-white hover:bg-blue-50 transition-colors text-left cursor-pointer group"
      title="Nhấn để xem bản đồ sơ đồ phòng"
    >
      <span className="text-[13px] font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-tight">
        {room.name}
      </span>
      <div className="mt-1 flex items-center gap-3 text-[11px] font-medium text-slate-500">
        <span className="flex items-center gap-1">
          <Layers className="size-3" /> {room.floor}
        </span>
        <span className="flex items-center gap-1">
          <Users className="size-3" /> {room.capacity}
        </span>
      </div>
    </button>
  )
}
