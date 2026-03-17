'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
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
import { approvePost, rejectPost } from '@/app/actions/admin-posts'
import { RejectionDialog } from './rejection-dialog'
import type { Database } from '@repo/supabase/types'

type JobPost = Database['public']['Tables']['job_posts']['Row']

interface PostsTableProps {
  posts: JobPost[]
  showApprovalActions?: boolean
}

export function PostsTable({ posts, showApprovalActions = false }: PostsTableProps) {
  const [isPending, startTransition] = useTransition()
  const [rejectingPost, setRejectingPost] = useState<string | null>(null)

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
            {showApprovalActions && <TableHead>액션</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell>{getStatusBadge(post.review_status)}</TableCell>
              <TableCell className="font-medium">
                <Link
                  href={`/posts/${post.id}`}
                  className="hover:underline"
                >
                  {post.title}
                </Link>
              </TableCell>
              <TableCell>{post.company_name}</TableCell>
              <TableCell>{post.target_nationality}</TableCell>
              <TableCell>
                {new Date(post.created_at).toLocaleDateString('ko-KR')}
              </TableCell>
              {showApprovalActions && (
                <TableCell>
                  {post.review_status === 'pending' && (
                    <div className="flex gap-2">
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
                    </div>
                  )}
                </TableCell>
              )}
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
