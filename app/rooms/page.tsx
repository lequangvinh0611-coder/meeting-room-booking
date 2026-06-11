"use client"

import { useState } from "react"
import { ROOMS, type Room } from "@/lib/booking-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Edit2, Trash2, Users, MapPin, Layers } from "lucide-react"

export default function RoomsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [rooms, setRooms] = useState<Room[]>(ROOMS)

  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.floor.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Quản lý Phòng họp</h1>
          <p className="text-sm text-slate-500 mt-1">
            Thiết lập danh sách phòng họp, sức chứa và vị trí.
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="size-4 mr-2" />
          Thêm phòng họp
        </Button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col w-full">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input 
              placeholder="Tìm theo tên phòng, tầng..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-white"
            />
          </div>
        </div>

        {/* --- VIEW DESKTOP (TABLE) --- */}
        <div className="hidden md:block overflow-x-auto no-scrollbar w-full">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
              <tr>
                <th className="px-4 py-3">Tên Phòng</th>
                <th className="px-4 py-3">Tầng</th>
                <th className="px-4 py-3">Sức chứa</th>
                <th className="px-4 py-3 w-1/3">Mô tả vị trí</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRooms.length > 0 ? (
                filteredRooms.map((room) => (
                  <tr key={room.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-900">{room.name}</td>
                    <td className="px-4 py-3"><span className="flex items-center gap-1.5 text-slate-600"><Layers className="size-4" /> {room.floor}</span></td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                        <Users className="size-3.5" /> {room.capacity} người
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-xs"><div className="flex items-start gap-1.5"><MapPin className="size-3.5 mt-0.5 shrink-0" />{room.location}</div></td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50"><Edit2 className="size-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:bg-red-50"><Trash2 className="size-4" /></Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500">Không tìm thấy dữ liệu.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* --- VIEW MOBILE (CARD LIST) --- */}
        <div className="md:hidden flex flex-col divide-y divide-slate-100 w-full">
          {filteredRooms.length > 0 ? (
            filteredRooms.map((room) => (
              <div key={room.id} className="p-4 flex flex-col gap-3 bg-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-slate-900 text-base">{room.name}</h3>
                    <div className="flex items-center gap-3 mt-1 text-xs font-medium text-slate-600">
                      <span className="flex items-center gap-1"><Layers className="size-3"/> {room.floor}</span>
                      <span className="flex items-center gap-1"><Users className="size-3"/> {room.capacity} người</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600"><Edit2 className="size-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600"><Trash2 className="size-4" /></Button>
                  </div>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs text-slate-600 flex gap-2">
                   <MapPin className="size-3.5 shrink-0 mt-0.5 text-slate-400"/>
                   <span>{room.location}</span>
                </div>
              </div>
            ))
          ) : (
             <div className="py-8 text-center text-sm text-slate-500">Không tìm thấy dữ liệu.</div>
          )}
        </div>
      </div>
    </div>
  )
}
