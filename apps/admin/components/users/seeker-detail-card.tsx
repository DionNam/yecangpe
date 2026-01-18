'use client'

import { useTransition } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { toggleUserActive } from '@/app/actions/users'

interface SeekerProfile {
  nationality: string
  topik_level: number
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
            <div className="text-sm font-medium text-muted-foreground">TOPIK 레벨</div>
            <div className="text-base">
              {profile?.topik_level !== undefined && profile?.topik_level !== null
                ? profile.topik_level === 0
                  ? '0 (없음)'
                  : profile.topik_level
                : '-'}
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
