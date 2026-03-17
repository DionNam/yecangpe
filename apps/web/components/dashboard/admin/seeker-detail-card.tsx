'use client'

import { useTransition } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { toggleUserActive } from '@/app/actions/admin-users'

interface SeekerProfile {
  nationality: string
  korean_level: string | null
  occupation: string | null
  referral_source: string | null
}

interface Seeker {
  id: string
  email: string
  is_active: boolean
  created_at: string
  seeker_profiles: SeekerProfile[]
}

interface SeekerDetailCardProps {
  seeker: Seeker
}

export function SeekerDetailCard({ seeker }: SeekerDetailCardProps) {
  const [isPending, startTransition] = useTransition()
  const profile = seeker.seeker_profiles[0]

  const handleToggleActive = () => {
    startTransition(async () => {
      await toggleUserActive(seeker.id, !seeker.is_active)
    })
  }

  const getKoreanLevelDisplay = (level: string | null) => {
    const levels: Record<string, string> = {
      native: '원어민',
      advanced: '고급',
      intermediate: '중급',
      basic: '초급',
      not_required: '무관',
      not_specified: '미지정',
    }
    return level ? levels[level] || level : '-'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>구직자 정보</span>
          {seeker.is_active ? (
            <Badge variant="outline" className="bg-green-50 text-green-700">
              활성
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-gray-50 text-gray-700">
              비활성
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div>
            <div className="text-sm font-medium text-muted-foreground">이메일</div>
            <div className="text-base">{seeker.email}</div>
          </div>

          <div>
            <div className="text-sm font-medium text-muted-foreground">국적</div>
            <div className="text-base">{profile?.nationality || '-'}</div>
          </div>

          <div>
            <div className="text-sm font-medium text-muted-foreground">한국어 수준</div>
            <div className="text-base">
              {getKoreanLevelDisplay(profile?.korean_level ?? null)}
            </div>
          </div>

          <div>
            <div className="text-sm font-medium text-muted-foreground">직업</div>
            <div className="text-base">{profile?.occupation || '-'}</div>
          </div>

          <div>
            <div className="text-sm font-medium text-muted-foreground">유입경로</div>
            <div className="text-base">{profile?.referral_source || '-'}</div>
          </div>

          <div>
            <div className="text-sm font-medium text-muted-foreground">가입일</div>
            <div className="text-base">
              {new Date(seeker.created_at).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <Button
            variant={seeker.is_active ? 'destructive' : 'default'}
            onClick={handleToggleActive}
            disabled={isPending}
            className="w-full"
          >
            {seeker.is_active ? '계정 비활성화' : '계정 활성화'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
