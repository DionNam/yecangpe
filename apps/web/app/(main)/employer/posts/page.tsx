import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@repo/supabase/server'
import { Button } from '@/components/ui/button'
import { MyPostsTable } from '@/components/employer/my-posts-table'
import type { Database } from '@repo/supabase/types'

type JobPost = Database['public']['Tables']['job_posts']['Row']

export default async function EmployerPostsPage() {
  const supabase = await createClient()

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check if user is an employer
  const { data: employerProfile } = await supabase
    .from('employer_profiles')
    .select('user_id')
    .eq('user_id', user.id)
    .single()

  if (!employerProfile) {
    redirect('/')
  }

  // Fetch employer's posts ordered by created_at descending
  const { data: postsData } = await (supabase as any)
    .from('job_posts')
    .select('*')
    .eq('author_id', user.id)
    .order('created_at', { ascending: false })

  const posts: JobPost[] = postsData || []

  // Fetch global_metrics_config
  const { data: configData } = await supabase
    .from('global_metrics_config')
    .select('ramp_days, curve_strength')
    .single()

  const metricsConfig = configData || {
    ramp_days: 14,
    curve_strength: 2.0,
  }

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

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Decorative gradient blob */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

      {/* Grain texture overlay */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgb(15 23 42) 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-10 pb-24">
        {/* Header section with three-tier typography */}
        <div className="text-center mb-16 space-y-4">
          <p className="text-slate-600 font-medium text-xs tracking-widest uppercase mb-3">
            구인자 대시보드
          </p>
          <div className="inline-block relative">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
              내 공고 관리
            </h1>
            <div className="absolute -bottom-2 left-0 right-0 h-3 bg-primary/10 -rotate-1 -z-10 rounded-full"></div>
          </div>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mt-6">
            등록한 채용 공고를 관리하고 지원자를 확인하세요
          </p>

          {/* CTA button centered below description */}
          <div className="pt-4">
            <Button asChild size="lg">
              <Link href="/employer/new-post">구인글 올리기</Link>
            </Button>
          </div>
        </div>

        {/* Table with card wrapper */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <MyPostsTable
            posts={posts}
            metricsConfig={metricsConfig}
            likeCounts={likeCounts}
          />
        </div>
      </div>
    </div>
  )
}
