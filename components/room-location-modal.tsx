"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { MapPin } from "lucide-react"
import Image from "next/image"
import { type Room } from "@/lib/booking-data"

export type RoomLocationModalProps = {
  room: Room | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RoomLocationModal({ room, open, onOpenChange }: RoomLocationModalProps) {
  if (!room) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] gap-0 p-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <DialogTitle className="flex items-center gap-2 text-slate-900">
            <MapPin className="size-5 text-blue-600" />
            Sơ đồ vị trí: {room.name}
          </DialogTitle>
        </DialogHeader>
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-600">
            <span className="font-semibold text-slate-900">Mô tả: </span>
            {room.location}
          </p>
          <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
            {room.mapImage ? (
              <Image
                src={room.mapImage}
                alt={`Sơ đồ ${room.name}`}
                fill
                className="object-cover"
              />
            ) : (
              <p className="text-slate-400 text-sm">Chưa có ảnh sơ đồ</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
