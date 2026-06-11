"use client"

import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  addDays,
  startOfDay,
  toDateInputValue,
  fromDateInputValue,
} from "@/lib/booking-data"

type DateNavigatorProps = {
  selectedDate: Date
  onChange: (date: Date) => void
}

export function DateNavigator({ selectedDate, onChange }: DateNavigatorProps) {
  const label = selectedDate.toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  const isToday =
    toDateInputValue(selectedDate) === toDateInputValue(new Date())

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-1.5">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => onChange(addDays(selectedDate, -1))}
          aria-label="Hôm trước"
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
        </Button>

        <div className="relative flex items-center">
          <CalendarDays
            className="pointer-events-none absolute left-3 size-4 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="date"
            value={toDateInputValue(selectedDate)}
            onChange={(e) => {
              if (e.target.value) onChange(fromDateInputValue(e.target.value))
            }}
            className="w-[170px] pl-9"
            aria-label="Chọn ngày"
          />
        </div>

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => onChange(addDays(selectedDate, 1))}
          aria-label="Hôm sau"
        >
          <ChevronRight className="size-4" aria-hidden="true" />
        </Button>
      </div>

      {!isToday && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onChange(startOfDay(new Date()))}
        >
          Về hôm nay
        </Button>
      )}

      <p className="text-sm text-muted-foreground capitalize">{label}</p>
    </div>
  )
}
