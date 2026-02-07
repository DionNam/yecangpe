import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@repo/supabase/server'
import type { Database } from '@repo/supabase/types'
import { KOREAN_LEVELS } from '@repo/lib'
import { FilterPageLayout } from '@/components/filter-pages/filter-page-layout'
import { JobListTable } from '@/components/jobs/job-list-table'
import {
  getFilterPageTitle,
  getFilterPageDescription,
  getFilterPageFAQs,
  getFilterCrossLinks,
  generateFilterPageMetadata,
} from '@/lib/filter-page-data'

type JobPost = Database['public']['Tables']['job_posts']['Row']

interface PageProps {
  params: Promise<{ level: string }>
}

// ISR: revalidate every 5 minutes
export const revalidate = 300

export async function generateStaticParams() {
  // Filter out 'not_specified' - only generate pages for valid levels
  return KOREAN_LEVELS.filter((l) => l.code !== 'not_specified').map(
    ({ code }) => ({ level: code })
  )
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { level } = await params

  // Validate level (exclude not_specified)
  const levelData = KOREAN_LEVELS.find(
    (l) => l.code === level && l.code !== 'not_specified'
  )
  if (!levelData) {
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
    .eq('korean_level', level)

  return generateFilterPageMetadata('by-language-level', level, count || 0)
}

export default async function JobsByLanguageLevelPage({ params }: PageProps) {
  const { level } = await params

  // Validate level against KOREAN_LEVELS (exclude not_specified)
  const levelData = KOREAN_LEVELS.find(
    (l) => l.code === level && l.code !== 'not_specified'
  )
  if (!levelData) {
    notFound()
  }

  const supabase = await createClient()

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const isAuthenticated = !!user

  // Query jobs filtered by korean_level
  const { data: jobs, count } = (await supabase
    .from('job_posts')
    .select('*', { count: 'exact' })
    .eq('review_status', 'published')
    .eq('hiring_status', 'hiring')
    .eq('korean_level', level)
    .order('published_at', { ascending: false })
    .limit(20)) as { data: JobPost[] | null; count: number | null }

  // Calculate company count (approximate using unique company names)
  const companyCount = jobs
    ? new Set(jobs.map((job) => job.company_name)).size
    : 0

  // Get filter page data
  const { title, titleKo } = getFilterPageTitle('by-language-level', level)
  const description = getFilterPageDescription('by-language-level', level)
  const faqs = getFilterPageFAQs('by-language-level', level)
  const crossLinks = getFilterCrossLinks('by-language-level', level)

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
        employmentType: job.job_type?.toUpperCase(),
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
      filterName={levelData.name}
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
