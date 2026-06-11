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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarPlus, Trash2, History, AlertCircle } from "lucide-react"
import { UserCombobox } from "@/components/user-combobox"
import {
  DURATION_OPTIONS,
  USERS,
  formatTimestamp,
  formatRange,
  type Booking,
  type User,
} from "@/lib/booking-data"

export type EditBookingModalProps = {
  booking: Booking | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: (
    id: string,
    data: {
      title: string
      email: string
      bookerName: string
      department: string
      durationMinutes: number
      syncGaroon: boolean
    }
  ) => { ok: boolean; error?: string }
  onDelete: (id: string) => void
}

export function EditBookingModal({
  booking,
  open,
  onOpenChange,
  onUpdate,
  onDelete,
}: EditBookingModalProps) {
  const [title, setTitle] = useState("")
  const [user, setUser] = useState<User | null>(null)
  const [durationMinutes, setDurationMinutes] = useState(60)
  const [syncGaroon, setSyncGaroon] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Khôi phục dữ liệu vào form mỗi khi mở modal
  useEffect(() => {
    if (open && booking) {
      setTitle(booking.title)
      const matchedUser = USERS.find((u) => u.email === booking.email) || null
      setUser(matchedUser)

      const startMs = new Date(booking.start_time).getTime()
      const endMs = new Date(booking.end_time).getTime()
      const mins = Math.round((endMs - startMs) / 60000)
      setDurationMinutes(mins)

      setSyncGaroon(booking.syncGaroon)
      setError(null)
    }
  }, [open, booking])

  if (!booking) return null

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
    
    const result = onUpdate(booking!.id, {
      title: title.trim(),
      email: user.email,
      bookerName: user.fullName,
      department: user.department,
      durationMinutes,
      syncGaroon,
    })
    
    if (!result.ok) {
      setError(result.error ?? "Không thể cập nhật, vui lòng thử lại.")
    }
  }

  const bookingDate = new Date(booking.start_time).toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Chi tiết đặt phòng</DialogTitle>
          <DialogDescription>
            Xem, chỉnh sửa thông tin hoặc hủy lịch đặt phòng.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="info">Thông tin</TabsTrigger>
            <TabsTrigger value="audit" className="flex items-center gap-1.5">
              <History className="size-3.5" aria-hidden="true" />
              Lịch sử ({booking.auditLog.length})
            </TabsTrigger>
          </TabsList>

          {/* TAB: CHỈNH SỬA THÔNG TIN */}
          <TabsContent value="info" className="space-y-4 pt-4">
            <div className="rounded-lg border border-border bg-muted/30 p-3 text-sm">
              <p className="capitalize text-muted-foreground">{bookingDate}</p>
              <p className="mt-0.5 text-foreground font-medium">
                Khung giờ: {formatRange(booking.start_time, booking.end_time)}
              </p>
            </div>

            <form id="edit-booking-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-title">Tên cuộc họp</Label>
                <Input
                  id="edit-title"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value)
                    setError(null)
                  }}
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
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-duration">Thời lượng mới</Label>
                <Select
                  value={String(durationMinutes)}
                  onValueChange={(v) => {
                    setDurationMinutes(Number(v))
                    setError(null)
                  }}
                >
                  <SelectTrigger id="edit-duration">
                    <SelectValue />
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

              <label className="flex items-center gap-2.5 rounded-md border border-border p-3 cursor-pointer hover:bg-accent/50 transition-colors">
                <Checkbox
                  checked={syncGaroon}
                  onCheckedChange={(c) => setSyncGaroon(c === true)}
                />
                <span className="flex items-center gap-1.5 text-sm text-foreground">
                  <CalendarPlus className="size-4 text-muted-foreground" aria-hidden="true" />
                  Đồng bộ tạo lịch lên Cybozu Garoon
                </span>
              </label>

              {error && (
                <p className="flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">
                  <AlertCircle className="size-4" />
                  {error}
                </p>
              )}
            </form>
          </TabsContent>

          {/* TAB: LỊCH SỬ CHỈNH SỬA */}
          <TabsContent value="audit" className="pt-4">
            <div className="max-h-[300px] overflow-y-auto pr-2 space-y-4">
              {[...booking.auditLog].reverse().map((log) => (
                <div key={log.id} className="relative pl-5 border-l-2 border-muted-foreground/20 pb-1">
                  <div className="absolute -left-[5px] top-1.5 size-2 rounded-full bg-muted-foreground/40" />
                  <p className="text-xs text-muted-foreground mb-0.5">
                    {formatTimestamp(log.timestamp)}
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {log.action}
                  </p>
                  <p className="text-xs text-muted-foreground/80 mt-0.5">
                    Bởi: <span className="font-medium text-foreground/80">{log.actor}</span>
                  </p>
                </div>
              ))}
              {booking.auditLog.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">Chưa có lịch sử thao tác.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="gap-2 sm:gap-2 border-t pt-4 mt-2">
          <Button
            type="button"
            variant="destructive"
            onClick={() => onDelete(booking.id)}
            className="mr-auto sm:mr-auto"
          >
            <Trash2 className="size-4 mr-1.5" />
            Hủy phòng
          </Button>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
          <Button type="submit" form="edit-booking-form">
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
