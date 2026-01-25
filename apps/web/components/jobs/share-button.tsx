'use client'

import { useState } from 'react'
import { Share2, Link2, Mail, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface ShareButtonProps {
  title: string
  url?: string
}

export function ShareButton({ title, url }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '')

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = shareUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url: shareUrl,
        })
      } catch {
        // User cancelled or error
      }
    }
  }

  const handleEmailShare = () => {
    const subject = encodeURIComponent(title)
    const body = encodeURIComponent(`${title}\n\n${shareUrl}`)
    window.open(`mailto:?subject=${subject}&body=${body}`)
  }

  const handleKakaoShare = () => {
    // Kakao SDK share - opens Kakao share page
    const kakaoUrl = `https://story.kakao.com/share?url=${encodeURIComponent(shareUrl)}`
    window.open(kakaoUrl, '_blank', 'width=600,height=400')
  }

  // Check if Web Share API is available
  const canShare = typeof navigator !== 'undefined' && navigator.share

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5 text-slate-600">
          <Share2 className="w-4 h-4" />
          <span>공유</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer">
          {copied ? (
            <Check className="w-4 h-4 text-green-600" />
          ) : (
            <Link2 className="w-4 h-4" />
          )}
          <span>{copied ? '복사됨!' : '링크 복사'}</span>
        </DropdownMenuItem>

        {canShare && (
          <DropdownMenuItem onClick={handleNativeShare} className="cursor-pointer">
            <Share2 className="w-4 h-4" />
            <span>공유하기</span>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem onClick={handleKakaoShare} className="cursor-pointer">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3C6.477 3 2 6.463 2 10.691c0 2.667 1.737 5.015 4.388 6.374-.175.635-.637 2.3-.73 2.66-.116.448.164.44.344.32.142-.094 2.251-1.53 3.163-2.145.273.038.555.057.835.057 5.523 0 10-3.463 10-7.691S17.523 3 12 3z"/>
          </svg>
          <span>카카오톡</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleEmailShare} className="cursor-pointer">
          <Mail className="w-4 h-4" />
          <span>이메일</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
