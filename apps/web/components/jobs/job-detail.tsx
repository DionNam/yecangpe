'use client'

import { useState } from 'react'
import Image from 'next/image'
import { JobDetailHeader } from './job-detail-header'
import { LikeButton } from './like-button'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { X } from 'lucide-react'
import type { Database } from '@repo/supabase/types'

type JobPost = Database['public']['Tables']['job_posts']['Row']

interface JobDetailProps {
  job: JobPost
  displayViews: number
  displayLikes: number
  isLiked: boolean
  canLike: boolean
}

export function JobDetail({
  job,
  displayViews,
  displayLikes,
  isLiked,
  canLike,
}: JobDetailProps) {
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false)

  return (
    <div>


      {/* Header with metadata */}
      <JobDetailHeader
        title={job.title}
        companyName={job.company_name}
        nationality={job.target_nationality}
        hiringStatus={job.hiring_status}
        publishedAt={job.published_at}
        displayViews={displayViews}
        displayLikes={displayLikes}
        workLocationType={job.work_location_type}
        workLocationCountry={job.work_location_country}
        jobId={job.id}
      />

      {/* Job image (if exists) */}
      {job.image_url && (
        <>
          <div
            className="relative w-full aspect-video overflow-hidden cursor-pointer group"
            onClick={() => setIsImageDialogOpen(true)}
          >
            <Image
              src={job.image_url}
              alt={`${job.title} 공고 이미지`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-sm font-medium bg-black/50 px-4 py-2 rounded-lg">
                클릭하여 확대
              </span>
            </div>
          </div>

          {/* Full screen image dialog */}
          <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
            <DialogContent className="max-w-[98vw] max-h-[98vh] w-auto h-auto p-0 border-0 bg-transparent overflow-hidden">
              <DialogTitle className="sr-only">
                {job.title} 공고 이미지
              </DialogTitle>
              <div className="relative w-full h-full flex items-center justify-center min-h-[90vh]">
                <div className="relative w-full h-full">
                  <Image
                    src={job.image_url}
                    alt={`${job.title} 공고 이미지`}
                    width={2400}
                    height={1600}
                    className="object-contain w-full h-full max-h-[95vh]"
                    priority
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}

      {/* Main content */}
      <div className="p-8 md:p-12 space-y-8">
        {/* Job description section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">
            공고 내용
          </h2>
          <div className="prose prose-slate max-w-none">
            <p className="text-base leading-relaxed text-slate-700 whitespace-pre-wrap">
              {job.content}
            </p>
          </div>
        </section>

        {/* Like button with prominent placement */}
        {canLike && (
          <div className="flex justify-center pt-4">
            <LikeButton
              postId={job.id}
              initialLiked={isLiked}
              initialCount={displayLikes}
              canLike={canLike}
            />
          </div>
        )}

        {/* Published date footer */}
        <div className="pt-8 border-t border-slate-200 text-sm text-slate-600 text-left">
          게시일: {new Date(job.published_at || job.created_at).toLocaleDateString('ko-KR')}
        </div>
      </div>
    </div>
  )
}
