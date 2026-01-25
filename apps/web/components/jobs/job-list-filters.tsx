'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { NATIONALITIES, COUNTRIES } from '@repo/lib/constants'
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
  currentLocationCountry?: string
}

export function JobListFilters({
  currentNationality,
  currentSort,
  currentLocationType,
  currentLocationCountry,
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
      params.delete('location_country') // Clear country filter when changing location type
    } else {
      params.set('location_type', value)
      // Clear country filter if not on_site
      if (value !== 'on_site') {
        params.delete('location_country')
      }
    }
    // Reset to page 1 when filter changes
    params.delete('page')
    router.push(`/jobs?${params.toString()}`)
  }

  const handleLocationCountryChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'all') {
      params.delete('location_country')
    } else {
      params.set('location_country', value)
    }
    // Reset to page 1 when filter changes
    params.delete('page')
    router.push(`/jobs?${params.toString()}`)
  }

  return (
    <div className="grid grid-cols-2 md:flex gap-2 md:gap-4 md:flex-wrap">
      <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
        <label className="text-xs md:text-sm font-medium text-slate-600">국적</label>
        <Select
          value={currentNationality || 'all'}
          onValueChange={handleNationalityChange}
        >
          <SelectTrigger className="w-full md:w-[180px] h-9 text-sm">
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

      <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
        <label className="text-xs md:text-sm font-medium text-slate-600">근무 형태</label>
        <Select
          value={currentLocationType || 'all'}
          onValueChange={handleLocationTypeChange}
        >
          <SelectTrigger className="w-full md:w-[140px] h-9 text-sm">
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

      {/* Country filter - only show when on_site is selected */}
      {currentLocationType === 'on_site' && (
        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
          <label className="text-xs md:text-sm font-medium text-slate-600">근무 국가</label>
          <Select
            value={currentLocationCountry || 'all'}
            onValueChange={handleLocationCountryChange}
          >
            <SelectTrigger className="w-full md:w-[180px] h-9 text-sm">
              <SelectValue placeholder="전체" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              {COUNTRIES.map(country => (
                <SelectItem key={country.code} value={country.code}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
        <label className="text-xs md:text-sm font-medium text-slate-600">정렬</label>
        <Select
          value={currentSort || 'latest'}
          onValueChange={handleSortChange}
        >
          <SelectTrigger className="w-full md:w-[140px] h-9 text-sm">
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
