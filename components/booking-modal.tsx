"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { CalendarPlus } from "lucide-react"
import { formatSlot, type Room } from "@/lib/booking-data"

export type BookingSelection = {
  room: Room
  hour: number
}

type BookingModalProps = {
  selection: BookingSelection | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (data: { title: string; email: string; syncGaroon: boolean }) => void
}

export function BookingModal({
  selection,
  open,
  onOpenChange,
  onConfirm,
}: BookingModalProps) {
  const [title, setTitle] = useState("")
  const [email, setEmail] = useState("")
  const [syncGaroon, setSyncGaroon] = useState(false)

  // Reset form whenever a new slot is opened
  useEffect(() => {
    if (open) {
      setTitle("")
      setEmail("")
      setSyncGaroon(false)
    }
  }, [open])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !email.trim()) return
    onConfirm({ title: title.trim(), email: email.trim(), syncGaroon })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Đặt phòng họp nhanh</DialogTitle>
          <DialogDescription>
            Điền thông tin bên dưới để xác nhận đặt phòng.
          </DialogDescription>
        </DialogHeader>

        {selection && (
          <div className="rounded-lg border border-border bg-muted/50 p-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground">
                {selection.room.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {selection.room.floor} · {selection.room.capacity} người
              </span>
            </div>
            <p className="mt-1 text-muted-foreground">
              Khung giờ:{" "}
              <span className="font-medium text-foreground">
                {formatSlot(selection.hour)}
              </span>
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="meeting-title">Tên cuộc họp</Label>
            <Input
              id="meeting-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Họp kế hoạch tháng 6"
              autoFocus
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="booker-email">Email người đặt</Label>
            <Input
              id="booker-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ten@company.com"
              required
            />
          </div>

          <label
            htmlFor="sync-garoon"
            className="flex items-center gap-2.5 rounded-md border border-border p-3 cursor-pointer hover:bg-accent/50 transition-colors"
          >
            <Checkbox
              id="sync-garoon"
              checked={syncGaroon}
              onCheckedChange={(checked) => setSyncGaroon(checked === true)}
            />
            <span className="flex items-center gap-1.5 text-sm text-foreground">
              <CalendarPlus className="size-4 text-muted-foreground" aria-hidden="true" />
              Đồng bộ tạo lịch lên Cybozu Garoon
            </span>
          </label>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button type="submit">Xác nhận đặt</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
