'use client'

import { useState } from 'react'
import { NATIONALITIES } from '@repo/lib'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ProfileEditModal } from './profile-edit-modal'

interface ProfileTabProps {
  profile: {
    nationality: string
    topik_level: number | null
    occupation: string | null
    referral_source: string | null
  }
}

export function ProfileTab({ profile }: ProfileTabProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // Get nationality Korean name
  const nationality = NATIONALITIES.find(n => n.code === profile.nationality)

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>프로필 정보</CardTitle>
            <Button onClick={() => setIsEditModalOpen(true)}>수정</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">국적</p>
              <p className="font-medium">{nationality?.name || profile.nationality}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">TOPIK 급수</p>
              <p className="font-medium">
                {profile.topik_level !== null
                  ? profile.topik_level === 0
                    ? '없음'
                    : `${profile.topik_level}급`
                  : '미입력'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">직업/직종</p>
              <p className="font-medium">{profile.occupation || '미입력'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">유입 경로</p>
              <p className="font-medium">
                {profile.referral_source || '미입력'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <ProfileEditModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        defaultValues={profile}
      />
    </>
  )
}
