'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, SlidersHorizontal, ChevronRight, ChevronDown, Check, X } from 'lucide-react'
import { useDebouncedCallback } from 'use-debounce'
import { JOB_TYPES, CATEGORIES, KOREAN_LEVELS, ENGLISH_LEVELS, NATIONALITIES, COUNTRIES } from '@repo/lib'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useTranslation } from '@/lib/i18n'
import { localizeItems } from '@/lib/i18n/constants'

/* ─── Pill trigger (shared style matching the screenshot) ─── */
function FilterPill({
  label,
  active,
  onClick,
  hasChevron = true,
  children,
}: {
  label: string
  active: boolean
  onClick?: () => void
  hasChevron?: boolean
  children?: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1 whitespace-nowrap px-4 py-2 rounded-full text-sm transition-all shrink-0 ${
        active
          ? 'border-2 border-gray-900 text-gray-900 font-semibold bg-white'
          : 'border border-gray-200 text-gray-600 font-medium bg-white hover:border-gray-400'
      }`}
    >
      {children}
      {label}
      {hasChevron && <ChevronDown className="w-3.5 h-3.5 ml-0.5 opacity-60" />}
    </button>
  )
}

/* ─── Multi-select dropdown content ─── */
function MultiSelectContent({
  items,
  selected,
  onToggle,
}: {
  items: Array<{ code: string; nameKo: string }>
  selected: string[]
  onToggle: (code: string) => void
}) {
  return (
    <div className="py-1">
      {items.map(item => {
        const isSelected = selected.includes(item.code)
        return (
          <button
            key={item.code}
            onClick={() => onToggle(item.code)}
            className="flex items-center gap-2.5 w-full px-3 py-2 text-sm hover:bg-gray-50 transition-colors text-left"
          >
            <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
              isSelected ? 'bg-gray-900 border-gray-900' : 'border-gray-300'
            }`}>
              {isSelected && <Check className="w-3 h-3 text-white" />}
            </div>
            <span className={isSelected ? 'text-gray-900 font-medium' : 'text-gray-600'}>
              {item.nameKo}
            </span>
          </button>
        )
      })}
    </div>
  )
}

/* ─── Single-select dropdown content ─── */
function SingleSelectContent({
  items,
  selected,
  onSelect,
  allLabel = '전체',
}: {
  items: Array<{ code: string; nameKo?: string; name?: string }>
  selected: string
  onSelect: (code: string) => void
  allLabel?: string
}) {
  return (
    <div className="py-1 max-h-64 overflow-y-auto">
      <button
        onClick={() => onSelect('all')}
        className="flex items-center gap-2.5 w-full px-3 py-2 text-sm hover:bg-gray-50 transition-colors text-left"
      >
        <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
          selected === 'all' ? 'border-gray-900' : 'border-gray-300'
        }`}>
          {selected === 'all' && <div className="w-2 h-2 rounded-full bg-gray-900" />}
        </div>
        <span className={selected === 'all' ? 'text-gray-900 font-medium' : 'text-gray-600'}>
          {allLabel}
        </span>
      </button>
      {items.map(item => {
        const isSelected = selected === item.code
        const displayName = item.nameKo || item.name || item.code
        return (
          <button
            key={item.code}
            onClick={() => onSelect(item.code)}
            className="flex items-center gap-2.5 w-full px-3 py-2 text-sm hover:bg-gray-50 transition-colors text-left"
          >
            <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
              isSelected ? 'border-gray-900' : 'border-gray-300'
            }`}>
              {isSelected && <div className="w-2 h-2 rounded-full bg-gray-900" />}
            </div>
            <span className={isSelected ? 'text-gray-900 font-medium' : 'text-gray-600'}>
              {displayName}
            </span>
          </button>
        )
      })}
    </div>
  )
}

const FILTER_STORAGE_KEY = 'hanguljobs-job-filters'
const FILTER_PARAMS = ['job_type', 'location_type', 'nationality', 'location_country', 'category', 'korean_level', 'english_level']

function saveFilters(params: URLSearchParams) {
  const toSave = new URLSearchParams()
  FILTER_PARAMS.forEach(k => { if (params.has(k)) toSave.set(k, params.get(k)!) })
  localStorage.setItem(FILTER_STORAGE_KEY, toSave.toString())
}

/* ─── Main component ─── */
export function JobListFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const { t, language } = useTranslation()

  // On first load with no URL filters, apply saved filters from localStorage
  useEffect(() => {
    const hasUrlFilters = FILTER_PARAMS.some(k => searchParams.has(k))
    if (hasUrlFilters) return

    const stored = localStorage.getItem(FILTER_STORAGE_KEY)
    if (stored) {
      router.replace(`/jobs?${stored}`)
    }
    // No automatic country filter - let user choose
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Localized filter items
  const localizedJobTypes = localizeItems(JOB_TYPES, language)
  const localizedCategories = localizeItems(CATEGORIES, language)
  const localizedKoreanLevels = localizeItems(KOREAN_LEVELS, language)
  const localizedEnglishLevels = localizeItems(ENGLISH_LEVELS, language)
  const localizedNationalities = localizeItems(NATIONALITIES, language)
  const localizedCountries = localizeItems(COUNTRIES, language)

  const LOCATION_TYPES = [
    { code: 'remote', nameKo: t('filters.remote') },
    { code: 'hybrid', nameKo: t('filters.hybrid') },
    { code: 'on_site', nameKo: t('filters.onSite') },
  ]

  const SORT_OPTIONS = [
    { code: 'latest', nameKo: t('filters.latest') },
    { code: 'popular', nameKo: t('filters.popular') },
  ]

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

  // Check if any filters are active
  const hasActiveFilters = keyword || jobTypes.length > 0 || locationTypes.length > 0 ||
    (nationality !== 'all') || (locationCountry !== 'all') ||
    (category !== 'all') || (koreanLevel !== 'all') ||
    (englishLevel !== 'all')

  // Scroll overflow detection
  const checkScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollRight(el.scrollWidth - el.scrollLeft - el.clientWidth > 1)
  }, [])

  useEffect(() => {
    checkScroll()
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', checkScroll, { passive: true })
    window.addEventListener('resize', checkScroll)
    return () => {
      el.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [checkScroll])

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 200, behavior: 'smooth' })
  }

  // ─── Handlers ───
  const handleFilterChange = (param: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== 'all') {
      params.set(param, value)
    } else {
      params.delete(param)
    }
    params.delete('page')
    saveFilters(params)
    router.push(`/jobs?${params.toString()}`)
  }

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
    saveFilters(params)
    router.push(`/jobs?${params.toString()}`)
  }

  const handleKeywordChange = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value.trim()) {
      params.set('q', value.trim())
      if (params.get('sort') === 'relevance' || !params.has('sort')) {
        params.set('sort', 'relevance')
      }
    } else {
      params.delete('q')
      if (params.get('sort') === 'relevance') {
        params.delete('sort')
      }
    }
    params.delete('page')
    router.push(`/jobs?${params.toString()}`)
  }, 300)

  const handleResetFilters = () => {
    localStorage.removeItem(FILTER_STORAGE_KEY)
    router.push('/jobs')
  }

  // ─── Label helpers ───
  const jobTypeLabel = jobTypes.length > 0
    ? jobTypes.length === 1
      ? localizedJobTypes.find(t => t.code === jobTypes[0])?.nameKo || t('filters.jobType')
      : `${t('filters.jobType')} ${jobTypes.length}`
    : t('filters.jobType')

  const locationTypeLabel = locationTypes.length > 0
    ? locationTypes.length === 1
      ? LOCATION_TYPES.find(lt => lt.code === locationTypes[0])?.nameKo || t('filters.locationType')
      : `${t('filters.locationType')} ${locationTypes.length}`
    : t('filters.locationType')

  const categoryLabel = category !== 'all'
    ? localizedCategories.find(c => c.code === category)?.nameKo || t('filters.category')
    : t('filters.category')

  const countryLabel = locationCountry !== 'all'
    ? localizedCountries.find(c => c.code === locationCountry)?.nameKo || t('filters.country')
    : t('filters.country')

  const koreanLabel = koreanLevel !== 'all'
    ? localizedKoreanLevels.find(l => l.code === koreanLevel)?.nameKo || t('filters.korean')
    : t('filters.korean')

  const englishLabel = englishLevel !== 'all'
    ? localizedEnglishLevels.find(l => l.code === englishLevel)?.nameKo || t('filters.english')
    : t('filters.english')

  const nationalityLabel = nationality !== 'all'
    ? localizedNationalities.find(n => n.code === nationality)?.nameKo || t('filters.nationality')
    : t('filters.nationality')

  const sortLabel = SORT_OPTIONS.find(s => s.code === sortBy)?.nameKo || t('filters.latest')

  return (
    <div className="space-y-3">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder={t('filters.searchPlaceholder')}
          defaultValue={keyword}
          onChange={(e) => handleKeywordChange(e.target.value)}
          className="w-full h-11 pl-10 pr-4 rounded-full border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 text-sm transition-all"
        />
      </div>

      {/* Filter pills row — single horizontal scrollable line */}
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex items-center gap-2 overflow-x-auto scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Reset */}
          <button
            onClick={handleResetFilters}
            className={`inline-flex items-center gap-1.5 whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all shrink-0 border ${
              hasActiveFilters
                ? 'border-2 border-gray-900 text-gray-900 bg-white'
                : 'border-gray-200 text-gray-600 bg-white hover:border-gray-400'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            {t('filters.resetAll')}
          </button>

          {/* 고용 형태 */}
          <Popover>
            <PopoverTrigger asChild>
              <div><FilterPill label={jobTypeLabel} active={jobTypes.length > 0} /></div>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-0" align="start">
              <MultiSelectContent
                items={localizedJobTypes}
                selected={jobTypes}
                onToggle={(code) => handleMultiToggle('job_type', code)}
              />
            </PopoverContent>
          </Popover>

          {/* 근무 형태 */}
          <Popover>
            <PopoverTrigger asChild>
              <div><FilterPill label={locationTypeLabel} active={locationTypes.length > 0} /></div>
            </PopoverTrigger>
            <PopoverContent className="w-44 p-0" align="start">
              <MultiSelectContent
                items={LOCATION_TYPES}
                selected={locationTypes}
                onToggle={(code) => handleMultiToggle('location_type', code)}
              />
            </PopoverContent>
          </Popover>

          {/* 카테고리 */}
          <Popover>
            <PopoverTrigger asChild>
              <div><FilterPill label={categoryLabel} active={category !== 'all'} /></div>
            </PopoverTrigger>
            <PopoverContent className="w-52 p-0" align="start">
              <SingleSelectContent
                items={localizedCategories}
                selected={category}
                onSelect={(code) => handleFilterChange('category', code)}
                allLabel={t('filters.allCategory')}
              />
            </PopoverContent>
          </Popover>

          {/* 근무 국가 */}
          <Popover>
            <PopoverTrigger asChild>
              <div><FilterPill label={countryLabel} active={locationCountry !== 'all'} /></div>
            </PopoverTrigger>
            <PopoverContent className="w-52 p-0" align="start">
              <SingleSelectContent
                items={localizedCountries}
                selected={locationCountry}
                onSelect={(code) => handleFilterChange('location_country', code)}
                allLabel={t('filters.allCountry')}
              />
            </PopoverContent>
          </Popover>

          {/* 한국어 */}
          <Popover>
            <PopoverTrigger asChild>
              <div><FilterPill label={koreanLabel} active={koreanLevel !== 'all'} /></div>
            </PopoverTrigger>
            <PopoverContent className="w-44 p-0" align="start">
              <SingleSelectContent
                items={localizedKoreanLevels.filter(l => l.code !== 'not_specified')}
                selected={koreanLevel}
                onSelect={(code) => handleFilterChange('korean_level', code)}
                allLabel={t('filters.allKorean')}
              />
            </PopoverContent>
          </Popover>

          {/* 영어 */}
          <Popover>
            <PopoverTrigger asChild>
              <div><FilterPill label={englishLabel} active={englishLevel !== 'all'} /></div>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-0" align="start">
              <SingleSelectContent
                items={localizedEnglishLevels.filter(l => l.code !== 'not_specified')}
                selected={englishLevel}
                onSelect={(code) => handleFilterChange('english_level', code)}
                allLabel={t('filters.allEnglish')}
              />
            </PopoverContent>
          </Popover>

          {/* 국적 */}
          <Popover>
            <PopoverTrigger asChild>
              <div><FilterPill label={nationalityLabel} active={nationality !== 'all'} /></div>
            </PopoverTrigger>
            <PopoverContent className="w-52 p-0" align="start">
              <SingleSelectContent
                items={localizedNationalities.filter(n => n.code !== 'ANY')}
                selected={nationality}
                onSelect={(code) => handleFilterChange('nationality', code)}
                allLabel={t('filters.allNationality')}
              />
            </PopoverContent>
          </Popover>

          {/* 정렬 */}
          <Popover>
            <PopoverTrigger asChild>
              <div><FilterPill label={sortLabel} active={sortBy !== 'latest'} /></div>
            </PopoverTrigger>
            <PopoverContent className="w-36 p-0" align="start">
              <SingleSelectContent
                items={[
                  ...SORT_OPTIONS,
                  ...(keyword ? [{ code: 'relevance', nameKo: t('filters.relevance') }] : []),
                ]}
                selected={sortBy}
                onSelect={(code) => handleFilterChange('sort', code === 'all' ? 'latest' : code)}
                allLabel={t('filters.latest')}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Right scroll fade + arrow */}
        {canScrollRight && (
          <button
            onClick={scrollRight}
            className="absolute right-0 top-0 bottom-0 w-12 flex items-center justify-end bg-gradient-to-l from-slate-50 via-slate-50/90 to-transparent"
          >
            <div className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center shadow-sm">
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </div>
          </button>
        )}
      </div>
    </div>
  )
}
