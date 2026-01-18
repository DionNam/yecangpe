import { createClient } from '@repo/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { JobDetail } from '@/components/jobs/job-detail'
import { getDisplayMetrics } from '@/lib/utils/metrics'
import type { Database } from '@repo/supabase/types'

type JobPost = Database['public']['Tables']['job_posts']['Row']

interface JobDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params

  const supabase = await createClient()

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch the job post
  const { data: job, error: jobError } = await supabase
    .from('job_posts')
    .select('*')
    .eq('id', id)
    .eq('review_status', 'published')
    .single<JobPost>()

  if (jobError || !job) {
    notFound()
  }

  // Increment view count (SECURITY DEFINER function bypasses RLS)
  await (supabase as any).rpc('increment_view_count', { post_id: id })

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
    post_id: id,
  })
  const realLikes = (likeCountData as number) || 0

  // Check if current user liked the post
  const { data: isLikedData } = await (supabase as any).rpc('user_liked_post', {
    post_id: id,
  })
  const isLiked = (isLikedData as boolean) || false

  // Check if user can like (seeker only)
  const { data: seekerProfile } = await supabase
    .from('seeker_profiles')
    .select('id')
    .eq('user_id', user.id)
    .single()

  const canLike = !!seekerProfile

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
    <div className="container py-8">
      <JobDetail
        job={job}
        displayViews={displayViews}
        displayLikes={displayLikes}
        isLiked={isLiked}
        canLike={canLike}
      />
    </div>
  )
}
