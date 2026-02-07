import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@repo/supabase/server'
import type { Database } from '@repo/supabase/types'
import { FilterPageLayout } from '@/components/filter-pages/filter-page-layout'
import { JobListTable } from '@/components/jobs/job-list-table'
import {
  LOCATION_TYPES,
  getFilterPageTitle,
  getFilterPageDescription,
  getFilterPageFAQs,
  getFilterCrossLinks,
  generateFilterPageMetadata,
} from '@/lib/filter-page-data'

type JobPost = Database['public']['Tables']['job_posts']['Row']

interface PageProps {
  params: Promise<{ locationType: string }>
}

// ISR: revalidate every 5 minutes
export const revalidate = 300

export async function generateStaticParams() {
  return LOCATION_TYPES.map(({ code }) => ({ locationType: code }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locationType } = await params

  // Validate locationType
  const locationTypeObj = LOCATION_TYPES.find((t) => t.code === locationType)
  if (!locationTypeObj) {
    return {
      title: 'Not Found - HangulJobs',
      description: 'Page not found',
    }
  }

  // Get job count for metadata
  const supabase = await createClient()
  const { count } = await supabase
    .from('job_posts')
    .select('*', { count: 'exact', head: true })
    .eq('review_status', 'published')
    .eq('hiring_status', 'hiring')
    .eq('work_location_type', locationType)

  return generateFilterPageMetadata('by-location-type', locationType, count || 0)
}

export default async function JobsByLocationTypePage({ params }: PageProps) {
  const { locationType } = await params

  // Validate locationType against LOCATION_TYPES
  const locationTypeObj = LOCATION_TYPES.find((t) => t.code === locationType)
  if (!locationTypeObj) {
    notFound()
  }

  const supabase = await createClient()

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const isAuthenticated = !!user

  // Query jobs filtered by location type
  const { data: jobs, count } = (await supabase
    .from('job_posts')
    .select('*', { count: 'exact' })
    .eq('review_status', 'published')
    .eq('hiring_status', 'hiring')
    .eq('work_location_type', locationType)
    .order('published_at', { ascending: false })
    .limit(20)) as { data: JobPost[] | null; count: number | null }

  // Calculate company count (approximate using unique company names)
  const companyCount = jobs
    ? new Set(jobs.map((job) => job.company_name)).size
    : 0

  // Get filter page data
  const { title, titleKo } = getFilterPageTitle('by-location-type', locationType)
  const description = getFilterPageDescription('by-location-type', locationType)
  const faqs = getFilterPageFAQs('by-location-type', locationType)
  const crossLinks = getFilterCrossLinks('by-location-type', locationType)

  // Build ItemList JSON-LD structured data
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hanguljobs.com'
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: title,
    description: description,
    numberOfItems: count || 0,
    itemListElement: (jobs || []).map((job, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'JobPosting',
        name: job.title,
        url: `${baseUrl}/jobs/${job.slug}`,
        hiringOrganization: {
          '@type': 'Organization',
          name: job.company_name,
        },
        datePosted: job.published_at || job.created_at,
        jobLocationType: job.work_location_type?.toUpperCase(),
      },
    })),
  }

  return (
    <FilterPageLayout
      title={title}
      titleKo={titleKo}
      description={description}
      jobCount={count || 0}
      companyCount={companyCount}
      faqs={faqs}
      crossLinks={crossLinks}
      filterName={locationTypeObj.name}
    >
      {/* ItemList JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      {/* Job List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <JobListTable posts={jobs || []} isAuthenticated={isAuthenticated} />
      </div>

      {/* Empty state */}
      {(!jobs || jobs.length === 0) && (
        <div className="text-center py-32">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">🔍</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            등록된 공고가 없습니다
          </h3>
          <p className="text-slate-500">
            조건을 변경하거나 나중에 다시 확인해주세요
          </p>
        </div>
      )}
    </FilterPageLayout>
  )
}
