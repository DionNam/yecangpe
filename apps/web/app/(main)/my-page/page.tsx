import { redirect } from 'next/navigation'
import { createClient } from '@repo/supabase/server'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProfileTab } from '@/components/my-page/profile-tab'
import { LikedJobsTab } from '@/components/my-page/liked-jobs-tab'
import type { Database } from '@repo/supabase/types'

type JobPost = Database['public']['Tables']['job_posts']['Row']

interface LikedJob {
  id: string
  post: JobPost | null
}

export default async function MyPage() {
  const supabase = await createClient()

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch seeker profile
  const { data: profile } = await supabase
    .from('seeker_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  // If no seeker profile, redirect to home (user is not a seeker)
  if (!profile) {
    redirect('/')
  }

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
  const likedJobs: LikedJob[] =
    (likedJobsData as any[])?.map((like: any) => ({
      id: like.id,
      post: Array.isArray(like.post) ? like.post[0] : like.post,
    })) || []

  // Fetch global metrics config
  const { data: configData } = await supabase
    .from('global_metrics_config')
    .select('ramp_days, curve_strength')
    .single()

  const metricsConfig = configData || {
    ramp_days: 14,
    curve_strength: 2.0,
  }

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">마이페이지</h1>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList>
          <TabsTrigger value="profile">프로필</TabsTrigger>
          <TabsTrigger value="liked">관심 공고</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <ProfileTab profile={profile} />
        </TabsContent>

        <TabsContent value="liked" className="mt-6">
          <LikedJobsTab jobs={likedJobs} metricsConfig={metricsConfig} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
