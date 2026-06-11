export type Room = {
  id: string
  name: string
  floor: string
  capacity: number
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

/* -------------------------------------------------------------------------- */
/* Time helpers: convert between grid hours and ISO strings                   */
/* -------------------------------------------------------------------------- */

/** The day the grid is currently rendering (today, at local midnight). */
export function getGridDate(): Date {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

/**
 * Convert a grid hour (e.g. 8 -> 8:00 today) into an ISO string.
 * Round-trips safely with `getHourFromISO` regardless of timezone.
 */
export function hourToISO(hour: number, base: Date = getGridDate()): string {
  const d = new Date(base)
  d.setHours(hour, 0, 0, 0)
  return d.toISOString()
}

/** Build the { start_time, end_time } ISO range for a one-hour slot. */
export function getSlotRange(
  hour: number,
  base: Date = getGridDate(),
): { start_time: string; end_time: string } {
  return {
    start_time: hourToISO(hour, base),
    end_time: hourToISO(hour + 1, base),
  }
}

/** Read the local hour (0-23) represented by an ISO string. */
export function getHourFromISO(iso: string): number {
  return new Date(iso).getHours()
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
/* Mock data (generated for today so the grid is populated on first render)   */
/* -------------------------------------------------------------------------- */

type SeedBooking = Omit<Booking, "start_time" | "end_time"> & { hour: number }

const SEED: SeedBooking[] = [
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

/** Initial mock bookings, stored as ISO strings just like PostgreSQL would. */
export const INITIAL_BOOKINGS: Booking[] = SEED.map(({ hour, ...rest }) => ({
  ...rest,
  ...getSlotRange(hour),
}))
