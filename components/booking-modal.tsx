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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { CalendarPlus } from "lucide-react"
import { UserCombobox } from "@/components/user-combobox"
import {
  SLOTS,
  DURATION_OPTIONS,
  formatMinutes,
  type Room,
  type User,
} from "@/lib/booking-data"

export type BookingSelection = {
  room: Room
  /** Index of the 30-minute slot column the booking starts at. */
  slotIndex: number
  /** The calendar day the booking is being made for. */
  date: Date
}

type BookingModalProps = {
  selection: BookingSelection | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (data: {
    title: string
    email: string
    bookerName: string
    department: string
    durationMinutes: number
    syncGaroon: boolean
  }) => { ok: boolean; error?: string }
}

export function BookingModal({
  selection,
  open,
  onOpenChange,
  onConfirm,
}: BookingModalProps) {
  const [title, setTitle] = useState("")
  const [user, setUser] = useState<User | null>(null)
  const [durationMinutes, setDurationMinutes] = useState(60)
  const [syncGaroon, setSyncGaroon] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Reset form whenever a new slot is opened
  useEffect(() => {
    if (open) {
      setTitle("")
      setUser(null)
      setDurationMinutes(60)
      setSyncGaroon(false)
      setError(null)
    }
  }, [open])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) {
      setError("Vui lòng nhập tên cuộc họp.")
      return
    }
    if (!user) {
      setError("Vui lòng chọn người đặt phòng.")
      return
    }
    const result = onConfirm({
      title: title.trim(),
      email: user.email,
      bookerName: user.fullName,
      department: user.department,
      durationMinutes,
      syncGaroon,
    })
    // Keep the modal open and surface the conflict message on failure.
    if (!result.ok) {
      setError(result.error ?? "Không thể đặt phòng, vui lòng thử lại.")
    }
  }

  const startLabel =
    selection != null ? formatMinutes(SLOTS[selection.slotIndex]) : ""
  const dateLabel =
    selection != null
      ? selection.date.toLocaleDateString("vi-VN", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : ""

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
            <p className="mt-1 text-muted-foreground capitalize">{dateLabel}</p>
            <p className="mt-0.5 text-muted-foreground">
              Bắt đầu lúc:{" "}
              <span className="font-medium text-foreground">{startLabel}</span>
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="meeting-title">Tên cuộc họp</Label>
            <Input
              id="meeting-title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                setError(null)
              }}
              placeholder="VD: Họp kế hoạch tháng 6"
              autoFocus
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Người đặt</Label>
            <UserCombobox
              value={user}
              onSelect={(u) => {
                setUser(u)
                setError(null)
              }}
            />
            {user && (
              <p className="text-xs text-muted-foreground">
                {user.position} · {user.department}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="duration">Thời lượng</Label>
            <Select
              value={String(durationMinutes)}
              onValueChange={(v) => {
                setDurationMinutes(Number(v))
                setError(null)
              }}
            >
              <SelectTrigger id="duration" className="w-full">
                <SelectValue placeholder="Chọn thời lượng" />
              </SelectTrigger>
              <SelectContent>
                {DURATION_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={String(opt.value)}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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

          {error && (
            <p
              role="alert"
              className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive"
            >
              {error}
            </p>
          )}

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
