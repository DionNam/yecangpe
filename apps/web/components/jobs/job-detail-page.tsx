import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { JobDetailCompanyCard } from './job-detail-company-card'
import { JobDetailSidebar } from './job-detail-sidebar'
import { JobDetailActionBar } from './job-detail-action-bar'
import { RelatedJobsCarousel } from './related-jobs-carousel'
import Image from 'next/image'
import { JOB_TYPES } from '@repo/lib'
import type { Database } from '@repo/supabase/types'
import { JobDetailContent } from './job-detail-content'

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
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <JobDetailContent
        job={job}
        isLiked={isLiked}
        canLike={canLike}
        displayLikes={displayLikes}
        user={user}
        companyWebsite={companyWebsite}
      />

      {/* Full width: Related Jobs Carousel (server component) */}
      <RelatedJobsCarousel
        currentJobId={job.id}
        category={job.category}
        country={job.work_location_country}
      />
    </div>
  )
}
