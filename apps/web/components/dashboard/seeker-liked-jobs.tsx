'use client'

import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { ko, enUS } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import type { Database } from '@repo/supabase/types'
import { useTranslation } from '@/lib/i18n'

type JobPost = Database['public']['Tables']['job_posts']['Row']

interface LikedJob {
  id: string
  created_at: string
  post: JobPost | null
}

interface SeekerLikedJobsProps {
  jobs: LikedJob[]
}

export function SeekerLikedJobs({ jobs }: SeekerLikedJobsProps) {
  const { t, language } = useTranslation()

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-slate-600 mb-4">
          {t('seekerDashboard.noLikedJobs')}
        </p>
        <Link
          href="/jobs"
          className="inline-block text-blue-600 hover:text-blue-700 font-medium hover:underline"
        >
          {t('seekerDashboard.browseJobs')} →
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900">
        {t('seekerDashboard.likedJobs')} ({jobs.length})
      </h3>

      <div className="space-y-3">
        {jobs.map(({ id, created_at, post }) => {
          if (!post) return null

          return (
            <div
              key={id}
              className="border rounded-lg p-4 hover:bg-slate-50 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/jobs/${post.slug || post.id}`}
                    className="font-medium text-slate-900 hover:underline block mb-1 truncate"
                  >
                    {post.title}
                  </Link>
                  <p className="text-sm text-muted-foreground mb-2 truncate">
                    {post.company_name}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      variant={
                        post.hiring_status === 'hiring' ? 'default' : 'secondary'
                      }
                    >
                      {post.hiring_status === 'hiring' ? t('common.hiring') : t('common.closed')}
                    </Badge>
                    <span className="text-xs text-slate-500">
                      {formatDistanceToNow(new Date(created_at), {
                        addSuffix: true,
                        locale: language === 'en' ? enUS : ko,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
