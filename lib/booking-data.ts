export type Room = {
  id: string
  name: string
  floor: string
  capacity: number
}

export type Booking = {
  id: string
  roomId: string
  /** Hour in 24h format, e.g. 9 means the 9:00 - 10:00 slot */
  hour: number
  title: string
  email: string
  syncGaroon: boolean
}

/** Meeting rooms (Y axis) */
export const ROOMS: Room[] = [
  { id: "room-large", name: "Phòng họp Lớn", floor: "Tầng 2", capacity: 20 },
  { id: "room-brainstorm", name: "Phòng Brainstorm", floor: "Tầng 3", capacity: 8 },
  { id: "room-focus", name: "Phòng Focus", floor: "Tầng 2", capacity: 4 },
  { id: "room-meeting-a", name: "Phòng họp A", floor: "Tầng 3", capacity: 12 },
]

/** Time slots (X axis): 8:00 -> 18:00, one hour each */
export const START_HOUR = 8
export const END_HOUR = 18

export const HOURS: number[] = Array.from(
  { length: END_HOUR - START_HOUR },
  (_, i) => START_HOUR + i,
)

export function formatHour(hour: number): string {
  return `${hour.toString().padStart(2, "0")}:00`
}

export function formatSlot(hour: number): string {
  return `${formatHour(hour)} - ${formatHour(hour + 1)}`
}

/** Initial mock bookings so the grid is populated on first render */
export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: "b1",
    roomId: "room-large",
    hour: 9,
    title: "Họp giao ban đầu tuần",
    email: "manager@company.com",
    syncGaroon: true,
  },
  {
    id: "b2",
    roomId: "room-large",
    hour: 14,
    title: "Demo sản phẩm Q2",
    email: "product@company.com",
    syncGaroon: false,
  },
  {
    id: "b3",
    roomId: "room-brainstorm",
    hour: 10,
    title: "Lên ý tưởng campaign",
    email: "marketing@company.com",
    syncGaroon: true,
  },
  {
    id: "b4",
    roomId: "room-focus",
    hour: 13,
    title: "1:1 với mentor",
    email: "an.nguyen@company.com",
    syncGaroon: false,
  },
  {
    id: "b5",
    roomId: "room-meeting-a",
    hour: 11,
    title: "Review code sprint 12",
    email: "dev.team@company.com",
    syncGaroon: true,
  },
  {
    id: "b6",
    roomId: "room-meeting-a",
    hour: 16,
    title: "Phỏng vấn ứng viên BE",
    email: "hr@company.com",
    syncGaroon: true,
  },
]
