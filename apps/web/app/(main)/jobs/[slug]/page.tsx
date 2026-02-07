import { createClient } from '@repo/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { JobDetail } from '@/components/jobs/job-detail'
import { getDisplayMetrics } from '@/lib/utils/metrics'
import type { Database } from '@repo/supabase/types'

type JobPost = Database['public']['Tables']['job_posts']['Row']

interface JobDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

// UUID regex pattern for checking if slug is actually a UUID
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { slug } = await params

  const supabase = await createClient()

  // Fetch the job post by slug
  const { data: job, error: jobError } = await supabase
    .from('job_posts')
    .select('*')
    .eq('slug', slug)
    .eq('review_status', 'published')
    .single<JobPost>()

  // If not found by slug, check if slug is a UUID and try redirect
  if (jobError || !job) {
    if (UUID_REGEX.test(slug)) {
      // Try to find by ID and redirect to slug URL
      const { data: jobById } = await supabase
        .from('job_posts')
        .select('slug')
        .eq('id', slug)
        .eq('review_status', 'published')
        .single<JobPost>()

      if (jobById && jobById.slug) {
        redirect(`/jobs/${jobById.slug}`)
      }
    }
    notFound()
  }

  // Get authenticated user (optional for viewing - required for like/apply actions)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Increment view count (SECURITY DEFINER function bypasses RLS)
  await (supabase as any).rpc('increment_view_count', { post_id: job.id })

  // Fetch global metrics config
  const { data: configData } = await supabase
    .from('global_metrics_config')
    .select('ramp_days, curve_strength')
    .single()

  const metricsConfig = configData || {
    ramp_days: 14,
    curve_strength: 2.0,
  }

  // Get like count
  const { data: likeCountData } = await (supabase as any).rpc('get_like_count', {
    post_id: job.id,
  })
  const realLikes = (likeCountData as number) || 0

  // Check if current user liked the post (only if logged in)
  let isLiked = false
  let canLike = false

  if (user) {
    const { data: isLikedData } = await (supabase as any).rpc('user_liked_post', {
      post_id: job.id,
    })
    isLiked = (isLikedData as boolean) || false

    // Check if user can like (seeker only)
    const { data: seekerProfile } = await supabase
      .from('seeker_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single()

    canLike = !!seekerProfile
  }

  // Calculate display metrics
  const publishedAt = new Date(job.published_at || job.created_at)
  const { displayViews, displayLikes } = getDisplayMetrics(
    job.view_count,
    realLikes,
    job.view_target,
    job.like_target,
    publishedAt,
    metricsConfig
  )

  return (
    <div className="min-h-screen bg-slate-50 pt-6 pb-12">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="mb-6">
          <a
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
          </a>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <JobDetail
              job={job}
              displayViews={displayViews}
              displayLikes={displayLikes}
              isLiked={isLiked}
              canLike={canLike}
            />
        </div>
      </div>
    </div>
  )
}
