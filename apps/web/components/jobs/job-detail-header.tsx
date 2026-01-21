import { NATIONALITIES } from '@repo/lib/constants'
import type { Database } from '@repo/supabase/types'

type HiringStatus = Database['public']['Enums']['hiring_status']

interface JobDetailHeaderProps {
  title: string
  companyName: string
  nationality: string
  hiringStatus: HiringStatus
  publishedAt: string | null
}

export function JobDetailHeader({
  title,
  companyName,
  nationality,
  hiringStatus,
  publishedAt,
}: JobDetailHeaderProps) {
  // Get Korean name for nationality
  const nationalityInfo = NATIONALITIES.find(n => n.code === nationality)
  const nationalityName = nationalityInfo?.name || nationality

  // Format date as YYYY.MM.DD
  const formattedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).replace(/\. /g, '.').replace(/\.$/, '')
    : ''

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>

      <div className="text-lg text-muted-foreground mb-4">
        {companyName}
      </div>

      <div className="flex items-center gap-2">
        <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
          {nationalityName}
        </span>

        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            hiringStatus === 'hiring'
              ? 'bg-green-50 text-green-700'
              : 'bg-gray-50 text-gray-700'
          }`}
        >
          {hiringStatus === 'hiring' ? '채용중' : '마감'}
        </span>

        {formattedDate && (
          <span className="text-sm text-muted-foreground">{formattedDate}</span>
        )}
      </div>
    </div>
  )
}
