'use client'

import { useState } from 'react'
import { NATIONALITIES } from '@repo/lib'
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
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold tracking-tight">프로필 정보</h2>
          <Button onClick={() => setIsEditModalOpen(true)} variant="outline" size="sm">수정</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">국적</p>
            <p className="font-semibold text-slate-900">{nationality?.name || profile.nationality}</p>
          </div>
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">TOPIK 급수</p>
            <p className="font-semibold text-slate-900">
              {profile.topik_level !== null
                ? profile.topik_level === 0
                  ? '없음'
                  : `${profile.topik_level}급`
                : '미입력'}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">직업/직종</p>
            <p className="font-semibold text-slate-900">{profile.occupation || '미입력'}</p>
          </div>
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">유입 경로</p>
            <p className="font-semibold text-slate-900">
              {profile.referral_source || '미입력'}
            </p>
          </div>
        </div>
      </div>

      <ProfileEditModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        defaultValues={profile}
      />
    </>
  )
}
