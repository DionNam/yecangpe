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
}

export function JobRow({
  job,
  isAuthenticated,
  displayViews,
  displayLikes,
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
        className="cursor-pointer hover:bg-muted/50"
        onClick={handleClick}
      >
        <TableCell className="font-medium">
          {formatDate(job.published_at)}
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <span>{job.title}</span>
            <Badge
              variant={job.hiring_status === 'hiring' ? 'default' : 'secondary'}
            >
              {job.hiring_status === 'hiring' ? '채용중' : '마감'}
            </Badge>
          </div>
        </TableCell>
        <TableCell className="text-right">{displayViews}</TableCell>
        <TableCell className="text-right">{displayLikes}</TableCell>
      </TableRow>

      <LoginModal open={showLoginModal} onOpenChange={setShowLoginModal} />
    </>
  )
}
