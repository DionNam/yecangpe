import Link from 'next/link'
import { createClient } from '@repo/supabase/server'
import { PostsTable } from '@/components/posts/posts-table'
import { Button } from '@/components/ui/button'

export default async function PostsPage() {
  const supabase = await createClient()

  const { data: posts } = await (supabase as any)
    .from('job_posts')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">전체 공고</h1>
          <p className="text-muted-foreground">모든 공고 목록을 관리합니다.</p>
        </div>
        <Button asChild>
          <Link href="/posts/new">공고 등록</Link>
        </Button>
      </div>
      <PostsTable posts={posts || []} />
    </div>
  )
}
