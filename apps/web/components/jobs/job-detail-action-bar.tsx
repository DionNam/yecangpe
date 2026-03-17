'use client'

import { LikeButton } from './like-button'
import { JobDetailShareMenu } from './job-detail-share-menu'
import { Button } from '@/components/ui/button'
import { Printer } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

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
  const { t } = useTranslation()

  const handlePrint = () => {
    window.print()
  }

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

      {/* Print */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handlePrint}
        className="gap-1.5 text-slate-600 hover:text-slate-900"
      >
        <Printer className="w-4 h-4" />
        <span>{t('common.print')}</span>
      </Button>
    </div>
  )
}
