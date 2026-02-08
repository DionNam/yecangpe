'use client'

import { NATIONALITIES, CATEGORIES, KOREAN_LEVELS, ENGLISH_LEVELS, COUNTRIES } from '@repo/lib'
import type { SeekerFilters as SeekerFiltersType } from '@/app/actions/employer'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface SeekerFiltersProps {
  filters: SeekerFiltersType
  onFilterChange: (filters: SeekerFiltersType) => void
}

export function SeekerFilters({ filters, onFilterChange }: SeekerFiltersProps) {
  const handleChange = (key: keyof SeekerFiltersType, value: string) => {
    if (value === 'all') {
      const next = { ...filters }
      delete next[key]
      onFilterChange(next)
    } else if (key === 'preferred_location_type') {
      onFilterChange({ ...filters, [key]: value })
    } else {
      onFilterChange({ ...filters, [key]: [value] })
    }
  }

  const handleReset = () => {
    onFilterChange({})
  }

  const hasActiveFilters = Object.keys(filters).length > 0

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">필터</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs">
            <X className="w-3 h-3 mr-1" />
            초기화
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Nationality filter */}
        <Select
          value={filters.nationality?.[0] || 'all'}
          onValueChange={(v) => handleChange('nationality', v)}
        >
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="국적" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">국적 전체</SelectItem>
            {NATIONALITIES.filter(n => n.code !== 'ANY').map(n => (
              <SelectItem key={n.code} value={n.code}>{n.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Korean Level filter */}
        <Select
          value={filters.korean_level?.[0] || 'all'}
          onValueChange={(v) => handleChange('korean_level', v)}
        >
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="한국어" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">한국어 전체</SelectItem>
            {KOREAN_LEVELS.filter(l => l.code !== 'not_specified').map(l => (
              <SelectItem key={l.code} value={l.code}>{l.nameKo}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* English Level filter */}
        <Select
          value={filters.english_level?.[0] || 'all'}
          onValueChange={(v) => handleChange('english_level', v)}
        >
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="영어" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">영어 전체</SelectItem>
            {ENGLISH_LEVELS.filter(l => l.code !== 'not_specified').map(l => (
              <SelectItem key={l.code} value={l.code}>{l.nameKo}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Country of residence filter */}
        <Select
          value={filters.country_of_residence?.[0] || 'all'}
          onValueChange={(v) => handleChange('country_of_residence', v)}
        >
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="거주 국가" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">거주 국가 전체</SelectItem>
            {COUNTRIES.map(c => (
              <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
