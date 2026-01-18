import { createClient } from '@repo/supabase/server'
import { PostsTable } from '@/components/posts/posts-table'

export default async function PendingPostsPage() {
  const supabase = await createClient()

  const { data: posts } = await (supabase as any)
    .from('job_posts')
    .select('*')
    .eq('review_status', 'pending')
    .order('created_at', { ascending: true })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">승인 대기</h1>
        <p className="text-muted-foreground">심사가 필요한 공고 목록입니다.</p>
      </div>
      <PostsTable posts={posts || []} showApprovalActions={true} />
    </div>
  )
}
