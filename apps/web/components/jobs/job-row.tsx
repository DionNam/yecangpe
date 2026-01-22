'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { TableCell, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { LoginModal } from './login-modal'
import { getCountryName } from '@repo/lib'
import type { Database } from '@repo/supabase/types'

type JobPost = Database['public']['Tables']['job_posts']['Row']

interface JobRowProps {
  job: JobPost
  isAuthenticated: boolean
  displayViews: number
  displayLikes: number
  animationDelay?: number
}

export function JobRow({
  job,
  isAuthenticated,
  displayViews,
  displayLikes,
  animationDelay = 0,
}: JobRowProps) {
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
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
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
      <TableRow
        onClick={handleClick}
        className="
          cursor-pointer
          border-b border-slate-200 last:border-0
          hover:bg-slate-50
          transition-all duration-200
          group
        "
      >
        {/* Date */}
        <TableCell className="font-medium text-sm py-8 px-6">
          {formatDate(job.published_at)}
        </TableCell>

        {/* Title and company info */}
        <TableCell className="py-8 px-6">
          <div className="space-y-1 min-w-0">
            <h3 className="font-semibold text-base group-hover:text-slate-900 transition-colors duration-200">
              {job.title}
            </h3>
            <p className="text-sm text-slate-600">
              {job.company_name}
            </p>
            <div className="flex gap-2 flex-wrap">
              <Badge
                variant={job.hiring_status === 'hiring' ? 'default' : 'secondary'}
              >
                {job.hiring_status === 'hiring' ? '채용중' : '마감'}
              </Badge>
              <Badge variant="outline">
                {getLocationBadgeText()}
              </Badge>
            </div>
          </div>
        </TableCell>

        {/* Views */}
        <TableCell className="text-center py-8 px-6">
          <span className="text-sm font-medium text-slate-600 group-hover:text-gray-900 transition-colors">
            {displayViews.toLocaleString()}
          </span>
        </TableCell>

        {/* Likes */}
        <TableCell className="text-center py-8 px-6">
          <span className="text-sm font-medium text-slate-600 group-hover:text-gray-900 transition-colors">
            {displayLikes.toLocaleString()}
          </span>
        </TableCell>

        {/* Thumbnail */}
        <TableCell className="py-8 px-6">
          <div className="flex justify-center">
            {job.image_url ? (
              <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100 shadow-sm">
                <Image
                  src={job.image_url}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-lg bg-slate-100/50" />
            )}
          </div>
        </TableCell>
      </TableRow>

      <LoginModal open={showLoginModal} onOpenChange={setShowLoginModal} />
    </>
  )
}
