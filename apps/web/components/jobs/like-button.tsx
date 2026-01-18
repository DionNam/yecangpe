'use client'

import { useOptimistic, useTransition } from 'react'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toggleLike } from '@/app/actions/likes'

interface LikeButtonProps {
  postId: string
  initialLiked: boolean
  initialCount: number
  canLike: boolean
}

export function LikeButton({
  postId,
  initialLiked,
  initialCount,
  canLike,
}: LikeButtonProps) {
  const [isPending, startTransition] = useTransition()
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

  return (
    <Button
      variant="ghost"
      onClick={handleClick}
      disabled={!canLike || isPending}
      className="flex items-center gap-2"
    >
      <Heart
        className={
          optimisticState.liked
            ? 'fill-red-500 text-red-500'
            : 'text-gray-400'
        }
        size={20}
      />
      <span className="text-sm font-medium">{optimisticState.count}</span>
    </Button>
  )
}
