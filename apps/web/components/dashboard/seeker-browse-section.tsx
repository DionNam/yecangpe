'use client'

import { useState, useEffect } from 'react'
import { getSeekers, type SeekerFilters } from '@/app/actions/employer'
import { SeekerCard } from './seeker-card'
import { Loader2 } from 'lucide-react'

export function SeekerBrowseSection() {
  const [seekers, setSeekers] = useState<any[]>([])
  const [filters, setFilters] = useState<SeekerFilters>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadSeekers()
  }, [filters])

  async function loadSeekers() {
    setLoading(true)
    setError(null)
    const result = await getSeekers(filters)
    if (result.error) {
      setError(result.error)
    } else {
      setSeekers(result.seekers)
    }
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">구직자 탐색</h2>
          <p className="text-sm text-gray-500 mt-1">
            프로필을 공개한 구직자를 찾아보세요
          </p>
        </div>
        {!loading && (
          <p className="text-sm text-gray-500">{seekers.length}명의 구직자</p>
        )}
      </div>

      {/* Future: Filter components will go here */}
      {/* <SeekerFilters filters={filters} onFilterChange={setFilters} /> */}

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
          <p className="text-gray-500">조건에 맞는 구직자가 없습니다</p>
          <p className="text-sm text-gray-400 mt-2">
            구직자가 프로필을 공개하면 여기에 표시됩니다
          </p>
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
