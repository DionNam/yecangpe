'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { useDebouncedCallback } from 'use-debounce'
import { JOB_TYPES, CATEGORIES, KOREAN_LEVELS, ENGLISH_LEVELS, NATIONALITIES, COUNTRIES } from '@repo/lib'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

export function JobListFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Read all filter values from URL
  const keyword = searchParams.get('q') || ''
  const jobTypes = searchParams.get('job_type')?.split(',').filter(Boolean) || []
  const locationTypes = searchParams.get('location_type')?.split(',').filter(Boolean) || []
  const nationality = searchParams.get('nationality') || 'all'
  const locationCountry = searchParams.get('location_country') || 'all'
  const category = searchParams.get('category') || 'all'
  const koreanLevel = searchParams.get('korean_level') || 'all'
  const englishLevel = searchParams.get('english_level') || 'all'
  const sortBy = searchParams.get('sort') || 'latest'

  // Single-select filter handler
  const handleFilterChange = (param: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== 'all') {
      params.set(param, value)
    } else {
      params.delete(param)
    }
    params.delete('page') // Always reset page
    router.push(`/jobs?${params.toString()}`)
  }

  // Multi-select checkbox handler
  const handleMultiToggle = (param: string, code: string) => {
    const params = new URLSearchParams(searchParams.toString())
    const current = params.get(param)?.split(',').filter(Boolean) || []
    const updated = current.includes(code)
      ? current.filter(t => t !== code)
      : [...current, code]
    if (updated.length > 0) {
      params.set(param, updated.join(','))
    } else {
      params.delete(param)
    }
    params.delete('page')
    router.push(`/jobs?${params.toString()}`)
  }

  // Keyword search handler with debounce
  const handleKeywordChange = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value.trim()) {
      params.set('q', value.trim())
      // When keyword is present, allow relevance sort
      if (params.get('sort') === 'relevance' || !params.has('sort')) {
        params.set('sort', 'relevance')
      }
    } else {
      params.delete('q')
      // Remove relevance sort if keyword is cleared
      if (params.get('sort') === 'relevance') {
        params.delete('sort')
      }
    }
    params.delete('page')
    router.push(`/jobs?${params.toString()}`)
  }, 300)

  // Reset all filters
  const handleResetFilters = () => {
    router.push('/jobs')
  }

  // Check if any filters are active
  const hasActiveFilters = keyword || jobTypes.length > 0 || locationTypes.length > 0 ||
    (nationality && nationality !== 'all') || (locationCountry && locationCountry !== 'all') ||
    (category && category !== 'all') || (koreanLevel && koreanLevel !== 'all') ||
    (englishLevel && englishLevel !== 'all')

  return (
    <div className="space-y-6">
      {/* Keyword Search - Full width */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="직무명, 회사명, 키워드로 검색하세요..."
          defaultValue={keyword}
          onChange={(e) => handleKeywordChange(e.target.value)}
          className="w-full h-11 pl-10 pr-4 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm"
        />
      </div>

      {/* Filter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 고용 형태 (Job Type) - Multi-select checkboxes */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-700">고용 형태</label>
          <div className="space-y-2">
            {JOB_TYPES.map(type => (
              <div key={type.code} className="flex items-center space-x-2">
                <Checkbox
                  id={`job_type_${type.code}`}
                  checked={jobTypes.includes(type.code)}
                  onCheckedChange={() => handleMultiToggle('job_type', type.code)}
                />
                <label
                  htmlFor={`job_type_${type.code}`}
                  className="text-sm text-slate-600 cursor-pointer"
                >
                  {type.nameKo}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* 근무 형태 (Work Location Type) - Multi-select checkboxes */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-700">근무 형태</label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="location_type_remote"
                checked={locationTypes.includes('remote')}
                onCheckedChange={() => handleMultiToggle('location_type', 'remote')}
              />
              <label htmlFor="location_type_remote" className="text-sm text-slate-600 cursor-pointer">
                원격근무
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="location_type_hybrid"
                checked={locationTypes.includes('hybrid')}
                onCheckedChange={() => handleMultiToggle('location_type', 'hybrid')}
              />
              <label htmlFor="location_type_hybrid" className="text-sm text-slate-600 cursor-pointer">
                하이브리드
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="location_type_on_site"
                checked={locationTypes.includes('on_site')}
                onCheckedChange={() => handleMultiToggle('location_type', 'on_site')}
              />
              <label htmlFor="location_type_on_site" className="text-sm text-slate-600 cursor-pointer">
                대면근무
              </label>
            </div>
          </div>
        </div>

        {/* 카테고리 (Category) - Single-select dropdown */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-700">카테고리</label>
          <Select value={category} onValueChange={(value) => handleFilterChange('category', value)}>
            <SelectTrigger className="h-10 text-sm">
              <SelectValue placeholder="전체" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              {CATEGORIES.map(cat => (
                <SelectItem key={cat.code} value={cat.code}>
                  {cat.nameKo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 한국어 레벨 (Korean Level) - Single-select dropdown */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-700">한국어 레벨</label>
          <Select value={koreanLevel} onValueChange={(value) => handleFilterChange('korean_level', value)}>
            <SelectTrigger className="h-10 text-sm">
              <SelectValue placeholder="전체" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              {KOREAN_LEVELS.filter(level => level.code !== 'not_specified').map(level => (
                <SelectItem key={level.code} value={level.code}>
                  {level.nameKo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 영어 레벨 (English Level) - Single-select dropdown */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-700">영어 레벨</label>
          <Select value={englishLevel} onValueChange={(value) => handleFilterChange('english_level', value)}>
            <SelectTrigger className="h-10 text-sm">
              <SelectValue placeholder="전체" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              {ENGLISH_LEVELS.filter(level => level.code !== 'not_specified').map(level => (
                <SelectItem key={level.code} value={level.code}>
                  {level.nameKo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 국적 (Nationality) - Single-select dropdown */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-700">국적</label>
          <Select value={nationality} onValueChange={(value) => handleFilterChange('nationality', value)}>
            <SelectTrigger className="h-10 text-sm">
              <SelectValue placeholder="전체" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              {NATIONALITIES.filter(n => n.code !== 'ANY').map(nat => (
                <SelectItem key={nat.code} value={nat.code}>
                  {nat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 근무 국가 (Country) - Single-select dropdown */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-700">근무 국가</label>
          <Select value={locationCountry} onValueChange={(value) => handleFilterChange('location_country', value)}>
            <SelectTrigger className="h-10 text-sm">
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

        {/* 정렬 (Sort) - Single-select dropdown */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-700">정렬</label>
          <Select value={sortBy} onValueChange={(value) => handleFilterChange('sort', value)}>
            <SelectTrigger className="h-10 text-sm">
              <SelectValue placeholder="최신순" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">최신순</SelectItem>
              {keyword && <SelectItem value="relevance">관련도순</SelectItem>}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Reset Filters Button */}
      {hasActiveFilters && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetFilters}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            필터 초기화
          </Button>
        </div>
      )}
    </div>
  )
}
