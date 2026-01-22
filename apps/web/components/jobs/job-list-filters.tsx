'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { NATIONALITIES } from '@repo/lib/constants'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface JobListFiltersProps {
  currentNationality?: string
  currentSort?: string
  currentLocationType?: string
}

export function JobListFilters({
  currentNationality,
  currentSort,
  currentLocationType,
}: JobListFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleNationalityChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'all') {
      params.delete('nationality')
    } else {
      params.set('nationality', value)
    }
    // Reset to page 1 when filter changes
    params.delete('page')
    router.push(`/jobs?${params.toString()}`)
  }

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', value)
    // Reset to page 1 when sort changes
    params.delete('page')
    router.push(`/jobs?${params.toString()}`)
  }

  const handleLocationTypeChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'all') {
      params.delete('location_type')
    } else {
      params.set('location_type', value)
    }
    // Reset to page 1 when filter changes
    params.delete('page')
    router.push(`/jobs?${params.toString()}`)
  }

  return (
    <div className="flex gap-4 flex-wrap">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">국적</label>
        <Select
          value={currentNationality || 'all'}
          onValueChange={handleNationalityChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="전체" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            {NATIONALITIES.filter(n => n.code !== 'ANY').map(nationality => (
              <SelectItem key={nationality.code} value={nationality.code}>
                {nationality.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">근무 형태</label>
        <Select
          value={currentLocationType || 'all'}
          onValueChange={handleLocationTypeChange}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="전체" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            <SelectItem value="remote">원격근무</SelectItem>
            <SelectItem value="hybrid">하이브리드</SelectItem>
            <SelectItem value="on_site">대면근무</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">정렬</label>
        <Select
          value={currentSort || 'latest'}
          onValueChange={handleSortChange}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="최신순" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">최신순</SelectItem>
            <SelectItem value="popular">인기순</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
