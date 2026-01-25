import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { JobRow } from './job-row'
import { JobCard } from './job-card'
import { getDisplayMetrics } from '@/lib/utils/metrics'
import type { Database } from '@repo/supabase/types'

type JobPost = Database['public']['Tables']['job_posts']['Row']

interface MetricsConfig {
  ramp_days: number
  curve_strength: number
}

interface JobListTableProps {
  posts: JobPost[]
  isAuthenticated: boolean
  metricsConfig: MetricsConfig
}

export function JobListTable({
  posts,
  isAuthenticated,
  metricsConfig,
}: JobListTableProps) {
  return (
    <>
      {/* Mobile: Card Layout */}
      <div className="md:hidden divide-y divide-slate-200">
        {posts.map((post, index) => {
          const publishedAt = post.published_at
            ? new Date(post.published_at)
            : new Date()

          const { displayViews, displayLikes } = getDisplayMetrics(
            post.view_count,
            0,
            post.view_target,
            post.like_target,
            publishedAt,
            metricsConfig
          )

          return (
            <JobCard
              key={post.id}
              job={post}
              isAuthenticated={isAuthenticated}
              displayViews={displayViews}
              displayLikes={displayLikes}
            />
          )
        })}
      </div>

      {/* Desktop: Table Layout */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border/50 hover:bg-transparent">
              <TableHead className="w-[120px] text-xs font-semibold text-muted-foreground uppercase tracking-wider h-16 px-6">
                날짜
              </TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider h-16 px-6">
                제목
              </TableHead>
              <TableHead className="w-[120px] text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider h-16 px-6">
                사진
              </TableHead>
              <TableHead className="w-[100px] text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider h-16 px-6">
                조회수
              </TableHead>
              <TableHead className="w-[100px] text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider h-16 px-6">
                관심수
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post, index) => {
              const publishedAt = post.published_at
                ? new Date(post.published_at)
                : new Date()

              const { displayViews, displayLikes } = getDisplayMetrics(
                post.view_count,
                0,
                post.view_target,
                post.like_target,
                publishedAt,
                metricsConfig
              )

              return (
                <JobRow
                  key={post.id}
                  job={post}
                  isAuthenticated={isAuthenticated}
                  displayViews={displayViews}
                  displayLikes={displayLikes}
                  animationDelay={index * 50}
                />
              )
            })}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
