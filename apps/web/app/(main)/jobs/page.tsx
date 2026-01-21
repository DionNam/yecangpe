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
}

interface JobsPageProps {
  searchParams: Promise<SearchParams>
}

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const params = await searchParams
  const nationality = params.nationality
  const page = parseInt(params.page || '1', 10)
  const sortBy = params.sort || 'latest'
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
      <div className="grain-texture gradient-mesh min-h-screen">
        <div className="container-generous section-spacious">
          <div className="mb-12 space-y-6 relative">
            <div className="decorative-line fade-in-up">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-display">
                채용 공고
              </h1>
            </div>
          </div>
          <p className="text-red-500 text-lg">
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

  return (
    <div className="grain-texture gradient-mesh min-h-screen">
      <div className="container-generous section-spacious">
        {/* Header section with descriptive content */}
        <div className="mb-12 space-y-6 relative">
          <div className="decorative-line fade-in-up">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-display">
              채용 공고
            </h1>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl fade-in-up delay-100">
            한국어 가능한 외국인을 위한 채용 공고를 확인하세요
          </p>
        </div>

        {/* Filters section */}
        <div className="mb-8">
          <JobListFilters
            currentNationality={nationality}
            currentSort={sortBy}
          />
        </div>

        {/* Table with card-like container */}
        <div className="bg-card/80 backdrop-blur-sm rounded-xl border shadow-soft overflow-hidden fade-in-up delay-200">
          <JobListTable
            posts={posts || []}
            isAuthenticated={isAuthenticated}
            metricsConfig={metricsConfig}
          />
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8">
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
          <div className="text-center py-20 text-muted-foreground text-lg">
            등록된 공고가 없습니다.
          </div>
        )}
      </div>
    </div>
  )
}
