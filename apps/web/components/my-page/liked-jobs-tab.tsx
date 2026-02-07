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
  if (jobs.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        관심 표시한 공고가 없습니다
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">날짜</TableHead>
          <TableHead>제목</TableHead>
          <TableHead className="w-[80px] text-right">조회수</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {jobs.map(({ id, post }) => {
          if (!post) return null

          const publishedAt = post.published_at
            ? new Date(post.published_at)
            : new Date()

          const { displayViews } = getDisplayMetrics(
            post.view_count,
            0, // Real likes - not needed for display here
            post.view_target,
            post.like_target,
            publishedAt,
            metricsConfig
          )

          // Format date
          const dateStr = publishedAt.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          })

          // Get hiring status badge
          const getStatusBadge = (status: string) => {
            switch (status) {
              case 'hiring':
                return (
                  <Badge variant="default" className="mr-2">
                    채용중
                  </Badge>
                )
              case 'closed':
                return (
                  <Badge variant="secondary" className="mr-2">
                    마감
                  </Badge>
                )
              default:
                return null
            }
          }

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
  )
}
