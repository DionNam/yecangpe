'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { LoginModal } from './login-modal'
import { getCountryName } from '@repo/lib'
import { Eye, Heart, Calendar } from 'lucide-react'
import type { Database } from '@repo/supabase/types'

type JobPost = Database['public']['Tables']['job_posts']['Row']

interface JobCardProps {
  job: JobPost
  isAuthenticated: boolean
  displayViews: number
  displayLikes: number
}

export function JobCard({
  job,
  isAuthenticated,
  displayViews,
  displayLikes,
}: JobCardProps) {
  const router = useRouter()
  const [showLoginModal, setShowLoginModal] = useState(false)

  const handleClick = () => {
    if (isAuthenticated) {
      router.push(`/jobs/${job.id}`)
    } else {
      setShowLoginModal(true)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
    })
  }

  const getLocationBadgeText = () => {
    switch (job.work_location_type) {
      case 'remote':
        return '원격근무'
      case 'hybrid':
        return '하이브리드'
      case 'on_site':
        return job.work_location_country
          ? getCountryName(job.work_location_country)
          : '대면근무'
      default:
        return '대면근무'
    }
  }

  return (
    <>
      <div
        onClick={handleClick}
        className="p-4 cursor-pointer hover:bg-slate-50 active:bg-slate-100 transition-colors"
      >
        <div className="flex gap-3">
          {/* Thumbnail */}
          {job.image_url && (
            <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100">
              <Image
                src={job.image_url}
                alt=""
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Title */}
            <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-1">
              {job.title}
            </h3>

            {/* Company */}
            <p className="text-xs text-slate-500 mb-2">
              {job.company_name}
            </p>

            {/* Badges */}
            <div className="flex gap-1.5 flex-wrap mb-2">
              <Badge
                variant={job.hiring_status === 'hiring' ? 'default' : 'secondary'}
                className="text-[10px] px-1.5 py-0.5"
              >
                {job.hiring_status === 'hiring' ? '채용중' : '마감'}
              </Badge>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0.5">
                {getLocationBadgeText()}
              </Badge>
            </div>

            {/* Meta info */}
            <div className="flex items-center gap-3 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(job.published_at)}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {displayViews.toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="w-3 h-3" />
                {displayLikes.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <LoginModal open={showLoginModal} onOpenChange={setShowLoginModal} />
    </>
  )
}
