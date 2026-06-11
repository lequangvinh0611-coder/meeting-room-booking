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
  type Booking,
  type Room,
} from "@/lib/booking-data"
import { RoomLabel } from "@/components/room-label"
import { EmptyCell, BookedBlock } from "@/components/booking-cell"
import { BookingModal, type BookingSelection } from "@/components/booking-modal"
import { RoomLocationModal } from "@/components/room-location-modal"
import { DateNavigator } from "@/components/date-navigator"

export function BookingGrid() {
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS)
  const [selectedDate, setSelectedDate] = useState<Date>(() =>
    startOfDay(new Date()),
  )

  const [selection, setSelection] = useState<BookingSelection | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const [locationRoom, setLocationRoom] = useState<Room | null>(null)
  const [locationOpen, setLocationOpen] = useState(false)

  // Only bookings on the selected day are relevant to the current grid.
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
    window.alert(
      `Phòng đã bị trùng lịch!\n\nCuộc họp: ${booking.title}\nNgười đặt: ${booking.bookerName} (${booking.email})\nPhòng ban: ${booking.department}\nKhung giờ: ${formatRange(booking.start_time, booking.end_time)}`,
    )
  }

  function handleViewLocation(room: Room) {
    setLocationRoom(room)
    setLocationOpen(true)
  }

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

    // Reject bookings that would extend past the end of the grid (18:00).
    if (getSlotIndexFromISO(start_time) + data.durationMinutes / 30 > TOTAL_SLOTS) {
      return {
        ok: false,
        error: "Thời lượng vượt quá khung giờ làm việc (kết thúc 18:00).",
      }
    }

    // Conflict validation against existing bookings for the same room.
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
    }
    setBookings((prev) => [...prev, newBooking])
    setModalOpen(false)
    setSelection(null)
    return { ok: true }
  }

  /**
   * Build the ordered list of cells for a room row. Booked blocks span
   * multiple columns; occupied slots are skipped so the grid stays aligned.
   */
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

  // Fixed room-label column + one column per 30-minute slot.
  const gridTemplateColumns = `220px repeat(${TOTAL_SLOTS}, minmax(96px, 1fr))`

  return (
    <div className="flex flex-col gap-4">
      <DateNavigator selectedDate={selectedDate} onChange={setSelectedDate} />

      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
        <div className="min-w-max">
          {/* Header row: 30-minute time slots */}
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

          {/* Room rows */}
          {ROOMS.map((room) => (
            <div key={room.id} className="grid" style={{ gridTemplateColumns }}>
              <div className="sticky left-0 z-10">
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

      <RoomLocationModal
        room={locationRoom}
        open={locationOpen}
        onOpenChange={setLocationOpen}
      />
    </div>
  )
}
