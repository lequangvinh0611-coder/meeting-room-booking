"use client"

import { useState, useMemo } from "react"
import {
  ROOMS,
  SLOTS,
  TOTAL_SLOTS,
  INITIAL_BOOKINGS,
  formatMinutes,
  formatRange,
  getRangeFromSlot,
  getSlotIndexFromISO,
  getDurationSlots,
  isOverlapping,
  isSameDay,
  startOfDay,
  createAuditEntry,
  type Booking,
  type Room,
} from "@/lib/booking-data"
import { RoomLabel } from "@/components/room-label"
import { EmptyCell, BookedBlock } from "@/components/booking-cell"
import { BookingModal, type BookingSelection } from "@/components/booking-modal"
import { EditBookingModal } from "@/components/edit-booking-modal"
import { RoomLocationModal } from "@/components/room-location-modal"
import { DateNavigator } from "@/components/date-navigator"

export function BookingGrid() {
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS)
  const [selectedDate, setSelectedDate] = useState<Date>(() =>
    startOfDay(new Date()),
  )

  // State cho Modal Đặt Mới
  const [selection, setSelection] = useState<BookingSelection | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  // State cho Modal Sửa/Xóa
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null)
  const [editModalOpen, setEditModalOpen] = useState(false)

  const [locationRoom, setLocationRoom] = useState<Room | null>(null)
  const [locationOpen, setLocationOpen] = useState(false)

  const dayBookings = useMemo(
    () => bookings.filter((b) => isSameDay(b.start_time, selectedDate)),
    [bookings, selectedDate],
  )

  function handleEmptyClick(roomId: string, slotIndex: number) {
    const room = ROOMS.find((r) => r.id === roomId)
    if (!room) return
    setSelection({ room, slotIndex, date: selectedDate })
    setModalOpen(true)
  }

  function handleBookedClick(booking: Booking) {
    setEditingBooking(booking)
    setEditModalOpen(true)
  }

  function handleViewLocation(room: Room) {
    setLocationRoom(room)
    setLocationOpen(true)
  }

  // LOGIC ĐẶT PHÒNG MỚI
  function handleConfirm(data: {
    title: string
    email: string
    bookerName: string
    department: string
    durationMinutes: number
    syncGaroon: boolean
  }): { ok: boolean; error?: string } {
    if (!selection) return { ok: false }

    const { start_time, end_time } = getRangeFromSlot(
      selection.slotIndex,
      data.durationMinutes,
      selection.date,
    )

    if (getSlotIndexFromISO(start_time) + data.durationMinutes / 30 > TOTAL_SLOTS) {
      return {
        ok: false,
        error: "Thời lượng vượt quá khung giờ làm việc (kết thúc 18:00).",
      }
    }

    const conflict = bookings.some(
      (b) =>
        b.roomId === selection.room.id &&
        isOverlapping(start_time, end_time, b.start_time, b.end_time),
    )
    if (conflict) {
      return {
        ok: false,
        error: "Khung giờ này vừa có người đặt, vui lòng chọn giờ khác!",
      }
    }

    const newBooking: Booking = {
      id: `b-${Date.now()}`,
      roomId: selection.room.id,
      start_time,
      end_time,
      title: data.title,
      email: data.email,
      bookerName: data.bookerName,
      department: data.department,
      syncGaroon: data.syncGaroon,
      auditLog: [createAuditEntry(data.bookerName, "Tạo cuộc họp mới")],
    }
    setBookings((prev) => [...prev, newBooking])
    setModalOpen(false)
    setSelection(null)
    return { ok: true }
  }

  // LOGIC SỬA PHÒNG ĐÃ ĐẶT
  function handleUpdateBooking(
    id: string,
    data: {
      title: string
      email: string
      bookerName: string
      department: string
      durationMinutes: number
      syncGaroon: boolean
    }
  ): { ok: boolean; error?: string } {
    const existing = bookings.find((b) => b.id === id)
    if (!existing) return { ok: false, error: "Không tìm thấy cuộc họp." }

    const startSlot = getSlotIndexFromISO(existing.start_time)
    const { start_time, end_time } = getRangeFromSlot(
      startSlot,
      data.durationMinutes,
      new Date(existing.start_time),
    )

    if (getSlotIndexFromISO(start_time) + data.durationMinutes / 30 > TOTAL_SLOTS) {
      return { ok: false, error: "Thời lượng vượt quá khung giờ làm việc." }
    }

    // Check conflict (bỏ qua bản thân nó)
    const conflict = bookings.some(
      (b) =>
        b.id !== id &&
        b.roomId === existing.roomId &&
        isOverlapping(start_time, end_time, b.start_time, b.end_time),
    )
    if (conflict) {
      return { ok: false, error: "Khung giờ cập nhật bị trùng với người khác!" }
    }

    // Đánh giá các thay đổi để ghi Audit Log
    const changes: string[] = []
    if (existing.title !== data.title) changes.push("Tên")
    if (existing.bookerName !== data.bookerName) changes.push("Người đặt")
    if (existing.syncGaroon !== data.syncGaroon) changes.push("Đồng bộ")
    
    const oldDuration = getDurationSlots(existing.start_time, existing.end_time) * 30
    if (oldDuration !== data.durationMinutes) changes.push("Thời lượng")

    // Nếu không có thay đổi gì thì đóng luôn modal
    if (changes.length === 0) {
      setEditModalOpen(false)
      setEditingBooking(null)
      return { ok: true }
    }

    const actionText = `Sửa: ${changes.join(", ")}`
    const newAudit = createAuditEntry(data.bookerName, actionText)

    setBookings((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              title: data.title,
              email: data.email,
              bookerName: data.bookerName,
              department: data.department,
              end_time,
              syncGaroon: data.syncGaroon,
              auditLog: [...b.auditLog, newAudit], // Append log mới
            }
          : b
      )
    )
    setEditModalOpen(false)
    setEditingBooking(null)
    return { ok: true }
  }

  // LOGIC HỦY/XÓA ĐẶT PHÒNG
  function handleDeleteBooking(id: string) {
    if (window.confirm("Bạn có chắc chắn muốn hủy đặt phòng này?")) {
      setBookings((prev) => prev.filter((b) => b.id !== id))
      setEditModalOpen(false)
      setEditingBooking(null)
    }
  }

  function buildRowCells(room: Room) {
    const roomBookings = dayBookings.filter((b) => b.roomId === room.id)
    const cells: React.ReactNode[] = []

    let slot = 0
    while (slot < TOTAL_SLOTS) {
      const booking = roomBookings.find(
        (b) => getSlotIndexFromISO(b.start_time) === slot,
      )

      if (booking) {
        const span = Math.max(
          1,
          Math.min(
            getDurationSlots(booking.start_time, booking.end_time),
            TOTAL_SLOTS - slot,
          ),
        )
        cells.push(
          <BookedBlock
            key={booking.id}
            booking={booking}
            span={span}
            onClick={() => handleBookedClick(booking)}
          />,
        )
        slot += span
      } else {
        const currentSlot = slot
        cells.push(
          <EmptyCell
            key={`${room.id}-${currentSlot}`}
            onClick={() => handleEmptyClick(room.id, currentSlot)}
          />,
        )
        slot += 1
      }
    }

    return cells
  }

  const gridTemplateColumns = `220px repeat(${TOTAL_SLOTS}, 110px)`

  return (
    <div className="flex flex-col gap-4">
      <DateNavigator selectedDate={selectedDate} onChange={setSelectedDate} />

      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
        <div className="min-w-max">
          <div className="grid" style={{ gridTemplateColumns }}>
            <div className="sticky left-0 z-10 flex items-center border-r border-b border-border bg-muted/60 px-4 py-3 text-sm font-semibold text-foreground">
              Phòng họp
            </div>
            {SLOTS.map((minutes) => (
              <div
                key={minutes}
                className="border-r border-b border-border bg-muted/60 px-1 py-3 text-center text-xs font-medium text-muted-foreground"
              >
                {formatMinutes(minutes)}
              </div>
            ))}
          </div>

          {ROOMS.map((room) => (
            <div key={room.id} className="grid" style={{ gridTemplateColumns }}>
              <div className="sticky left-0 z-10 bg-background">
                <RoomLabel
                  room={room}
                  onViewLocation={() => handleViewLocation(room)}
                />
              </div>
              {buildRowCells(room)}
            </div>
          ))}
        </div>
      </div>

      <BookingModal
        selection={selection}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onConfirm={handleConfirm}
      />

      {/* Tích hợp Modal Sửa/Xóa vừa tạo */}
      <EditBookingModal
        booking={editingBooking}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        onUpdate={handleUpdateBooking}
        onDelete={handleDeleteBooking}
      />

      <RoomLocationModal
        room={locationRoom}
        open={locationOpen}
        onOpenChange={setLocationOpen}
      />
    </div>
  )
}
