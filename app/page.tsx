import { CalendarDays } from "lucide-react"
import { BookingGrid } from "@/components/booking-grid"

export default function Page() {
  const today = new Date().toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
        <header className="mb-6 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-primary">
            <CalendarDays className="size-6" aria-hidden="true" />
            <h1 className="text-2xl font-bold text-foreground text-balance">
              Quản lý đặt phòng họp
            </h1>
          </div>
          <p className="text-sm text-muted-foreground capitalize">{today}</p>
        </header>

        {/* Legend */}
        <div className="mb-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-2">
            <span className="size-3.5 rounded-sm border border-emerald-200 bg-emerald-50" aria-hidden="true" />
            Còn trống
          </span>
          <span className="flex items-center gap-2">
            <span className="size-3.5 rounded-sm border border-amber-300 bg-amber-100" aria-hidden="true" />
            Đã đặt
          </span>
        </div>

        <BookingGrid />
      </div>
    </main>
  )
}
