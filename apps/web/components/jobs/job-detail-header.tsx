import { NATIONALITIES, getCountryName } from '@repo/lib'
import { Building2, Eye, Heart } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { ShareButton } from '@/components/jobs/share-button'
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
  jobId: string
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
  jobId,
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
    <div className="relative space-y-4 md:space-y-6 p-4 md:p-8 lg:p-12 pb-6 md:pb-8 border-b border-slate-200">
      {/* Title */}
      <div className="space-y-3 md:space-y-4 relative">
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
          {title}
        </h1>

        {/* Company name */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-5 h-5 md:w-6 md:h-6 text-slate-900" />
          </div>
          <div>
            <p className="text-base md:text-lg font-medium text-gray-900">
              {companyName}
            </p>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant={hiringStatus === 'hiring' ? 'default' : 'secondary'}
            className="text-xs md:text-sm px-2.5 md:px-4 py-1 md:py-1.5"
          >
            {hiringStatus === 'hiring' ? '채용중' : '마감'}
          </Badge>

          <Badge variant="outline" className="text-xs md:text-sm px-2.5 md:px-4 py-1 md:py-1.5">
            {nationalityName}
          </Badge>

          {/* Work location metadata */}
          <div className="flex items-center gap-1.5 text-xs md:text-sm text-slate-600">
            <span>📍</span>
            <span>{getLocationText()}</span>
          </div>
        </div>

        {/* Metrics and Share - separate row on mobile */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 md:border-0 md:pt-0">
          <div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm text-slate-600">
            <span className="flex items-center gap-1 md:gap-1.5">
              <Eye className="w-3.5 h-3.5 md:w-4 md:h-4" />
              {displayViews.toLocaleString()}
            </span>
            <span className="flex items-center gap-1 md:gap-1.5">
              <Heart className="w-3.5 h-3.5 md:w-4 md:h-4" />
              {displayLikes.toLocaleString()}
            </span>
          </div>
          <ShareButton title={title} url={`https://hanguljobs.com/jobs/${jobId}`} />
        </div>
      </div>
    </div>
  )
}
