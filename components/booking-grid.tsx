"use client"

import { useState } from "react"
import {
  ROOMS,
  HOURS,
  INITIAL_BOOKINGS,
  formatHour,
  formatSlot,
  type Booking,
} from "@/lib/booking-data"
import { RoomLabel } from "@/components/room-label"
import { BookingCell } from "@/components/booking-cell"
import { BookingModal, type BookingSelection } from "@/components/booking-modal"

export function BookingGrid() {
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS)
  const [selection, setSelection] = useState<BookingSelection | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  function findBooking(roomId: string, hour: number) {
    return bookings.find((b) => b.roomId === roomId && b.hour === hour)
  }

  function handleCellClick(roomId: string, hour: number) {
    const existing = findBooking(roomId, hour)
    if (existing) {
      // Already booked -> warn about conflict
      window.alert(
        `Phòng đã bị trùng lịch!\n\nCuộc họp: ${existing.title}\nNgười đặt: ${existing.email}\nKhung giờ: ${formatSlot(hour)}`,
      )
      return
    }
    const room = ROOMS.find((r) => r.id === roomId)
    if (!room) return
    setSelection({ room, hour })
    setModalOpen(true)
  }

  function handleConfirm(data: {
    title: string
    email: string
    syncGaroon: boolean
  }) {
    if (!selection) return
    const newBooking: Booking = {
      id: `b-${Date.now()}`,
      roomId: selection.room.id,
      hour: selection.hour,
      ...data,
    }
    setBookings((prev) => [...prev, newBooking])
    setModalOpen(false)
    setSelection(null)
  }

  // Grid template: fixed room-label column + one column per hour
  const gridTemplateColumns = `220px repeat(${HOURS.length}, minmax(120px, 1fr))`

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
      <div className="min-w-max">
        {/* Header row: time slots */}
        <div className="grid" style={{ gridTemplateColumns }}>
          <div className="sticky left-0 z-10 flex items-center border-r border-b border-border bg-muted/60 px-4 py-3 text-sm font-semibold text-foreground">
            Phòng họp
          </div>
          {HOURS.map((hour) => (
            <div
              key={hour}
              className="border-r border-b border-border bg-muted/60 px-2 py-3 text-center text-xs font-medium text-muted-foreground"
            >
              {formatHour(hour)}
            </div>
          ))}
        </div>

        {/* Room rows */}
        {ROOMS.map((room) => (
          <div
            key={room.id}
            className="grid"
            style={{ gridTemplateColumns }}
          >
            <div className="sticky left-0 z-10 min-h-[68px]">
              <RoomLabel room={room} />
            </div>
            {HOURS.map((hour) => (
              <div key={`${room.id}-${hour}`} className="min-h-[68px]">
                <BookingCell
                  booking={findBooking(room.id, hour)}
                  onClick={() => handleCellClick(room.id, hour)}
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      <BookingModal
        selection={selection}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onConfirm={handleConfirm}
      />
    </div>
  )
}
