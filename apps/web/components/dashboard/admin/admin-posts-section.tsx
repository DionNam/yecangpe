'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PostsTable } from './posts-table'
import { PostCreateForm } from './post-create-form'
import type { Database } from '@repo/supabase/types'

type JobPost = Database['public']['Tables']['job_posts']['Row']

interface AdminPostsSectionProps {
  posts: JobPost[]
}

export function AdminPostsSection({ posts }: AdminPostsSectionProps) {
  const [showCreateForm, setShowCreateForm] = useState(false)

  if (showCreateForm) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">새 공고 작성</h2>
          <Button variant="outline" onClick={() => setShowCreateForm(false)}>
            목록으로
          </Button>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <PostCreateForm />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">전체 공고</h2>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          새 공고 작성
        </Button>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <PostsTable posts={posts} showApprovalActions={false} />
      </div>
    </div>
  )
}
