import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { JobDetailCompanyCard } from './job-detail-company-card'
import { JobDetailSidebar } from './job-detail-sidebar'
import { JobDetailActionBar } from './job-detail-action-bar'
import { RelatedJobsCarousel } from './related-jobs-carousel'
import Image from 'next/image'
import { JOB_TYPES } from '@repo/lib'
import type { Database } from '@repo/supabase/types'

type JobPost = Database['public']['Tables']['job_posts']['Row']

interface JobDetailPageProps {
  job: JobPost
  isLiked: boolean
  canLike: boolean
  displayLikes: number
  displayViews: number
  user: { id: string } | null
  companyWebsite?: string | null
}

export function JobDetailPage({
  job,
  isLiked,
  canLike,
  displayLikes,
  displayViews,
  user,
  companyWebsite,
}: JobDetailPageProps) {
  // Check if post is new (within 7 days)
  const isNew = job.published_at
    ? Date.now() - new Date(job.published_at).getTime() < 7 * 24 * 60 * 60 * 1000
    : false

  // Get work location type Korean name
  const getWorkLocationTypeName = (type: string | null) => {
    if (!type) return null
    const types = {
      on_site: '현장근무',
      remote: '원격근무',
      hybrid: '하이브리드',
    }
    return types[type as keyof typeof types] || type
  }

  // Get job type Korean name
  const jobTypeKo = JOB_TYPES.find(t => t.code === job.job_type)?.nameKo

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back navigation */}
      <Link
        href="/jobs"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mb-6"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
        목록으로 돌아가기
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 mt-6">
        {/* Left: Main Content */}
        <div className="space-y-8">
          {/* Title + Badges */}
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
              {job.title}
            </h1>
            <div className="flex flex-wrap gap-2 mt-3">
              {/* New badge */}
              {isNew && (
                <Badge variant="default" className="bg-blue-600">
                  New
                </Badge>
              )}

              {/* Job type badge */}
              {jobTypeKo && (
                <Badge variant="default" className="bg-blue-500">
                  {jobTypeKo}
                </Badge>
              )}

              {/* Work location type badge */}
              {job.work_location_type && (
                <Badge variant="default" className="bg-emerald-500">
                  {getWorkLocationTypeName(job.work_location_type)}
                </Badge>
              )}

              {/* Hiring status badge */}
              <Badge variant={job.hiring_status === 'hiring' ? 'default' : 'secondary'}>
                {job.hiring_status === 'hiring' ? '채용중' : '채용마감'}
              </Badge>
            </div>
          </div>

          {/* Company Info Card */}
          <JobDetailCompanyCard
            companyName={job.company_name}
            companyLogoUrl={job.image_url}
            companyWebsite={companyWebsite}
          />

          {/* Job Image (if exists) - full width within left column */}
          {job.image_url && (
            <div className="relative w-full aspect-video overflow-hidden rounded-xl">
              <Image
                src={job.image_url}
                alt={`${job.title} 공고 이미지`}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Job Description - rich text rendering */}
          <section>
            <h2 className="text-xl font-bold mb-4 text-gray-900">공고 내용</h2>
            <div className="prose prose-slate max-w-none">
              <p className="whitespace-pre-wrap text-slate-700 leading-relaxed">
                {job.content}
              </p>
            </div>
          </section>

          {/* Action Bar */}
          <JobDetailActionBar
            jobId={job.id}
            jobSlug={job.slug}
            jobTitle={job.title}
            isLiked={isLiked}
            canLike={canLike}
            displayLikes={displayLikes}
          />
        </div>

        {/* Right: Sidebar */}
        <div className="lg:sticky lg:top-24 lg:self-start space-y-6">
          <JobDetailSidebar
            job={job}
            isLiked={isLiked}
            canLike={canLike}
            displayLikes={displayLikes}
            user={user}
          />
        </div>
      </div>

      {/* Full width: Related Jobs Carousel */}
      <RelatedJobsCarousel
        currentJobId={job.id}
        category={job.category}
        country={job.work_location_country}
      />
    </div>
  )
}
