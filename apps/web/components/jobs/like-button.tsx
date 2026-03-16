'use client'

import { useOptimistic, useTransition } from 'react'
import { Bookmark } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toggleLike } from '@/app/actions/likes'
import { useTranslation } from '@/lib/i18n'

interface LikeButtonProps {
  postId: string
  initialLiked: boolean
  initialCount: number
  canLike: boolean
  compact?: boolean
}

export function LikeButton({
  postId,
  initialLiked,
  initialCount,
  canLike,
  compact = false,
}: LikeButtonProps) {
  const [isPending, startTransition] = useTransition()
  const { t } = useTranslation()
  const [optimisticState, setOptimisticState] = useOptimistic(
    { liked: initialLiked, count: initialCount },
    (current, newLiked: boolean) => ({
      liked: newLiked,
      count: newLiked ? current.count + 1 : current.count - 1,
    })
  )

  const handleClick = () => {
    if (!canLike) return

    const newLikedState = !optimisticState.liked
    startTransition(async () => {
      setOptimisticState(newLikedState)
      await toggleLike(postId)
    })
  }

  if (compact) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={handleClick}
        disabled={!canLike || isPending}
        className={`gap-1.5 ${optimisticState.liked ? 'text-slate-900' : 'text-slate-600 hover:text-slate-900'}`}
      >
        <Bookmark
          className={optimisticState.liked ? 'fill-current' : ''}
          size={16}
        />
      </Button>
    )
  }

  return (
    <Button
      variant={optimisticState.liked ? "default" : "outline"}
      onClick={handleClick}
      disabled={!canLike || isPending}
      className="flex items-center gap-2"
    >
      <Bookmark
        className={optimisticState.liked ? 'fill-current' : ''}
        size={16}
      />
      <span className="text-sm font-medium">
        {optimisticState.liked ? t('common.saved') : t('common.save')}
      </span>
    </Button>
  )
}
