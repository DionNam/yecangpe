import { NATIONALITIES, getCountryName } from '@repo/lib'
import { Building2, Eye, Heart } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { Database } from '@repo/supabase/types'

type HiringStatus = Database['public']['Enums']['hiring_status']
type WorkLocationType = Database['public']['Enums']['work_location_type']

interface JobDetailHeaderProps {
  title: string
  companyName: string
  nationality: string
  hiringStatus: HiringStatus
  publishedAt: string | null
  displayViews: number
  displayLikes: number
  workLocationType: WorkLocationType
  workLocationCountry: string | null
}

export function JobDetailHeader({
  title,
  companyName,
  nationality,
  hiringStatus,
  publishedAt,
  displayViews,
  displayLikes,
  workLocationType,
  workLocationCountry,
}: JobDetailHeaderProps) {
  // Get Korean name for nationality
  const nationalityInfo = NATIONALITIES.find(n => n.code === nationality)
  const nationalityName = nationalityInfo?.name || nationality

  // Format work location text
  const getLocationText = () => {
    switch (workLocationType) {
      case 'remote':
        return '원격근무'
      case 'hybrid':
        return '하이브리드'
      case 'on_site':
        return workLocationCountry
          ? `대면근무 · ${getCountryName(workLocationCountry)}`
          : '대면근무'
      default:
        return '대면근무'
    }
  }

  return (
    <div className="relative space-y-6 p-8 md:p-12 pb-8 border-b border-slate-200">
      {/* Title */}
      <div className="space-y-4 relative">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
          {title}
        </h1>

        {/* Company name */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center">
            <Building2 className="w-6 h-6 text-slate-900" />
          </div>
          <div>
            <p className="text-lg font-medium text-gray-900">
              {companyName}
            </p>
          </div>
        </div>

        {/* Badges and metadata */}
        <div className="flex flex-wrap items-center gap-3">
          <Badge
            variant={hiringStatus === 'hiring' ? 'default' : 'secondary'}
            className="text-sm px-4 py-1.5"
          >
            {hiringStatus === 'hiring' ? '채용중' : '마감'}
          </Badge>

          <Badge variant="outline" className="text-sm px-4 py-1.5">
            {nationalityName}
          </Badge>

          {/* Work location metadata */}
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span>📍</span>
            <span>{getLocationText()}</span>
          </div>

          {/* Metrics with icons */}
          <div className="flex items-center gap-4 text-sm text-slate-600 ml-auto">
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              {displayViews.toLocaleString()}
            </span>
            <span className="flex items-center gap-1.5">
              <Heart className="w-4 h-4" />
              {displayLikes.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
