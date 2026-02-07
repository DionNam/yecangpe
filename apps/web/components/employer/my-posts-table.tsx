'use client'

import { useState } from 'react'
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
import { PostEditModal } from './post-edit-modal'
import { getDisplayMetrics } from '@/lib/utils/metrics'
import type { Database } from '@repo/supabase/types'

type JobPost = Database['public']['Tables']['job_posts']['Row']

interface MetricsConfig {
  ramp_days: number
  curve_strength: number
}

interface MyPostsTableProps {
  posts: JobPost[]
  metricsConfig: MetricsConfig
  likeCounts: Record<string, number>
}

export function MyPostsTable({
  posts,
  metricsConfig,
  likeCounts,
}: MyPostsTableProps) {
  const [editingPost, setEditingPost] = useState<JobPost | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)

  const handleEdit = (post: JobPost) => {
    setEditingPost(post)
    setIsEditOpen(true)
  }

  const handleEditClose = (open: boolean) => {
    setIsEditOpen(open)
    if (!open) {
      setEditingPost(null)
    }
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        등록한 공고가 없습니다. 새 공고를 작성해보세요.
      </div>
    )
  }

  const getReviewStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            심사중
          </Badge>
        )
      case 'published':
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            게시됨
          </Badge>
        )
      case 'rejected':
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            반려
          </Badge>
        )
      default:
        return null
    }
  }

  const getHiringStatusBadge = (status: 'hiring' | 'closed') => {
    return (
      <Badge variant={status === 'hiring' ? 'default' : 'secondary'}>
        {status === 'hiring' ? '채용중' : '마감'}
      </Badge>
    )
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">상태</TableHead>
            <TableHead className="w-[80px]">채용상태</TableHead>
            <TableHead>제목</TableHead>
            <TableHead className="w-[80px] text-right">조회수</TableHead>
            <TableHead className="w-[80px] text-right">관심수</TableHead>
            <TableHead className="w-[100px]">작성일</TableHead>
            <TableHead className="w-[100px]">액션</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map(post => {
            const isPublished = post.review_status === 'published'
            const isRejected = post.review_status === 'rejected'

            // Calculate display metrics only for published posts
            let displayViews = '-'
            let displayLikes = '-'

            if (isPublished && post.published_at) {
              const publishedAt = new Date(post.published_at)
              const realLikes = likeCounts[post.id] || 0
              const metrics = getDisplayMetrics(
                post.view_count,
                realLikes,
                post.view_target,
                post.like_target,
                publishedAt,
                metricsConfig
              )
              displayViews = metrics.displayViews.toLocaleString()
              displayLikes = metrics.displayLikes.toLocaleString()
            }

            // Format date
            const dateStr = new Date(post.created_at).toLocaleDateString(
              'ko-KR',
              {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              }
            )

            return (
              <TableRow key={post.id}>
                <TableCell>{getReviewStatusBadge(post.review_status)}</TableCell>
                <TableCell>
                  {getHiringStatusBadge(post.hiring_status)}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    {isPublished ? (
                      <Link
                        href={`/jobs/${post.slug || post.id}`}
                        className="hover:underline font-medium"
                      >
                        {post.title}
                      </Link>
                    ) : (
                      <span className="font-medium">{post.title}</span>
                    )}
                    {isRejected && post.rejection_reason && (
                      <span className="text-sm text-red-600">
                        반려 사유: {post.rejection_reason}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {displayViews}
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {displayLikes}
                </TableCell>
                <TableCell className="text-muted-foreground">{dateStr}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(post)}
                  >
                    수정
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      {editingPost && (
        <PostEditModal
          open={isEditOpen}
          onOpenChange={handleEditClose}
          postId={editingPost.id}
          defaultValues={{
            title: editingPost.title,
            content: editingPost.content,
            hiring_status: editingPost.hiring_status,
            work_location_type: editingPost.work_location_type,
            work_location_country: editingPost.work_location_country,
            image_url: editingPost.image_url,
          }}
          reviewStatus={editingPost.review_status}
        />
      )}
    </>
  )
}
