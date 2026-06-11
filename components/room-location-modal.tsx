"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { MapPin, Users } from "lucide-react"
import type { Room } from "@/lib/booking-data"

type RoomLocationModalProps = {
  room: Room | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RoomLocationModal({
  room,
  open,
  onOpenChange,
}: RoomLocationModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="size-5 text-primary" aria-hidden="true" />
            Vị trí phòng họp
          </DialogTitle>
          <DialogDescription>
            {room
              ? `Thông tin chi tiết vị trí của ${room.name}.`
              : "Thông tin vị trí phòng họp."}
          </DialogDescription>
        </DialogHeader>

        {room && (
          <div className="flex flex-col gap-4">
            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-base font-semibold text-foreground">
                  {room.name}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Users className="size-3.5" aria-hidden="true" />
                  {room.capacity} người
                </span>
              </div>
              <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="size-4" aria-hidden="true" />
                {room.location}
              </p>
            </div>

            {/* Placeholder for the upcoming floor-map feature */}
            <div className="flex h-48 items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 px-6 text-center">
              <p className="text-sm font-medium text-muted-foreground text-balance">
                [BẢN ĐỒ PHÒNG HỌP SẼ HIỂN THỊ TẠI ĐÂY Ở BƯỚC 2]
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
