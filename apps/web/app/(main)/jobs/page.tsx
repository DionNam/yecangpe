import { Metadata } from 'next'
import { createClient } from '@repo/supabase/server'
import { JobListTable } from '@/components/jobs/job-list-table'
import { JobListFilters } from '@/components/jobs/job-list-filters'
import { JobListPagination } from '@/components/jobs/job-list-pagination'
import type { Database } from '@repo/supabase/types'

type JobPost = Database['public']['Tables']['job_posts']['Row']
type GlobalMetricsConfig =
  Database['public']['Tables']['global_metrics_config']['Row']

interface SearchParams {
  nationality?: string
  page?: string
  sort?: string
  location_type?: string
  location_country?: string
}

interface JobsPageProps {
  searchParams: Promise<SearchParams>
}

// Add ISR revalidation - revalidate every 5 minutes
export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createClient()

  // Get job count for dynamic description
  const { count } = await supabase
    .from('job_posts')
    .select('*', { count: 'exact', head: true })
    .eq('review_status', 'published')
    .eq('hiring_status', 'hiring')

  const title = '한국어 가능한 외국인 채용 공고 | PotenHire'
  const description = `${count || '수많은'}개의 검증된 외국인 채용 공고를 확인하세요. 한국어를 구사하는 글로벌 인재를 위한 신뢰할 수 있는 구인구직 플랫폼입니다.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
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
  const nationality = params.nationality
  const page = parseInt(params.page || '1', 10)
  const sortBy = params.sort || 'latest'
  const locationType = params.location_type
  const locationCountry = params.location_country
  const pageSize = 10

  const supabase = await createClient()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const isAuthenticated = !!user

  // Build query
  let query = supabase
    .from('job_posts')
    .select('*', { count: 'exact' })
    .eq('review_status', 'published')

  // Apply nationality filter
  if (nationality && nationality !== 'all') {
    query = query.or(
      `target_nationality.eq.${nationality},target_nationality.eq.ANY`
    )
  }

  // Apply location type filter
  if (locationType && locationType !== 'all') {
    query = query.eq('work_location_type', locationType)
  }

  // Apply location country filter (only for on_site jobs)
  if (locationCountry && locationCountry !== 'all') {
    query = query.eq('work_location_country', locationCountry)
  }

  // Apply sorting
  if (sortBy === 'popular') {
    query = query.order('view_count', { ascending: false })
  } else {
    // Default: latest
    query = query.order('published_at', { ascending: false })
  }

  // Apply pagination
  const start = (page - 1) * pageSize
  const end = start + pageSize - 1
  query = query.range(start, end)

  const { data: posts, count, error } = await query

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

  // Fetch global metrics config
  const { data: configData } = await supabase
    .from('global_metrics_config')
    .select('ramp_days, curve_strength')
    .single()

  const metricsConfig = configData || {
    ramp_days: 14,
    curve_strength: 2.0,
  }

  const totalPages = count ? Math.ceil(count / pageSize) : 0

  // Create ItemList structured data for SEO
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://potenhire.com'
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
        employmentType: job.employment_type?.toUpperCase(),
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
        <div className="text-center mb-16 space-y-4">
          <p className="text-slate-600 font-medium text-xs tracking-widest uppercase mb-3">채용 공고</p>
          <div className="inline-block relative">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 relative z-10">
              맞춤형 채용 공고
            </h1>
            <div className="absolute -bottom-2 left-0 right-0 h-3 bg-primary/10 -rotate-1 -z-10 rounded-full"></div>
          </div>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mt-6">
            한국어 가능한 외국인을 위한 다양한 직무의 채용 공고를 확인하세요
          </p>
        </div>

        {/* Filters section */}
        <div className="mb-10">
          <JobListFilters
            currentNationality={nationality}
            currentSort={sortBy}
            currentLocationType={locationType}
            currentLocationCountry={locationCountry}
          />
        </div>

        {/* Table with card-like container */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
          <JobListTable
            posts={posts || []}
            isAuthenticated={isAuthenticated}
            metricsConfig={metricsConfig}
          />
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <JobListPagination
              currentPage={page}
              totalPages={totalPages}
              nationality={nationality}
              sort={sortBy}
            />
          </div>
        )}

        {/* Empty state */}
        {(!posts || posts.length === 0) && (
          <div className="text-center py-32">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">등록된 공고가 없습니다</h3>
            <p className="text-slate-500">
              조건을 변경하거나 나중에 다시 확인해주세요
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
