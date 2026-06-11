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
import { Button } from "@/components/ui/button"

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

  // Sử dụng phân số (1fr) để tự động dàn đều không gian trên PC, không cần thanh cuộn ngang
  const gridTemplateColumns = `200px repeat(${TOTAL_SLOTS}, minmax(0, 1fr))`

  return (
    <div className="flex flex-col gap-4 w-full">
      <DateNavigator selectedDate={selectedDate} onChange={setSelectedDate} />

      {/* --- GIAO DIỆN DESKTOP (GRID CO GIÃN TỰ ĐỘNG) --- */}
      <div className="hidden lg:block w-full rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="w-full">
          <div className="grid w-full" style={{ gridTemplateColumns }}>
            <div className="flex items-center border-r border-b border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
              Phòng họp
            </div>
            {SLOTS.map((minutes) => (
              <div
                key={minutes}
                className="border-r border-b border-slate-200 bg-slate-50 px-1 py-3 text-center text-[11px] font-medium text-slate-500"
              >
                {formatMinutes(minutes)}
              </div>
            ))}
          </div>

          {ROOMS.map((room) => (
            <div key={room.id} className="grid w-full" style={{ gridTemplateColumns }}>
              <div className="bg-white border-b border-r border-slate-200">
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

      {/* --- GIAO DIỆN MOBILE (TIMELINE DỌC) --- */}
      <div className="lg:hidden flex flex-col gap-6 w-full">
        {ROOMS.map((room) => {
          const roomBookings = dayBookings
            .filter((b) => b.roomId === room.id)
            .sort((a, b) => a.start_time.localeCompare(b.start_time));

          return (
            <div key={room.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-slate-900">{room.name}</h3>
                  <p className="text-[11px] text-slate-500 mt-1">Tầng {room.floor} • Sức chứa {room.capacity}</p>
                </div>
                <Button size="sm" variant="outline" className="text-xs font-medium" onClick={() => handleEmptyClick(room.id, 0)}>
                  Đặt phòng này
                </Button>
              </div>

              <div className="p-4 flex flex-col gap-4">
                {roomBookings.length > 0 ? (
                  roomBookings.map((booking) => (
                    <div key={booking.id} onClick={() => handleBookedClick(booking)} className="flex gap-4 relative cursor-pointer group">
                      {/* Trục dọc Timeline */}
                      <div className="w-[2px] bg-blue-100 absolute left-[5px] top-4 bottom-[-24px] group-last:bottom-0" />
                      <div className="size-3 rounded-full bg-blue-500 ring-4 ring-white relative z-10 shrink-0 mt-2" />
                      
                      {/* Thẻ Booking */}
                      <div className="flex-1 bg-amber-50/80 hover:bg-amber-100 border border-amber-200/60 rounded-lg p-3 transition-colors">
                        <p className="text-xs font-bold text-amber-700">{formatRange(booking.start_time, booking.end_time)}</p>
                        <p className="text-sm font-semibold text-slate-900 mt-1">{booking.title}</p>
                        <p className="text-xs text-slate-600 flex items-center gap-1.5 mt-1.5">
                          <span className="font-medium text-slate-800">{booking.bookerName}</span> ({booking.department})
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-slate-500 text-center py-6 bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
                    Phòng còn trống nguyên ngày
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <BookingModal
        selection={selection}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onConfirm={handleConfirm}
      />

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
