"use client"

import { useState } from "react"
import { Check, ChevronsUpDown, User2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { USERS, type User } from "@/lib/booking-data"

type UserComboboxProps = {
  value: User | null
  onSelect: (user: User) => void
}

export function UserCombobox({ value, onSelect }: UserComboboxProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            aria-expanded={open}
            className="w-full justify-between font-normal"
          >
            {value ? (
              <span className="flex min-w-0 items-center gap-2">
                <User2 className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <span className="truncate">
                  {value.fullName}
                  <span className="text-muted-foreground"> · {value.email}</span>
                </span>
              </span>
            ) : (
              <span className="text-muted-foreground">
                Tìm theo tên hoặc email...
              </span>
            )}
            <ChevronsUpDown className="size-4 shrink-0 opacity-50" aria-hidden="true" />
          </Button>
        }
      />
      <PopoverContent className="w-(--anchor-width) p-0" align="start">
        <Command
          filter={(itemValue, search) =>
            itemValue.toLowerCase().includes(search.toLowerCase()) ? 1 : 0
          }
        >
          <CommandInput placeholder="Nhập tên hoặc email..." />
          <CommandList>
            <CommandEmpty>Không tìm thấy nhân viên.</CommandEmpty>
            <CommandGroup>
              {USERS.map((user) => (
                <CommandItem
                  key={user.id}
                  // Searchable text: name + email + department
                  value={`${user.fullName} ${user.email} ${user.department}`}
                  onSelect={() => {
                    onSelect(user)
                    setOpen(false)
                  }}
                  className="flex items-center gap-2"
                >
                  <Check
                    className={cn(
                      "size-4 shrink-0",
                      value?.id === user.id ? "opacity-100" : "opacity-0",
                    )}
                    aria-hidden="true"
                  />
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate text-sm font-medium text-foreground">
                      {user.fullName}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user.email} · {user.position}, {user.department}
                    </span>
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
