export type Room = {
  id: string
  name: string
  floor: string
  capacity: number
  /** Short description of where the room is located, for the location modal. */
  location: string
}

export type User = {
  id: string
  fullName: string
  email: string
  position: string
  department: string
}

export type Booking = {
  id: string
  roomId: string
  /** ISO 8601 string (PostgreSQL timestamptz), e.g. "2026-06-11T08:00:00.000Z" */
  start_time: string
  /** ISO 8601 string (PostgreSQL timestamptz), e.g. "2026-06-11T09:00:00.000Z" */
  end_time: string
  title: string
  email: string
  /** Full name of the booker (resolved from the user directory). */
  bookerName: string
  /** Department of the booker, shown on the grid block. */
  department: string
  syncGaroon: boolean
}

/** Meeting rooms (Y axis) */
export const ROOMS: Room[] = [
  {
    id: "room-large",
    name: "Phòng họp Lớn",
    floor: "Tầng 2",
    capacity: 20,
    location: "Tầng 2, cánh Đông, cạnh khu vực lễ tân chính.",
  },
  {
    id: "room-brainstorm",
    name: "Phòng Brainstorm",
    floor: "Tầng 3",
    capacity: 8,
    location: "Tầng 3, gần khu pantry, đối diện thang máy.",
  },
  {
    id: "room-focus",
    name: "Phòng Focus",
    floor: "Tầng 2",
    capacity: 4,
    location: "Tầng 2, cánh Tây, cuối hành lang phòng kỹ thuật.",
  },
  {
    id: "room-meeting-a",
    name: "Phòng họp A",
    floor: "Tầng 3",
    capacity: 12,
    location: "Tầng 3, cánh Nam, cạnh phòng họp Ban Giám đốc.",
  },
]

/** Mock employee directory used for the booker search/combobox. */
export const USERS: User[] = [
  { id: "u1", fullName: "Nguyễn Văn An", email: "an.nguyen@company.com", position: "Trưởng phòng", department: "Kỹ thuật" },
  { id: "u2", fullName: "Trần Thị Bình", email: "binh.tran@company.com", position: "Chuyên viên", department: "Marketing" },
  { id: "u3", fullName: "Lê Hoàng Cường", email: "cuong.le@company.com", position: "Giám đốc sản phẩm", department: "Sản phẩm" },
  { id: "u4", fullName: "Phạm Thị Dung", email: "dung.pham@company.com", position: "Quản lý nhân sự", department: "Nhân sự" },
  { id: "u5", fullName: "Vũ Minh Đức", email: "duc.vu@company.com", position: "Kỹ sư phần mềm", department: "Kỹ thuật" },
  { id: "u6", fullName: "Hoàng Thị Em", email: "em.hoang@company.com", position: "Kế toán trưởng", department: "Tài chính" },
  { id: "u7", fullName: "Đặng Văn Phúc", email: "phuc.dang@company.com", position: "Chuyên viên tuyển dụng", department: "Nhân sự" },
  { id: "u8", fullName: "Bùi Thị Giang", email: "giang.bui@company.com", position: "Trưởng nhóm Design", department: "Sản phẩm" },
]

/* -------------------------------------------------------------------------- */
/* Time grid configuration: 08:00 -> 18:00 split into 30-minute slots         */
/* -------------------------------------------------------------------------- */

export const START_HOUR = 8
export const END_HOUR = 18
export const SLOT_MINUTES = 30
/** Number of 30-minute columns across the grid (08:00–18:00 => 20 slots). */
export const TOTAL_SLOTS = ((END_HOUR - START_HOUR) * 60) / SLOT_MINUTES

/** Minutes-from-midnight for the start of each slot column. */
export const SLOTS: number[] = Array.from(
  { length: TOTAL_SLOTS },
  (_, i) => START_HOUR * 60 + i * SLOT_MINUTES,
)

/** Duration options offered in the booking modal. */
export const DURATION_OPTIONS = [
  { value: 30, label: "30 phút" },
  { value: 60, label: "1 tiếng" },
  { value: 90, label: "1 tiếng 30 phút" },
  { value: 120, label: "2 tiếng" },
]

/** Format minutes-from-midnight (e.g. 510) into "HH:MM" (e.g. "08:30"). */
export function formatMinutes(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`
}

/* -------------------------------------------------------------------------- */
/* Date helpers                                                               */
/* -------------------------------------------------------------------------- */

/** Normalise a date to local midnight. */
export function startOfDay(date: Date): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

/** Return a new date offset by `days` from the given date. */
export function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

/** Format a Date into a "YYYY-MM-DD" string for <input type="date">. */
export function toDateInputValue(date: Date): string {
  const y = date.getFullYear()
  const m = (date.getMonth() + 1).toString().padStart(2, "0")
  const d = date.getDate().toString().padStart(2, "0")
  return `${y}-${m}-${d}`
}

/** Parse a "YYYY-MM-DD" input value into a local Date at midnight. */
export function fromDateInputValue(value: string): Date {
  const [y, m, d] = value.split("-").map(Number)
  return new Date(y, m - 1, d)
}

/** True when an ISO string falls on the same calendar day as `date`. */
export function isSameDay(iso: string, date: Date): boolean {
  const a = new Date(iso)
  return (
    a.getFullYear() === date.getFullYear() &&
    a.getMonth() === date.getMonth() &&
    a.getDate() === date.getDate()
  )
}

/* -------------------------------------------------------------------------- */
/* Slot <-> ISO conversion                                                    */
/* -------------------------------------------------------------------------- */

/** Convert minutes-from-midnight on a given day into an ISO string. */
export function minutesToISO(totalMinutes: number, base: Date): string {
  const d = startOfDay(base)
  d.setMinutes(totalMinutes)
  return d.toISOString()
}

/**
 * Build the { start_time, end_time } ISO range for a booking that starts at
 * `slotIndex` on `base` and lasts `durationMinutes`.
 */
export function getRangeFromSlot(
  slotIndex: number,
  durationMinutes: number,
  base: Date,
): { start_time: string; end_time: string } {
  const startMinutes = SLOTS[slotIndex]
  return {
    start_time: minutesToISO(startMinutes, base),
    end_time: minutesToISO(startMinutes + durationMinutes, base),
  }
}

/** Read the slot index (0-based column) that an ISO start time begins at. */
export function getSlotIndexFromISO(iso: string): number {
  const d = new Date(iso)
  const minutes = d.getHours() * 60 + d.getMinutes()
  return Math.round((minutes - START_HOUR * 60) / SLOT_MINUTES)
}

/** Number of 30-minute columns a booking spans. */
export function getDurationSlots(startISO: string, endISO: string): number {
  const diffMs = new Date(endISO).getTime() - new Date(startISO).getTime()
  return Math.round(diffMs / (SLOT_MINUTES * 60 * 1000))
}

/** Human-readable "HH:MM - HH:MM" label for a booking's time range. */
export function formatRange(startISO: string, endISO: string): string {
  const s = new Date(startISO)
  const e = new Date(endISO)
  const fmt = (d: Date) =>
    `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`
  return `${fmt(s)} - ${fmt(e)}`
}

/** True when two [start, end) time ranges overlap. */
export function isOverlapping(
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string,
): boolean {
  return (
    new Date(aStart).getTime() < new Date(bEnd).getTime() &&
    new Date(bStart).getTime() < new Date(aEnd).getTime()
  )
}

/* -------------------------------------------------------------------------- */
/* Mock data (generated relative to today so the grid is populated)           */
/* -------------------------------------------------------------------------- */

type SeedBooking = {
  id: string
  roomId: string
  /** day offset relative to today (0 = today, 1 = tomorrow) */
  dayOffset: number
  startMinutes: number
  durationMinutes: number
  title: string
  userId: string
  syncGaroon: boolean
}

const SEED: SeedBooking[] = [
  { id: "b1", roomId: "room-large", dayOffset: 0, startMinutes: 9 * 60, durationMinutes: 60, title: "Họp giao ban đầu tuần", userId: "u1", syncGaroon: true },
  { id: "b2", roomId: "room-large", dayOffset: 0, startMinutes: 14 * 60, durationMinutes: 90, title: "Demo sản phẩm Q2", userId: "u3", syncGaroon: false },
  { id: "b3", roomId: "room-brainstorm", dayOffset: 0, startMinutes: 10 * 60 + 30, durationMinutes: 30, title: "Lên ý tưởng campaign", userId: "u2", syncGaroon: true },
  { id: "b4", roomId: "room-focus", dayOffset: 0, startMinutes: 13 * 60, durationMinutes: 60, title: "1:1 với mentor", userId: "u5", syncGaroon: false },
  { id: "b5", roomId: "room-meeting-a", dayOffset: 0, startMinutes: 11 * 60, durationMinutes: 120, title: "Review code sprint 12", userId: "u5", syncGaroon: true },
  { id: "b6", roomId: "room-meeting-a", dayOffset: 0, startMinutes: 16 * 60, durationMinutes: 60, title: "Phỏng vấn ứng viên BE", userId: "u7", syncGaroon: true },
  { id: "b7", roomId: "room-brainstorm", dayOffset: 1, startMinutes: 9 * 60, durationMinutes: 90, title: "Workshop thiết kế", userId: "u8", syncGaroon: true },
  { id: "b8", roomId: "room-large", dayOffset: 1, startMinutes: 15 * 60, durationMinutes: 60, title: "Họp tài chính tháng", userId: "u6", syncGaroon: false },
]

/** Initial mock bookings, stored as ISO strings just like PostgreSQL would. */
export const INITIAL_BOOKINGS: Booking[] = SEED.map((s) => {
  const base = addDays(new Date(), s.dayOffset)
  const start = startOfDay(base)
  start.setMinutes(s.startMinutes)
  const end = new Date(start)
  end.setMinutes(end.getMinutes() + s.durationMinutes)
  const user = USERS.find((u) => u.id === s.userId)
  return {
    id: s.id,
    roomId: s.roomId,
    start_time: start.toISOString(),
    end_time: end.toISOString(),
    title: s.title,
    email: user?.email ?? "",
    bookerName: user?.fullName ?? "",
    department: user?.department ?? "",
    syncGaroon: s.syncGaroon,
  }
})
