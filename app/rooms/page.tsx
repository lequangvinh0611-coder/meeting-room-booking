
"use client"

import { useState } from "react"
import { ROOMS, type Room } from "@/lib/booking-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Edit2, Trash2, Users, MapPin, Layers } from "lucide-react"

export default function RoomsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  
  // Tạm thời dùng mock data, sau này sẽ thay bằng data fetch từ Supabase
  const [rooms, setRooms] = useState<Room[]>(ROOMS)

  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.floor.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-emerald-800">Quản lý Phòng họp</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Thiết lập danh sách phòng họp, sức chứa và vị trí hiển thị trên sơ đồ.
          </p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="size-4 mr-2" />
          Thêm phòng họp
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden flex flex-col">
        {/* Thanh công cụ tìm kiếm */}
        <div className="p-4 border-b border-border bg-muted/20 flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input 
              placeholder="Tìm theo tên phòng, tầng..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-background"
            />
          </div>
        </div>

        {/* Bảng dữ liệu */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground text-xs uppercase font-semibold">
              <tr>
                <th className="px-4 py-3">Tên Phòng</th>
                <th className="px-4 py-3">Tầng</th>
                <th className="px-4 py-3">Sức chứa</th>
                <th className="px-4 py-3 min-w-[250px]">Mô tả vị trí</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredRooms.length > 0 ? (
                filteredRooms.map((room) => (
                  <tr key={room.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 font-semibold text-foreground">
                      {room.name}
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <Layers className="size-4" /> {room.floor}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
                        <Users className="size-3.5" /> {room.capacity} người
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-start gap-1.5 text-muted-foreground text-xs">
                        <MapPin className="size-3.5 mt-0.5 shrink-0" />
                        <span className="line-clamp-2">{room.location}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                          <Edit2 className="size-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    Không tìm thấy phòng họp nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
