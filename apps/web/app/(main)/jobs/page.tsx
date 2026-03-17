import { Metadata } from 'next'
import { createClient } from '@repo/supabase/server'
import { JobListTable } from '@/components/jobs/job-list-table'
import { JobListFilters } from '@/components/jobs/job-list-filters'
import { JobListPagination } from '@/components/jobs/job-list-pagination'
import { JobsPageHeader } from '@/components/jobs/jobs-page-header'
import { JobsEmptyState } from '@/components/jobs/jobs-empty-state'
import type { Database } from '@repo/supabase/types'
import {
  getFilterPageTitle,
  getFilterPageDescription,
  type FilterDimension,
} from '@/lib/filter-page-data'

type JobPost = Database['public']['Tables']['job_posts']['Row']

interface SearchParams {
  q?: string
  job_type?: string
  location_type?: string
  category?: string
  korean_level?: string
  english_level?: string
  nationality?: string
  location_country?: string
  page?: string
  sort?: string
}

interface JobsPageProps {
  searchParams: Promise<SearchParams>
}

// Add ISR revalidation - revalidate every 5 minutes
export const revalidate = 300

export async function generateMetadata({ searchParams }: JobsPageProps): Promise<Metadata> {
  const params = await searchParams

  // Detect active filter for SEO-friendly metadata
  const filterMap: Array<{ param: string; dimension: FilterDimension }> = [
    { param: 'job_type', dimension: 'by-type' },
    { param: 'category', dimension: 'by-category' },
    { param: 'location_country', dimension: 'by-country' },
    { param: 'location_type', dimension: 'by-location-type' },
    { param: 'korean_level', dimension: 'by-language-level' },
  ]

  for (const { param, dimension } of filterMap) {
    const value = params[param as keyof SearchParams]
    if (value) {
      const { title: filterTitle } = getFilterPageTitle(dimension, value)
      const filterDescription = getFilterPageDescription(dimension, value)
      const fullTitle = `${filterTitle} - HangulJobs`
      return {
        title: fullTitle,
        description: filterDescription,
        alternates: {
          canonical: `/jobs?${param}=${value}`,
        },
        openGraph: {
          title: fullTitle,
          description: filterDescription,
          type: 'website',
          siteName: 'HangulJobs',
        },
        twitter: {
          card: 'summary_large_image',
          title: fullTitle,
          description: filterDescription,
        },
      }
    }
  }

  const supabase = await createClient()

  // Get job count for dynamic description
  const { count } = await supabase
    .from('job_posts')
    .select('*', { count: 'exact', head: true })
    .eq('review_status', 'published')
    .eq('hiring_status', 'hiring')

  const title = '한국어 가능한 외국인 채용 공고 | HangulJobs'
  const description = `${count || '수많은'}개의 검증된 외국인 채용 공고를 확인하세요. 한국어를 구사하는 글로벌 인재를 위한 신뢰할 수 있는 구인구직 플랫폼입니다.`

  return {
    title,
    description,
    alternates: {
      canonical: '/jobs',
    },
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: 'HangulJobs',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const params = await searchParams
  const keyword = params.q
  const jobTypeParam = params.job_type
  const locationTypeParam = params.location_type
  const category = params.category
  const koreanLevel = params.korean_level
  const englishLevel = params.english_level
  const nationality = params.nationality
  const locationCountry = params.location_country
  const page = parseInt(params.page || '1', 10)
  const sortBy = params.sort || 'latest'
  const pageSize = 10

  const supabase = await createClient()

  // Build query (doesn't depend on user)
  let query = supabase
    .from('job_posts')
    .select('*', { count: 'exact' })
    .eq('review_status', 'published')

  // Keyword search (FTS)
  if (keyword) {
    query = query.textSearch('fts', keyword, { type: 'websearch' })
  }

  // Multi-select filters with .in()
  const jobTypes = jobTypeParam?.split(',').filter(Boolean)
  if (jobTypes && jobTypes.length > 0) {
    query = query.in('job_type', jobTypes)
  }

  const locationTypes = locationTypeParam?.split(',').filter(Boolean)
  if (locationTypes && locationTypes.length > 0) {
    query = query.in('work_location_type', locationTypes)
  }

  // Single-select filters with .eq()
  if (category && category !== 'all') {
    query = query.eq('category', category)
  }

  if (koreanLevel && koreanLevel !== 'all') {
    query = query.eq('korean_level', koreanLevel)
  }

  if (englishLevel && englishLevel !== 'all') {
    query = query.eq('english_level', englishLevel)
  }

  if (locationCountry && locationCountry !== 'all') {
    query = query.eq('work_location_country', locationCountry)
  }

  // Apply nationality filter (keep existing logic with .or())
  if (nationality && nationality !== 'all') {
    query = query.or(
      `target_nationality.eq.${nationality},target_nationality.eq.ANY`
    )
  }

  // Sort: relevance when keyword present, otherwise latest or popular
  if (sortBy === 'relevance' && keyword) {
    // FTS relevance sorting is default when using textSearch
    // No explicit order needed
  } else if (sortBy === 'popular') {
    query = query.order('view_count', { ascending: false })
  } else {
    // Default: latest
    query = query.order('published_at', { ascending: false })
  }

  // Apply pagination
  const start = (page - 1) * pageSize
  const end = start + pageSize - 1
  query = query.range(start, end)

  // Run jobs query and user auth check in parallel
  const [queryResult, userResult] = await Promise.all([
    query.then((res: any) => res) as Promise<{ data: JobPost[] | null, count: number | null, error: any }>,
    supabase.auth.getUser(),
  ])

  const { data: posts, count, error } = queryResult
  const user = userResult?.data?.user || null
  const isAuthenticated = !!user

  // Check seeker status and fetch likes in parallel (if user is authenticated)
  let canLike = false
  let likedPostIds: Set<string> = new Set()
  if (user && posts && posts.length > 0) {
    const postIds = posts.map(p => p.id)
    const [seekerResult, likesResult] = await Promise.all([
      supabase.from('seeker_profiles').select('id').eq('user_id', user.id).single(),
      (supabase as any)
        .from('likes')
        .select('post_id')
        .eq('user_id', user.id)
        .in('post_id', postIds) as Promise<{ data: Array<{ post_id: string }> | null }>,
    ])

    canLike = !!seekerResult?.data
    if (likesResult?.data) {
      likedPostIds = new Set(likesResult.data.map(l => l.post_id))
    }
  } else if (user) {
    const { data: seekerProfile } = await supabase
      .from('seeker_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single()
    canLike = !!seekerProfile
  }

  if (error) {
    console.error('Error fetching job posts:', error)
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-10 pb-20">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
              채용 공고
            </h1>
          </div>
          <p className="text-red-500 text-lg text-center">
            공고를 불러오는 중 오류가 발생했습니다.
          </p>
        </div>
      </div>
    )
  }

  const totalPages = count ? Math.ceil(count / pageSize) : 0

  // Create ItemList structured data for SEO
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hanguljobs.com'
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: (posts || []).map((job, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'JobPosting',
        name: job.title,
        hiringOrganization: {
          '@type': 'Organization',
          name: job.company_name,
        },
        datePosted: job.created_at,
        jobLocationType: job.work_location_type?.toUpperCase(),
      },
    })),
  }

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-10 pb-24">
        {/* Header section with descriptive content */}
        <JobsPageHeader />

        {/* Filters section */}
        <div className="mb-10">
          <JobListFilters />
        </div>

        {/* Table with card-like container */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
          <JobListTable
            posts={posts || []}
            isAuthenticated={isAuthenticated}
            canLike={canLike}
            likedPostIds={likedPostIds}
          />
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <JobListPagination
              currentPage={page}
              totalPages={totalPages}
            />
          </div>
        )}

        {/* Empty state */}
        {(!posts || posts.length === 0) && <JobsEmptyState />}
      </div>
    </div>
  )
}
