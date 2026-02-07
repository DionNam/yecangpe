import { redirect } from 'next/navigation'
import { createClient } from '@repo/supabase/server'
import Link from 'next/link'
import type { Database } from '@repo/supabase/types'

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

    // Render employer placeholder
    return (
      <div className="min-h-screen bg-slate-50 pt-6 pb-12">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-slate-600 font-medium text-xs tracking-widest uppercase mb-2">
              고용주 대시보드
            </p>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              내 공고 관리
            </h1>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <p className="text-lg text-slate-600 mb-4">
              등록한 공고: <span className="font-semibold text-slate-900">{posts.length}개</span>
            </p>
            <Link
              href="/dashboard/post-job"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4"
            >
              새 공고 작성
            </Link>
          </div>
        </div>
      </div>
    )
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
        post:job_posts(
          id, title, hiring_status, published_at, view_count, view_target, like_target
        )
      `
      )
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    // Transform the data to match expected type
    const likedJobs =
      (likedJobsData as any[])?.map((like: any) => ({
        id: like.id,
        post: Array.isArray(like.post) ? like.post[0] : like.post,
      })) || []

    // Fetch job alerts
    const { data: jobAlerts } = await (supabase as any)
      .from('job_alerts')
      .select('*')
      .eq('user_id', user.id)

    const alerts = jobAlerts || []

    // Render seeker placeholder
    return (
      <div className="min-h-screen bg-slate-50 pt-6 pb-12">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-slate-600 font-medium text-xs tracking-widest uppercase mb-2">
              구직자 대시보드
            </p>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              마이페이지
            </h1>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <p className="text-lg text-slate-600 mb-2">
              국적: <span className="font-semibold text-slate-900">{profile.nationality}</span>
            </p>
            <p className="text-lg text-slate-600">
              관심 공고: <span className="font-semibold text-slate-900">{likedJobs.length}개</span>
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Neither profile found, redirect to onboarding
  redirect('/onboarding')
}
