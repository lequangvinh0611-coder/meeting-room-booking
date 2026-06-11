"use client"

import { useState } from "react"
import { USERS, type User } from "@/lib/booking-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Edit2, Trash2, Mail, Briefcase, Building2 } from "lucide-react"

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [users, setUsers] = useState<User[]>(USERS)

  const filteredUsers = users.filter((user) =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.employeeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Quản lý Nhân viên</h1>
          <p className="text-sm text-slate-500 mt-1">
            Quản lý danh sách tài khoản, thông tin phòng ban và kết nối Cybozu.
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="size-4 mr-2" />
          Thêm nhân viên
        </Button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col w-full">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input 
              placeholder="Tìm theo tên, MSNV, email..." 
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
                <th className="px-4 py-3">MSNV</th>
                <th className="px-4 py-3">Nhân viên</th>
                <th className="px-4 py-3">Chức vụ / Phòng ban</th>
                <th className="px-4 py-3">Tài khoản Cybozu</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-900">{user.employeeCode}</td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900">{user.fullName}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <Mail className="size-3" /> {user.email}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Briefcase className="size-3.5 text-slate-400" /> {user.position}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                        <Building2 className="size-3.5" /> {user.department}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                        @{user.cybozuAccount}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                          <Edit2 className="size-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50">
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">Không tìm thấy dữ liệu.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* --- VIEW MOBILE (CARD LIST) --- */}
        <div className="md:hidden flex flex-col divide-y divide-slate-100 w-full">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div key={user.id} className="p-4 flex flex-col gap-3 bg-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-slate-900">{user.fullName}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5"><Mail className="size-3"/> {user.email}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600"><Edit2 className="size-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600"><Trash2 className="size-4" /></Button>
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <div className="flex flex-col gap-1 text-sm text-slate-600">
                    <span className="flex items-center gap-1.5"><Briefcase className="size-3.5 text-slate-400"/> {user.position}</span>
                    <span className="flex items-center gap-1.5"><Building2 className="size-3.5 text-slate-400"/> {user.department}</span>
                  </div>
                  <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-[10px] font-bold tracking-wide">
                    {user.employeeCode}
                  </span>
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
