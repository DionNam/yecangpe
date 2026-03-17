'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useTranslation } from '@/lib/i18n'
import { Eye, MousePointerClick, Heart, Edit, Trash2 } from 'lucide-react'
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
import { PostEditModal } from '@/components/employer/post-edit-modal'
import { deleteJobPost } from '@/app/actions/employer'
import type { Database } from '@repo/supabase/types'

type JobPost = Database['public']['Tables']['job_posts']['Row']

interface JobPostTableProps {
  posts: JobPost[]
  likeCounts: Record<string, number>
  onPostDeleted: () => void
}

export function JobPostTable({ posts, likeCounts, onPostDeleted }: JobPostTableProps) {
  const [editingPost, setEditingPost] = useState<JobPost | null>(null)
  const [isPending, startTransition] = useTransition()
  const { t } = useTranslation()

  // Split posts into active and expired
  const now = new Date()
  const activePosts = posts.filter((post) => {
    if (!post.expires_at) return true
    return new Date(post.expires_at) > now
  })

  const expiredPosts = posts.filter((post) => {
    if (!post.expires_at) return false
    return new Date(post.expires_at) <= now
  })

  const handleDelete = (postId: string, title: string) => {
    if (!window.confirm(`${t('jobPostTable.confirmDelete')}\n\n"${title}"`)) {
      return
    }

    startTransition(async () => {
      const result = await deleteJobPost(postId)
      if ('error' in result) {
        alert(result.error)
      } else {
        onPostDeleted()
      }
    })
  }

  const renderPostRow = (post: JobPost, dimmed = false) => {
    const reviewStatusBadge = {
      published: { text: t('jobPostTable.published'), variant: 'default' as const },
      pending: { text: t('jobPostTable.pending'), variant: 'secondary' as const },
      rejected: { text: t('jobPostTable.rejected'), variant: 'destructive' as const },
    }[post.review_status]

    const likeCount = likeCounts[post.id] || 0
    const applyClickCount = post.apply_click_count || 0

    return (
      <TableRow key={post.id} className={dimmed ? 'opacity-60' : ''}>
        <TableCell>
          <div className="space-y-1">
            <Badge variant={reviewStatusBadge.variant}>{reviewStatusBadge.text}</Badge>
          </div>
        </TableCell>
        <TableCell>
          <div className="space-y-1">
            {post.review_status === 'published' ? (
              <Link
                href={`/jobs/${post.slug || post.id}`}
                className="font-medium hover:underline"
                target="_blank"
              >
                {post.title}
              </Link>
            ) : (
              <span className="font-medium">{post.title}</span>
            )}
            {post.review_status === 'rejected' && post.rejection_reason && (
              <p className="text-sm text-red-600">{t('jobPostTable.reason')} {post.rejection_reason}</p>
            )}
          </div>
        </TableCell>
        <TableCell className="text-center">
          <div className="flex items-center justify-center gap-1">
            <Eye className="h-4 w-4 text-slate-500" />
            <span>{post.view_count}</span>
          </div>
        </TableCell>
        <TableCell className="text-center">
          <div className="flex items-center justify-center gap-1">
            <MousePointerClick className="h-4 w-4 text-slate-500" />
            <span>{applyClickCount}</span>
          </div>
        </TableCell>
        <TableCell className="text-center">
          <div className="flex items-center justify-center gap-1">
            <Heart className="h-4 w-4 text-slate-500" />
            <span>{likeCount}</span>
          </div>
        </TableCell>
        <TableCell>
          <div className="text-sm text-slate-600">
            {new Date(post.published_at || post.created_at).toLocaleDateString('ko-KR')}
          </div>
        </TableCell>
        <TableCell>
          {post.expires_at ? (
            <div className="text-sm text-slate-600">
              {new Date(post.expires_at).toLocaleDateString('ko-KR')}
            </div>
          ) : (
            <div className="text-sm text-slate-400">-</div>
          )}
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditingPost(post)}
              disabled={isPending}
            >
              <Edit className="h-4 w-4 mr-1" />
              {t('jobPostTable.edit')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDelete(post.id, post.title)}
              disabled={isPending}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              {t('jobPostTable.delete')}
            </Button>
          </div>
        </TableCell>
      </TableRow>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        <p className="text-lg">{t('jobPostTable.noPosts')}</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-8">
        {/* Active posts section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">{t('jobPostTable.activeJobs')} ({activePosts.length})</h3>
          {activePosts.length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('jobPostTable.status')}</TableHead>
                    <TableHead>{t('jobPostTable.title')}</TableHead>
                    <TableHead className="text-center">{t('jobPostTable.views')}</TableHead>
                    <TableHead className="text-center">{t('jobPostTable.applyClicks')}</TableHead>
                    <TableHead className="text-center">{t('jobPostTable.likes')}</TableHead>
                    <TableHead>{t('jobPostTable.createdAt')}</TableHead>
                    <TableHead>{t('jobPostTable.expiresAt')}</TableHead>
                    <TableHead>{t('jobPostTable.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activePosts.map((post) => renderPostRow(post))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400 border border-dashed rounded-lg">
              {t('jobPostTable.noActivePosts')}
            </div>
          )}
        </div>

        {/* Expired posts section */}
        {expiredPosts.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('jobPostTable.expiredJobs')} ({expiredPosts.length})</h3>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('jobPostTable.status')}</TableHead>
                    <TableHead>{t('jobPostTable.title')}</TableHead>
                    <TableHead className="text-center">{t('jobPostTable.views')}</TableHead>
                    <TableHead className="text-center">{t('jobPostTable.applyClicks')}</TableHead>
                    <TableHead className="text-center">{t('jobPostTable.likes')}</TableHead>
                    <TableHead>{t('jobPostTable.createdAt')}</TableHead>
                    <TableHead>{t('jobPostTable.expiresAt')}</TableHead>
                    <TableHead>{t('jobPostTable.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expiredPosts.map((post) => renderPostRow(post, true))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingPost && (
        <PostEditModal
          open={!!editingPost}
          onOpenChange={(open) => {
            if (!open) {
              setEditingPost(null)
              onPostDeleted() // Refresh data after edit
            }
          }}
          postId={editingPost.id}
          defaultValues={{
            title: editingPost.title,
            content: editingPost.content,
            hiring_status: editingPost.hiring_status,
            work_location_type: editingPost.work_location_type,
            work_location_country: editingPost.work_location_country,
            image_url: editingPost.image_url,
            job_type: editingPost.job_type,
            category: editingPost.category,
            korean_level: editingPost.korean_level,
            english_level: editingPost.english_level,
            salary_min: editingPost.salary_min,
            salary_max: editingPost.salary_max,
            salary_currency: editingPost.salary_currency,
            salary_period: editingPost.salary_period,
            career_level: editingPost.career_level,
            apply_url: editingPost.apply_url,
            apply_email: editingPost.apply_email,
          }}
          reviewStatus={editingPost.review_status}
        />
      )}
    </>
  )
}
