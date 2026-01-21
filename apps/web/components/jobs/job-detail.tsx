import Link from 'next/link'
import { ArrowLeft, Mail } from 'lucide-react'
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
    <div>
      {/* Back navigation with style */}
      <div className="p-8 md:p-12 pb-0">
        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>채용 공고로 돌아가기</span>
        </Link>
      </div>

      {/* Header with metadata */}
      <JobDetailHeader
        title={job.title}
        companyName={job.company_name}
        nationality={job.target_nationality}
        hiringStatus={job.hiring_status}
        publishedAt={job.published_at}
        displayViews={displayViews}
        displayLikes={displayLikes}
      />

      {/* Main content */}
      <div className="p-8 md:p-12 space-y-8 fade-in-up delay-400">
        {/* Job description section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold relative accent-line-bold pt-4">
            공고 내용
          </h2>
          <div className="prose prose-slate max-w-none">
            <p className="text-base leading-relaxed text-foreground/90 whitespace-pre-wrap">
              {job.content}
            </p>
          </div>
        </section>

        {/* Requirements section if exists */}
        {job.requirements && (
          <section className="space-y-4 pt-8 border-t border-border/50 fade-in-up delay-500">
            <h2 className="text-2xl font-bold relative accent-line-bold pt-4">
              자격 요건
            </h2>
            <div className="prose prose-slate max-w-none">
              <p className="text-base leading-relaxed text-foreground/90 whitespace-pre-wrap">
                {job.requirements}
              </p>
            </div>
          </section>
        )}

        {/* Application info section */}
        <section className="space-y-4 pt-8 border-t border-border/50 fade-in-up delay-600">
          <h2 className="text-2xl font-bold relative accent-line-bold pt-4">
            지원 방법
          </h2>
          <div className="bg-muted/50 rounded-xl p-6 space-y-3">
            <p className="text-sm text-muted-foreground">
              이 공고에 관심이 있으시면 하트 버튼을 눌러주세요.
              구인자가 관심 표시를 확인하고 연락 드릴 예정입니다.
            </p>
            {job.contact_info && (
              <div className="flex items-start gap-2 text-sm">
                <Mail className="w-4 h-4 mt-0.5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">문의 연락처</p>
                  <p className="text-muted-foreground">{job.contact_info}</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Like button with prominent placement */}
        {canLike && (
          <div className="fade-in-up delay-300 flex justify-center pt-4">
            <LikeButton
              postId={job.id}
              initialIsLiked={isLiked}
              className="w-full sm:w-auto"
            />
          </div>
        )}

        {/* Published date footer */}
        <div className="pt-8 border-t border-border/50 text-sm text-muted-foreground text-center fade-in-up delay-700">
          게시일: {new Date(job.published_at || job.created_at).toLocaleDateString('ko-KR')}
        </div>
      </div>
    </div>
  )
}
