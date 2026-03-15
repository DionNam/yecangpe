'use client'

import { useState, useEffect, useCallback } from 'react'
import { getSeekers, type SeekerFilters } from '@/app/actions/employer'
import { SeekerCard } from './seeker-card'
import { SeekerFilters as SeekerFiltersComponent } from './seeker-filters'
import { Loader2, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useTranslation } from '@/lib/i18n'

export function SeekerBrowseSection() {
  const { t } = useTranslation()
  const [seekers, setSeekers] = useState<any[]>([])
  const [filters, setFilters] = useState<SeekerFilters>({})
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadSeekers()
  }, [filters])

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      loadSeekers()
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  async function loadSeekers() {
    setLoading(true)
    setError(null)
    try {
      const result = await getSeekers({ ...filters, search: search || undefined })
      if (result.error) {
        setError(result.error)
      } else {
        setSeekers(result.seekers)
      }
    } catch (err) {
      setError('구직자 목록을 불러오는데 실패했습니다.')
      console.error('loadSeekers error:', err)
    }
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t('employerDashboard.talentTitle')}</h2>
          <p className="text-sm text-gray-500 mt-1">{t('employerDashboard.talentSubtitle')}</p>
        </div>
        {!loading && (
          <p className="text-sm text-gray-500">
            {t('employerDashboard.talentCount').replace('{count}', String(seekers.length))}
          </p>
        )}
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          className="pl-9"
          placeholder={t('employerDashboard.searchPlaceholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Filter UI */}
      <SeekerFiltersComponent filters={filters} onFilterChange={setFilters} />

      {error && (
        <div className="bg-red-50 text-red-800 rounded-lg p-4 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : seekers.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-gray-500">{t('employerDashboard.noTalent')}</p>
          <p className="text-sm text-gray-400 mt-2">{t('employerDashboard.noTalentSubtitle')}</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {seekers.map(seeker => (
            <SeekerCard key={seeker.id} seeker={seeker} />
          ))}
        </div>
      )}
    </div>
  )
}
