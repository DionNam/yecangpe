import { createClient } from '@repo/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { JobDetailPage as JobDetailPageComponent } from '@/components/jobs/job-detail-page'
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

  // Fetch the job post by slug with employer profile join for company_website
  const { data: job, error: jobError } = await supabase
    .from('job_posts')
    .select(`
      *,
      author:users!job_posts_author_id_fkey (
        employer_profile:employer_profiles (
          company_website
        )
      )
    `)
    .eq('slug', slug)
    .eq('review_status', 'published')
    .single()

  // If not found by slug, check if slug is a UUID and try redirect
  if (jobError || !job) {
    if (UUID_REGEX.test(slug)) {
      // Try to find by ID and redirect to slug URL
      const { data: jobById } = await supabase
        .from('job_posts')
        .select('slug')
        .eq('id', slug)
        .eq('review_status', 'published')
        .single()

      if (jobById && (jobById as any).slug) {
        redirect(`/jobs/${(jobById as any).slug}`)
      }
    }
    notFound()
  }

  // Type assertion for job with nested relations
  const jobData = job as any as JobPost

  // Get authenticated user (optional for viewing - required for like/apply actions)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Increment view count (SECURITY DEFINER function bypasses RLS)
  await (supabase as any).rpc('increment_view_count', { post_id: jobData.id })

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
    post_id: jobData.id,
  })
  const realLikes = (likeCountData as number) || 0

  // Check if current user liked the post (only if logged in)
  let isLiked = false
  let canLike = false

  if (user) {
    const { data: isLikedData } = await (supabase as any).rpc('user_liked_post', {
      post_id: jobData.id,
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
  const publishedAt = new Date(jobData.published_at || jobData.created_at)
  const { displayViews, displayLikes } = getDisplayMetrics(
    jobData.view_count,
    realLikes,
    jobData.view_target,
    jobData.like_target,
    publishedAt,
    metricsConfig
  )

  // Extract company_website from nested join (with type safety)
  const companyWebsite = (job as any).author?.employer_profile?.company_website || null

  return (
    <div className="min-h-screen bg-slate-50">
      <JobDetailPageComponent
        job={jobData}
        isLiked={isLiked}
        canLike={canLike}
        displayLikes={displayLikes}
        displayViews={displayViews}
        user={user}
        companyWebsite={companyWebsite}
      />
    </div>
  )
}
