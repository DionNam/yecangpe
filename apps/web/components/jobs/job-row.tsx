'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { TableCell, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { LoginModal } from './login-modal'
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
        <TableCell className="font-medium text-sm">
          {formatDate(job.published_at)}
        </TableCell>
        <TableCell>
          <div className="space-y-1">
            <h3 className="font-semibold text-base group-hover:text-slate-900 transition-colors duration-200">
              {job.title}
            </h3>
            <p className="text-sm text-slate-600">
              {job.company_name}
            </p>
          </div>
          <Badge
            variant={job.hiring_status === 'hiring' ? 'default' : 'secondary'}
            className="mt-2"
          >
            {job.hiring_status === 'hiring' ? '채용중' : '마감'}
          </Badge>
        </TableCell>
        <TableCell className="text-right">
          <span className="text-sm font-medium text-slate-600 group-hover:text-gray-900 transition-colors">
            {displayViews.toLocaleString()}
          </span>
        </TableCell>
        <TableCell className="text-right">
          <span className="text-sm font-medium text-slate-600 group-hover:text-gray-900 transition-colors">
            {displayLikes.toLocaleString()}
          </span>
        </TableCell>
      </TableRow>

      <LoginModal open={showLoginModal} onOpenChange={setShowLoginModal} />
    </>
  )
}
