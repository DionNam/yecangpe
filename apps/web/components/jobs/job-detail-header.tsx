import { NATIONALITIES } from '@repo/lib/constants'
import { Building2, Eye, Heart } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { Database } from '@repo/supabase/types'

type HiringStatus = Database['public']['Enums']['hiring_status']

interface JobDetailHeaderProps {
  title: string
  companyName: string
  nationality: string
  hiringStatus: HiringStatus
  publishedAt: string | null
  displayViews: number
  displayLikes: number
}

export function JobDetailHeader({
  title,
  companyName,
  nationality,
  hiringStatus,
  publishedAt,
  displayViews,
  displayLikes,
}: JobDetailHeaderProps) {
  // Get Korean name for nationality
  const nationalityInfo = NATIONALITIES.find(n => n.code === nationality)
  const nationalityName = nationalityInfo?.name || nationality

  return (
    <div className="relative space-y-6 p-8 md:p-12 pb-8 border-b border-border/50">
      {/* Title with decorative element */}
      <div className="space-y-4 relative decorative-line fade-in-up">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-display leading-tight">
          {title}
        </h1>

        {/* Company name with visual distinction */}
        <div className="flex items-center gap-3 fade-in-up delay-100">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Building2 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-lg font-medium text-foreground">
              {companyName}
            </p>
          </div>
        </div>

        {/* Badges and metadata */}
        <div className="flex flex-wrap items-center gap-3 fade-in-up delay-200">
          <Badge
            variant={hiringStatus === 'hiring' ? 'default' : 'secondary'}
            className={`text-sm px-4 py-1.5 ${hiringStatus === 'hiring' ? 'animate-pulse-subtle' : ''}`}
          >
            {hiringStatus === 'hiring' ? '채용중' : '마감'}
          </Badge>

          <Badge variant="outline" className="text-sm px-4 py-1.5">
            {nationalityName}
          </Badge>

          {/* Metrics with icons */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground ml-auto">
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
