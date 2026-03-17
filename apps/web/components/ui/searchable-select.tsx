'use client'

import * as React from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface SearchableSelectItem {
  code: string
  name: string
  nameEn: string
}

interface SearchableSelectProps {
  items: readonly SearchableSelectItem[]
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  disabled?: boolean
  className?: string
}

export function SearchableSelect({
  items,
  value,
  onValueChange,
  placeholder = 'Select...',
  searchPlaceholder = 'Search...',
  emptyText = 'No results found.',
  disabled = false,
  className,
}: SearchableSelectProps) {
  const { language } = useTranslation()
  const [open, setOpen] = React.useState(false)

  const selectedItem = items.find(item => item.code === value)
  const displayValue = selectedItem
    ? language === 'ko'
      ? `${selectedItem.name} (${selectedItem.nameEn})`
      : `${selectedItem.nameEn} (${selectedItem.name})`
    : null

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            'w-full justify-between font-normal',
            !value && 'text-muted-foreground',
            className,
          )}
        >
          <span className="truncate">
            {displayValue || placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command
          filter={(value, search) => {
            const item = items.find(i => i.code === value)
            if (!item) return 0
            const searchLower = search.toLowerCase()
            if (item.name.toLowerCase().includes(searchLower)) return 1
            if (item.nameEn.toLowerCase().includes(searchLower)) return 1
            if (item.code.toLowerCase().includes(searchLower)) return 1
            return 0
          }}
        >
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {items.map(item => (
                <CommandItem
                  key={item.code}
                  value={item.code}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? '' : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === item.code ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  <span>{language === 'ko' ? item.name : item.nameEn}</span>
                  <span className="ml-1 text-muted-foreground text-xs">
                    ({language === 'ko' ? item.nameEn : item.name})
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
