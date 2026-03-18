'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { JobDetailCompanyCard } from './job-detail-company-card'
import { JobDetailSidebar } from './job-detail-sidebar'
import { JobDetailActionBar } from './job-detail-action-bar'
import { JOB_TYPES } from '@repo/lib'
import type { Database } from '@repo/supabase/types'
import { useTranslation } from '@/lib/i18n'

type JobPost = Database['public']['Tables']['job_posts']['Row']

interface JobDetailContentProps {
  job: JobPost
  isLiked: boolean
  canLike: boolean
  displayLikes: number
  user: { id: string } | null
  companyWebsite?: string | null
}

export function JobDetailContent({
  job,
  isLiked,
  canLike,
  displayLikes,
  user,
  companyWebsite,
}: JobDetailContentProps) {
  const { t, language } = useTranslation()

  const isNew = job.published_at
    ? Date.now() - new Date(job.published_at).getTime() < 7 * 24 * 60 * 60 * 1000
    : false

  const getWorkLocationTypeName = (type: string | null) => {
    if (!type) return null
    const types: Record<string, string> = {
      on_site: t('common.onSite'),
      remote: t('common.remote'),
      hybrid: t('common.hybrid'),
    }
    return types[type] || type
  }

  const jobTypeEntry = JOB_TYPES.find(jt => jt.code === job.job_type)
  const jobTypeName = language === 'en' ? jobTypeEntry?.name : jobTypeEntry?.nameKo

  return (
    <>
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
        {t('common.backToList')}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 md:gap-8 mt-6">
        {/* Left: Main Content */}
        <div className="space-y-6 md:space-y-8">
          {/* Title + Badges */}
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
              {job.title}
            </h1>
            <div className="flex flex-wrap gap-2 mt-3">
              {isNew && (
                <Badge variant="default" className="bg-blue-600">
                  New
                </Badge>
              )}
              {jobTypeName && (
                <Badge variant="default" className="bg-blue-500">
                  {jobTypeName}
                </Badge>
              )}
              {job.work_location_type && (
                <Badge variant="default" className="bg-emerald-500">
                  {getWorkLocationTypeName(job.work_location_type)}
                </Badge>
              )}
              <Badge variant={job.hiring_status === 'hiring' ? 'default' : 'secondary'}>
                {job.hiring_status === 'hiring' ? t('common.hiring') : t('common.hiringClosed')}
              </Badge>
            </div>
          </div>

          {/* Company Info Card */}
          <JobDetailCompanyCard
            companyName={job.company_name}
            companyLogoUrl={job.image_url}
            companyWebsite={companyWebsite}
          />

          {/* Job Image */}
          {job.image_url && (
            <div className="relative w-full aspect-video overflow-hidden rounded-xl">
              <Image
                src={job.image_url}
                alt={`${job.title}`}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Job Description */}
          <section>
            <h2 className="text-xl font-bold mb-4 text-gray-900">{t('common.jobDescription')}</h2>
            <div
              className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap [&_p:empty]:h-6"
              dangerouslySetInnerHTML={{ __html: job.content }}
            />
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
    </>
  )
}
