import { redirect } from 'next/navigation'
import { createClient } from '@repo/supabase/server'
import Link from 'next/link'
import type { Database } from '@repo/supabase/types'
import { EmployerDashboard } from '@/components/dashboard/employer-dashboard'
import { SeekerDashboard } from '@/components/dashboard/seeker-dashboard'

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

  // Check for employer profile
  const { data: employerProfile } = await supabase
    .from('employer_profiles')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  if (employerProfile) {
    // Fetch employer's job posts
    const { data: postsData } = await (supabase as any)
      .from('job_posts')
      .select('*')
      .eq('author_id', user.id)
      .order('created_at', { ascending: false })

    const posts: JobPost[] = postsData || []

    // Fetch like counts for all posts in a single query
    const likeCounts: Record<string, number> = {}
    if (posts.length > 0) {
      const postIds = posts.map(p => p.id)
      const { data: likesData } = await (supabase as any)
        .from('likes')
        .select('post_id')
        .in('post_id', postIds)

      // Count likes per post
      if (likesData) {
        likesData.forEach((like: { post_id: string }) => {
          likeCounts[like.post_id] = (likeCounts[like.post_id] || 0) + 1
        })
      }

      // Initialize counts to 0 for posts with no likes
      postIds.forEach(postId => {
        if (!likeCounts[postId]) {
          likeCounts[postId] = 0
        }
      })
    }

    // Render employer dashboard
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
    // Fetch liked jobs with joined query
    const { data: likedJobsData } = await (supabase as any)
      .from('likes')
      .select(
        `
        id,
        created_at,
        post:job_posts(
          id, title, slug, company_name, hiring_status
        )
      `
      )
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    // Transform the data to match expected type
    const likedJobs =
      (likedJobsData as any[])?.map((like: any) => ({
        id: like.id,
        created_at: like.created_at,
        post: Array.isArray(like.post) ? like.post[0] : like.post,
      })) || []

    // Fetch job alerts
    const { data: jobAlerts } = await (supabase as any)
      .from('job_alerts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    const alerts = jobAlerts || []

    // Render seeker dashboard
    return <SeekerDashboard profile={profile} likedJobs={likedJobs} alerts={alerts} />
  }

  // Neither profile found, redirect to onboarding
  redirect('/onboarding')
}
