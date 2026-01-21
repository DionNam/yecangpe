import Link from 'next/link'
import { JobDetailHeader } from './job-detail-header'
import { LikeButton } from './like-button'
import type { Database } from '@repo/supabase/types'

type JobPost = Database['public']['Tables']['job_posts']['Row']

interface JobDetailProps {
  job: JobPost
  displayViews: number
  displayLikes: number
  isLiked: boolean
  canLike: boolean
}

export function JobDetail({
  job,
  displayViews,
  displayLikes,
  isLiked,
  canLike,
}: JobDetailProps) {
  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/jobs"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
      >
        ← 목록으로 돌아가기
      </Link>

      {/* Header with metadata */}
      <JobDetailHeader
        title={job.title}
        companyName={job.company_name}
        nationality={job.target_nationality}
        hiringStatus={job.hiring_status}
        publishedAt={job.published_at}
      />

      <hr className="border-border" />

      {/* Content section */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold mb-3">채용 상세</h2>
        <div className="text-base leading-relaxed whitespace-pre-wrap">
          {job.content}
        </div>
      </div>

      <hr className="border-border pt-6" />

      {/* Stats section */}
      <div className="flex items-center gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <span>조회수</span>
          <span className="font-medium text-foreground">{displayViews}</span>
        </div>

        <div className="flex items-center gap-1">
          <span>관심수</span>
          <span className="font-medium text-foreground">{displayLikes}</span>
        </div>
      </div>

      {/* Like Button */}
      <div className="pt-4 flex justify-center">
        <LikeButton
          postId={job.id}
          initialLiked={isLiked}
          initialCount={displayLikes}
          canLike={canLike}
        />
      </div>
    </div>
  )
}
