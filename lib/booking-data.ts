export type Room = {
  id: string
  name: string
  floor: string
  capacity: number
  location: string
  mapImage?: string
}

export type User = {
  id: string
  fullName: string
  email: string
  employeeCode: string
  position: string
  department: string
  cybozuAccount: string
}

export type AuditEntry = {
  id: string
  timestamp: string
  actor: string
  action: string
}

export type Booking = {
  id: string
  roomId: string
  start_time: string
  end_time: string
  title: string
  email: string
  bookerName: string
  department: string
  syncGaroon: boolean
  auditLog: AuditEntry[]
}

// Bổ sung mapImage cho mock data
export const ROOMS: Room[] = [
  { id: "r1", name: "Phòng họp Lớn", floor: "Tầng 2", capacity: 20, location: "Tầng 2, Cánh Đông, cạnh khu vực lễ tân chính.", mapImage: "/location.png" },
  { id: "r2", name: "Phòng Brainstorm", floor: "Tầng 3", capacity: 8, location: "Tầng 3, gần khu pantry, đối diện thang máy.", mapImage: "/location.png" },
  { id: "r3", name: "Phòng Focus", floor: "Tầng 2", capacity: 4, location: "Tầng 2, cánh Tây, cuối hành lang phòng kỹ thuật.", mapImage: "/location.png" },
  { id: "r4", name: "Phòng họp A", floor: "Tầng 3", capacity: 12, location: "Tầng 3, cánh Nam, cạnh phòng họp Ban Giám đốc.", mapImage: "/location.png" },
]

export const USERS: User[] = [
  { id: "u1", fullName: "Nguyễn Văn An", email: "an.nguyen@company.com", employeeCode: "NV001", position: "Trưởng phòng", department: "Kỹ thuật", cybozuAccount: "an.nguyen" },
  { id: "u2", fullName: "Trần Thị Bình", email: "binh.tran@company.com", employeeCode: "NV002", position: "Chuyên viên", department: "Marketing", cybozuAccount: "binh.tran" },
  { id: "u3", fullName: "Lê Hoàng Cường", email: "cuong.le@company.com", employeeCode: "NV003", position: "Giám đốc sản phẩm", department: "Sản phẩm", cybozuAccount: "cuong.le" },
  { id: "u4", fullName: "Phạm Thị Dung", email: "dung.pham@company.com", employeeCode: "NV004", position: "Quản lý nhân sự", department: "Nhân sự", cybozuAccount: "dung.pham" },
  { id: "u5", fullName: "Vũ Minh Đức", email: "duc.vu@company.com", employeeCode: "NV005", position: "Kỹ sư phần mềm", department: "Kỹ thuật", cybozuAccount: "duc.vu" },
  { id: "u6", fullName: "Hoàng Thị Em", email: "em.hoang@company.com", employeeCode: "NV006", position: "Kế toán trưởng", department: "Tài chính", cybozuAccount: "em.hoang" },
  { id: "u7", fullName: "Đặng Văn Phúc", email: "phuc.dang@company.com", employeeCode: "NV007", position: "Chuyên viên tuyển dụng", department: "Nhân sự", cybozuAccount: "phuc.dang" },
  { id: "u8", fullName: "Bùi Thị Giang", email: "giang.bui@company.com", employeeCode: "NV008", position: "Trưởng nhóm Design", department: "Sản phẩm", cybozuAccount: "giang.bui" },
]

export function startOfDay(date: Date): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

export const INITIAL_BOOKINGS: Booking[] = [
    { id: "b1", roomId: "r1", start_time: startOfDay(new Date()).toISOString().split('T')[0] + "T09:00:00", end_time: startOfDay(new Date()).toISOString().split('T')[0] + "T10:00:00", title: "Họp giao ban đầu tuần", email: "an.nguyen@company.com", bookerName: "Nguyễn Văn An", department: "Kỹ thuật", syncGaroon: true, auditLog: [] },
    { id: "b2", roomId: "r2", start_time: startOfDay(new Date()).toISOString().split('T')[0] + "T10:30:00", end_time: startOfDay(new Date()).toISOString().split('T')[0] + "T11:00:00", title: "Lên ý tưởng thiết kế", email: "binh.tran@company.com", bookerName: "Trần Thị Bình", department: "Marketing", syncGaroon: true, auditLog: [] },
    { id: "b3", roomId: "r3", start_time: startOfDay(new Date()).toISOString().split('T')[0] + "T13:00:00", end_time: startOfDay(new Date()).toISOString().split('T')[0] + "T14:00:00", title: "1:1 với mentor", email: "duc.vu@company.com", bookerName: "Vũ Minh Đức", department: "Kỹ thuật", syncGaroon: false, auditLog: [] },
    { id: "b4", roomId: "r4", start_time: startOfDay(new Date()).toISOString().split('T')[0] + "T11:00:00", end_time: startOfDay(new Date()).toISOString().split('T')[0] + "T13:00:00", title: "Review code sprint 12", email: "duc.vu@company.com", bookerName: "Vũ Minh Đức", department: "Kỹ thuật", syncGaroon: true, auditLog: [] }
]

export const TOTAL_SLOTS = 20
export const SLOTS = Array.from({ length: TOTAL_SLOTS }, (_, i) => i * 30 + 8 * 60)

export function formatMinutes(totalMinutes: number) {
  const h = Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`
}

export function formatRange(startIso: string, endIso: string) {
  const s = new Date(startIso)
  const e = new Date(endIso)
  const hhmm = (d: Date) => `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`
  return `${hhmm(s)} - ${hhmm(e)}`
}

export function getSlotIndexFromISO(iso: string) {
  const d = new Date(iso)
  const mins = d.getHours() * 60 + d.getMinutes()
  return (mins - 8 * 60) / 30
}

export function getDurationSlots(startIso: string, endIso: string) {
  const s = new Date(startIso).getTime()
  const e = new Date(endIso).getTime()
  return Math.round((e - s) / 60000 / 30)
}

export function isSameDay(iso1: string, date2: Date) {
  const d1 = new Date(iso1)
  return d1.getFullYear() === date2.getFullYear() && d1.getMonth() === date2.getMonth() && d1.getDate() === date2.getDate()
}

export function getRangeFromSlot(slotIndex: number, durationMinutes: number, date: Date) {
  const startMins = 8 * 60 + slotIndex * 30
  const startDate = new Date(date)
  startDate.setHours(Math.floor(startMins / 60), startMins % 60, 0, 0)
  const endDate = new Date(startDate)
  endDate.setMinutes(endDate.getMinutes() + durationMinutes)
  return { start_time: startDate.toISOString(), end_time: endDate.toISOString() }
}

export function isOverlapping(start1: string, end1: string, start2: string, end2: string) {
  return new Date(start1) < new Date(end2) && new Date(end1) > new Date(start2)
}

export const DURATION_OPTIONS = [
  { label: "30 phút", value: 30 },
  { label: "1 giờ", value: 60 },
  { label: "1.5 giờ", value: 90 },
  { label: "2 giờ", value: 120 },
  { label: "3 giờ", value: 180 },
  { label: "4 giờ", value: 240 },
  { label: "Cả ngày (8 tiếng)", value: 480 },
]

export function createAuditEntry(actor: string, action: string): AuditEntry {
  return {
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    actor,
    action,
  }
}

export function formatTimestamp(iso: string) {
  const d = new Date(iso)
  return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}, ${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getFullYear()}`
}
