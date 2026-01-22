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
    <div className="min-h-screen bg-slate-50 pt-6 pb-12">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <div className="mb-10">
          <p className="text-slate-600 font-medium text-xs tracking-widest uppercase mb-2">마이페이지</p>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            내 정보 및 활동
          </h1>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[600px]">
          <Tabs defaultValue="profile" className="w-full">
            <div className="border-b border-slate-200 bg-slate-50/50 px-6 pt-2">
              <TabsList className="bg-transparent h-12 p-0 space-x-8">
                <TabsTrigger 
                  value="profile" 
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-slate-900 data-[state=active]:text-slate-900 rounded-none h-12 px-2 text-slate-500 font-medium"
                >
                  프로필
                </TabsTrigger>
                <TabsTrigger 
                  value="liked" 
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-slate-900 data-[state=active]:text-slate-900 rounded-none h-12 px-2 text-slate-500 font-medium"
                >
                  관심 공고
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6 md:p-8">
              <TabsContent value="profile" className="mt-0 focus-visible:outline-none">
                <ProfileTab profile={profile} />
              </TabsContent>

              <TabsContent value="liked" className="mt-0 focus-visible:outline-none">
                <LikedJobsTab jobs={likedJobs} metricsConfig={metricsConfig} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
