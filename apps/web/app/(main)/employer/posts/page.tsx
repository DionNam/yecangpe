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

  // Fetch like counts for each post
  const likeCounts: Record<string, number> = {}
  if (posts.length > 0) {
    const postIds = posts.map(p => p.id)
    for (const postId of postIds) {
      const { count } = await (supabase as any)
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', postId)
      likeCounts[postId] = count || 0
    }
  }

  return (
    <div className="container pt-4 pb-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">내 공고 관리</h1>
        <Button asChild>
          <Link href="/employer/new-post">구인글 올리기</Link>
        </Button>
      </div>

      <MyPostsTable
        posts={posts}
        metricsConfig={metricsConfig}
        likeCounts={likeCounts}
      />
    </div>
  )
}
