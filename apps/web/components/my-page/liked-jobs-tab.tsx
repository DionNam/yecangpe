'use client'

import Link from 'next/link'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { getDisplayMetrics } from '@/lib/utils/metrics'
import { useTranslation } from '@/lib/i18n'
import type { Database } from '@repo/supabase/types'

type JobPost = Database['public']['Tables']['job_posts']['Row']

interface MetricsConfig {
  ramp_days: number
  curve_strength: number
}

interface LikedJob {
  id: string
  post: JobPost | null
}

interface LikedJobsTabProps {
  jobs: LikedJob[]
  metricsConfig: MetricsConfig
}

export function LikedJobsTab({ jobs, metricsConfig }: LikedJobsTabProps) {
  const { t, language } = useTranslation()

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        {t('likedJobsTab.empty')}
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'hiring':
        return (
          <Badge variant="default" className="mr-2">
            {t('jobPostForm.hiring')}
          </Badge>
        )
      case 'closed':
        return (
          <Badge variant="secondary" className="mr-2">
            {t('jobPostForm.closed')}
          </Badge>
        )
      default:
        return null
    }
  }

  const getJobData = (post: JobPost) => {
    const publishedAt = post.published_at
      ? new Date(post.published_at)
      : new Date()

    const { displayViews } = getDisplayMetrics(
      post.view_count,
      0,
      post.view_target,
      post.like_target,
      publishedAt,
      metricsConfig
    )

    const dateStr = publishedAt.toLocaleDateString(language === 'en' ? 'en-US' : 'ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })

    return { publishedAt, displayViews, dateStr }
  }

  return (
    <>
      {/* Mobile card view */}
      <div className="md:hidden space-y-3">
        {jobs.map(({ id, post }) => {
          if (!post) return null
          const { displayViews, dateStr } = getJobData(post)

          return (
            <Link
              key={id}
              href={`/jobs/${post.slug || post.id}`}
              className="block p-4 border rounded-lg hover:bg-slate-50"
            >
              <div className="flex items-center justify-between mb-2">
                {getStatusBadge(post.hiring_status)}
                <span className="text-xs text-slate-500">{dateStr}</span>
              </div>
              <p className="font-medium text-sm">{post.title}</p>
              <p className="text-xs text-slate-500 mt-1">{displayViews.toLocaleString()} {t('likedJobsTab.views')}</p>
            </Link>
          )
        })}
      </div>

      {/* Desktop table view */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">{t('likedJobsTab.date')}</TableHead>
              <TableHead>{t('likedJobsTab.title')}</TableHead>
              <TableHead className="w-[80px] text-right">{t('likedJobsTab.views')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map(({ id, post }) => {
              if (!post) return null
              const { displayViews, dateStr } = getJobData(post)

              return (
                <TableRow key={id}>
                  <TableCell className="text-muted-foreground">
                    {dateStr}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/jobs/${post.slug || post.id}`}
                      className="hover:underline flex items-center"
                    >
                      {getStatusBadge(post.hiring_status)}
                      {post.title}
                    </Link>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {displayViews.toLocaleString()}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
