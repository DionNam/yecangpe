'use client'

import { LikeButton } from './like-button'
import { JobDetailShareMenu } from './job-detail-share-menu'

interface JobDetailActionBarProps {
  jobId: string
  jobSlug: string | null
  jobTitle: string
  isLiked: boolean
  canLike: boolean
  displayLikes: number
}

export function JobDetailActionBar({
  jobId,
  jobSlug,
  jobTitle,
  isLiked,
  canLike,
  displayLikes,
}: JobDetailActionBarProps) {
  return (
    <div className="flex items-center gap-4 pt-6 border-t border-slate-200 no-print">
      {/* Save Button */}
      {canLike && (
        <LikeButton
          postId={jobId}
          initialLiked={isLiked}
          initialCount={displayLikes}
          canLike={canLike}
          compact
        />
      )}

      {/* Share */}
      <JobDetailShareMenu
        title={jobTitle}
        slug={jobSlug || jobId}
      />
    </div>
  )
}
