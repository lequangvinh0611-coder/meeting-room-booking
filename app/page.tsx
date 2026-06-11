import { CalendarDays } from "lucide-react"
import { BookingGrid } from "@/components/booking-grid"

export default function Page() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header đồng nhất với các trang quản lý */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-blue-600">
            <CalendarDays className="size-6" aria-hidden="true" />
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Lịch đặt phòng
            </h1>
          </div>
          <p className="text-sm text-slate-500">
            Xem, đặt mới và quản lý lịch họp theo khung giờ thực tế.
          </p>
        </div>

        {/* Legend (Chú thích màu sắc) - Được bọc trong khung nhỏ cho gọn gàng */}
        <div className="flex items-center gap-4 text-xs font-medium text-slate-600 bg-white px-3 py-2 rounded-md border border-slate-200 shadow-sm">
          <span className="flex items-center gap-1.5">
            <span className="size-3 rounded-[3px] border border-emerald-200 bg-emerald-50" aria-hidden="true" />
            Còn trống
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-3 rounded-[3px] border border-amber-300 bg-amber-100" aria-hidden="true" />
            Đã đặt
          </span>
        </div>
      </div>

      {/* Nội dung Grid */}
      <BookingGrid />
    </div>
  )
}
