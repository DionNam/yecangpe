'use client'

import { useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { updateHiringStatus } from '@/app/actions/jobs'
import { useTranslation } from '@/lib/i18n'

interface HiringStatusToggleProps {
  postId: string
  currentStatus: 'hiring' | 'closed'
  disabled?: boolean
}

export function HiringStatusToggle({
  postId,
  currentStatus,
  disabled = false,
}: HiringStatusToggleProps) {
  const { t } = useTranslation()
  const [isPending, startTransition] = useTransition()

  const handleToggle = () => {
    const newStatus = currentStatus === 'hiring' ? 'closed' : 'hiring'
    startTransition(async () => {
      try {
        await updateHiringStatus(postId, newStatus)
      } catch (error) {
        console.error('Failed to update hiring status:', error)
      }
    })
  }

  const isHiring = currentStatus === 'hiring'

  return (
    <Button
      variant={isHiring ? 'default' : 'secondary'}
      size="sm"
      onClick={handleToggle}
      disabled={disabled || isPending}
      className="min-w-[60px]"
    >
      {isPending ? '...' : isHiring ? t('jobPostForm.hiring') : t('jobPostForm.closed')}
    </Button>
  )
}
