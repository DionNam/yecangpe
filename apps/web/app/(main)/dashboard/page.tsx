import { redirect } from 'next/navigation'
import { createClient } from '@repo/supabase/server'
import type { Database } from '@repo/supabase/types'
import { EmployerDashboard } from '@/components/dashboard/employer-dashboard'
import { SeekerDashboard } from '@/components/dashboard/seeker-dashboard'
import { AdminDashboardFull } from '@/components/dashboard/admin-dashboard-full'

type JobPost = Database['public']['Tables']['job_posts']['Row']
type SeekerProfile = Database['public']['Tables']['seeker_profiles']['Row']

export const metadata = {
  title: '대시보드',
}

export default async function DashboardPage() {
  const supabase = await createClient()

  // Authenticate user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check for admin role
  const { data: userRecord } = await (supabase as any)
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if ((userRecord as any)?.role === 'admin') {
    // Fetch all admin data in parallel
    const [
      postsResult,
      pendingResult,
      seekersResult,
      employersResult,
      subscribersResult,
      metricsResult,
      siteConfigResult,
      seekerCountResult,
      employerCountResult,
    ] = await Promise.all([
      (supabase as any).from('job_posts').select('*').order('created_at', { ascending: false }),
      (supabase as any).from('job_posts').select('*').eq('review_status', 'pending').order('created_at', { ascending: true }),
      (supabase as any).from('users').select('id, email, is_active, created_at, role, seeker_profiles(*)').eq('role', 'seeker').order('created_at', { ascending: false }),
      (supabase as any).from('users').select('id, email, is_active, created_at, role, employer_profiles(*)').eq('role', 'employer').order('created_at', { ascending: false }),
      (supabase as any).from('newsletter_subscribers').select('*').order('created_at', { ascending: false }),
      (supabase as any).from('global_metrics_config').select('*').maybeSingle(),
      (supabase as any).from('site_config').select('*').eq('key', 'member_count_offset').maybeSingle(),
      (supabase as any).from('users').select('*', { count: 'exact', head: true }).eq('role', 'seeker'),
      (supabase as any).from('users').select('*', { count: 'exact', head: true }).eq('role', 'employer'),
    ])

    const posts = postsResult.data || []
    const pendingPosts = pendingResult.data || []
    const seekers = seekersResult.data || []
    const employers = employersResult.data || []
    const subscribers = subscribersResult.data || []
    const metricsConfig = metricsResult.data || { view_target_min: 100, view_target_max: 500, like_target_min: 10, like_target_max: 50, ramp_days: 14, curve_strength: 2.0 }
    const siteConfig = siteConfigResult.data || { value: '0' }

    return (
      <AdminDashboardFull
        posts={posts}
        pendingPosts={pendingPosts}
        seekers={seekers}
        employers={employers}
        subscribers={subscribers}
        metricsConfig={metricsConfig}
        siteConfig={siteConfig}
        stats={{
          totalPosts: posts.length,
          pendingCount: pendingPosts.length,
          seekerCount: seekerCountResult.count || 0,
          employerCount: employerCountResult.count || 0,
          subscriberCount: subscribers.length,
        }}
      />
    )
  }

  // Check for employer profile
  const { data: employerProfile } = await supabase
    .from('employer_profiles')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  if (employerProfile) {
    const { data: postsData } = await (supabase as any)
      .from('job_posts')
      .select('*')
      .eq('author_id', user.id)
      .order('created_at', { ascending: false })

    const posts: JobPost[] = postsData || []

    const likeCounts: Record<string, number> = {}
    if (posts.length > 0) {
      const postIds = posts.map(p => p.id)
      const { data: likesData } = await (supabase as any)
        .from('likes')
        .select('post_id')
        .in('post_id', postIds)

      if (likesData) {
        likesData.forEach((like: { post_id: string }) => {
          likeCounts[like.post_id] = (likeCounts[like.post_id] || 0) + 1
        })
      }
      postIds.forEach(postId => {
        if (!likeCounts[postId]) {
          likeCounts[postId] = 0
        }
      })
    }

    return <EmployerDashboard profile={employerProfile} posts={posts} likeCounts={likeCounts} />
  }

  // Check for seeker profile
  const { data: seekerProfile } = await supabase
    .from('seeker_profiles')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  if (seekerProfile) {
    const profile = seekerProfile as SeekerProfile

    const [likedJobsResult, jobAlertsResult] = await Promise.all([
      (supabase as any)
        .from('likes')
        .select(`
          id,
          created_at,
          post:job_posts(
            id, title, slug, company_name, hiring_status
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }),
      (supabase as any)
        .from('job_alerts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }),
    ])

    const likedJobs =
      (likedJobsResult.data as any[])?.map((like: any) => ({
        id: like.id,
        created_at: like.created_at,
        post: Array.isArray(like.post) ? like.post[0] : like.post,
      })) || []

    const alerts = jobAlertsResult.data || []

    return <SeekerDashboard profile={profile} likedJobs={likedJobs} alerts={alerts} />
  }

  redirect('/onboarding')
}
