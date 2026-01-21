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
      <div className="container py-8">
        <div className="mb-8 space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">채용 공고</h1>
        </div>
        <p className="text-red-500">
          공고를 불러오는 중 오류가 발생했습니다.
        </p>
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
    <div className="container py-8">
      {/* Header section with descriptive content */}
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">채용 공고</h1>
        <p className="text-muted-foreground leading-relaxed">
          한국어 가능한 외국인을 위한 채용 공고를 확인하세요
        </p>
      </div>

      {/* Filters section */}
      <div className="mb-6">
        <JobListFilters
          currentNationality={nationality}
          currentSort={sortBy}
        />
      </div>

      {/* Table with card-like container */}
      <div className="rounded-lg border">
        <JobListTable
          posts={posts || []}
          isAuthenticated={isAuthenticated}
          metricsConfig={metricsConfig}
        />
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6">
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
        <div className="text-center py-12 text-muted-foreground">
          등록된 공고가 없습니다.
        </div>
      )}
    </div>
  )
}
