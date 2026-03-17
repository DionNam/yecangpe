'use client'

import { useState, useTransition } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye, Trash2 } from 'lucide-react'
import { approvePost, rejectPost } from '@/app/actions/admin-posts'
import { deleteJobPost } from '@/app/actions/employer'
import { RejectionDialog } from './rejection-dialog'
import { PostEditForm } from './post-edit-form'
import type { Database } from '@repo/supabase/types'

type JobPost = Database['public']['Tables']['job_posts']['Row']

interface PostsTableProps {
  posts: JobPost[]
  showApprovalActions?: boolean
}

export function PostsTable({ posts, showApprovalActions = false }: PostsTableProps) {
  const [isPending, startTransition] = useTransition()
  const [rejectingPost, setRejectingPost] = useState<string | null>(null)
  const [editingPost, setEditingPost] = useState<JobPost | null>(null)

  const handleApprove = (postId: string) => {
    startTransition(async () => {
      try {
        await approvePost(postId)
      } catch (error) {
        console.error('Approval error:', error)
        alert(error instanceof Error ? error.message : '승인에 실패했습니다.')
      }
    })
  }

  const handleReject = (postId: string, reason: string) => {
    startTransition(async () => {
      try {
        await rejectPost(postId, reason)
        setRejectingPost(null)
      } catch (error) {
        console.error('Rejection error:', error)
        alert(error instanceof Error ? error.message : '반려에 실패했습니다.')
      }
    })
  }

  const handleDelete = (postId: string, title: string) => {
    if (!confirm(`정말 삭제하시겠습니까?\n\n"${title}"`)) return
    startTransition(async () => {
      try {
        await deleteJobPost(postId)
      } catch (error) {
        alert('삭제에 실패했습니다.')
      }
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">심사중</Badge>
      case 'published':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">게시됨</Badge>
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">반려</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        공고가 없습니다.
      </div>
    )
  }

  // Show edit form if a post is selected
  if (editingPost) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">공고 수정: {editingPost.title}</h3>
          <Button variant="outline" onClick={() => setEditingPost(null)}>
            목록으로
          </Button>
        </div>
        <PostEditForm
          postId={editingPost.id}
          defaultValues={{
            title: editingPost.title,
            content: editingPost.content,
            company_name: editingPost.company_name,
            target_nationality: editingPost.target_nationality,
            work_location_type: editingPost.work_location_type as 'remote' | 'hybrid' | 'on_site',
            work_location_country: editingPost.work_location_country || undefined,
            job_type: editingPost.job_type || undefined,
            category: editingPost.category || undefined,
            korean_level: editingPost.korean_level || undefined,
            english_level: editingPost.english_level || undefined,
            salary_min: editingPost.salary_min || undefined,
            salary_max: editingPost.salary_max || undefined,
            salary_currency: editingPost.salary_currency || undefined,
            salary_period: editingPost.salary_period || undefined,
            career_level: editingPost.career_level || undefined,
            apply_url: editingPost.apply_url || undefined,
            apply_email: editingPost.apply_email || undefined,
            image_url: editingPost.image_url || undefined,
          }}
        />
      </div>
    )
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>상태</TableHead>
            <TableHead>제목</TableHead>
            <TableHead>회사명</TableHead>
            <TableHead>국적</TableHead>
            <TableHead>작성일</TableHead>
            <TableHead>액션</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell>{getStatusBadge(post.review_status)}</TableCell>
              <TableCell className="font-medium">
                <button
                  onClick={() => setEditingPost(post)}
                  className="hover:underline text-left text-blue-600"
                >
                  {post.title}
                </button>
              </TableCell>
              <TableCell>{post.company_name}</TableCell>
              <TableCell>{post.target_nationality}</TableCell>
              <TableCell>
                {new Date(post.created_at).toLocaleDateString('ko-KR')}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  {showApprovalActions && post.review_status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleApprove(post.id)}
                        disabled={isPending}
                      >
                        승인
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setRejectingPost(post.id)}
                        disabled={isPending}
                      >
                        반려
                      </Button>
                    </>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingPost(post)}
                    disabled={isPending}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(post.id, post.title)}
                    disabled={isPending}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <RejectionDialog
        open={!!rejectingPost}
        onOpenChange={(open) => !open && setRejectingPost(null)}
        onConfirm={(reason) => rejectingPost && handleReject(rejectingPost, reason)}
      />
    </>
  )
}
