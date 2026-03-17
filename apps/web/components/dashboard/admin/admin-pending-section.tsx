'use client'

import { PostsTable } from './posts-table'
import type { Database } from '@repo/supabase/types'

type JobPost = Database['public']['Tables']['job_posts']['Row']

interface AdminPendingSectionProps {
  posts: JobPost[]
}

export function AdminPendingSection({ posts }: AdminPendingSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">승인 대기 공고</h2>
      {posts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center text-slate-500">
          승인 대기중인 공고가 없습니다
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <PostsTable posts={posts} showApprovalActions={true} />
        </div>
      )}
    </div>
  )
}
