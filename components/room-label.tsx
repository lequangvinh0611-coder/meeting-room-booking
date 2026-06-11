"use client"

import { Users, MapPin } from "lucide-react"
import type { Room } from "@/lib/booking-data"

type RoomLabelProps = {
  room: Room
  onViewLocation: () => void
}

export function RoomLabel({ room, onViewLocation }: RoomLabelProps) {
  return (
    <div className="flex h-full flex-col justify-center gap-1 border-r border-b border-border bg-card px-4 py-3">
      <span className="text-sm font-semibold text-card-foreground text-balance leading-tight">
        {room.name}
      </span>
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <MapPin className="size-3" aria-hidden="true" />
          {room.floor}
        </span>
        <span className="flex items-center gap-1">
          <Users className="size-3" aria-hidden="true" />
          {room.capacity} người
        </span>
      </div>
      <button
        type="button"
        onClick={onViewLocation}
        className="mt-1 flex w-fit items-center gap-1 rounded-md text-xs font-medium text-primary transition-colors hover:text-primary/80 hover:underline"
        aria-label={`Xem vị trí ${room.name}`}
      >
        <MapPin className="size-3" aria-hidden="true" />
        Xem vị trí
      </button>
    </div>
  )
}
