'use client'

import { useState } from 'react'
import { NATIONALITIES } from '@repo/lib'
import { Button } from '@/components/ui/button'
import { ProfileEditModal } from '@/components/my-page/profile-edit-modal'

interface SeekerProfileSectionProps {
  profile: {
    nationality: string
    topik_level: number | null
    occupation: string | null
    referral_source: string | null
  }
}

export function SeekerProfileSection({ profile }: SeekerProfileSectionProps) {
  const [editModalOpen, setEditModalOpen] = useState(false)

  // Get nationality display name
  const nationalityName =
    NATIONALITIES.find((n) => n.code === profile.nationality)?.name ||
    profile.nationality

  // Get TOPIK level display
  const getTopikDisplay = (level: number | null) => {
    if (level === null) return '미입력'
    if (level === 0) return '없음'
    return `${level}급`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">프로필 정보</h3>
        <Button onClick={() => setEditModalOpen(true)}>수정</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nationality */}
        <div className="bg-slate-50 border rounded-lg p-4">
          <p className="text-sm font-medium text-slate-600 mb-1">국적</p>
          <p className="text-base font-semibold text-slate-900">
            {nationalityName}
          </p>
        </div>

        {/* TOPIK Level */}
        <div className="bg-slate-50 border rounded-lg p-4">
          <p className="text-sm font-medium text-slate-600 mb-1">TOPIK 급수</p>
          <p className="text-base font-semibold text-slate-900">
            {getTopikDisplay(profile.topik_level)}
          </p>
        </div>

        {/* Occupation */}
        <div className="bg-slate-50 border rounded-lg p-4">
          <p className="text-sm font-medium text-slate-600 mb-1">직업/직종</p>
          <p className="text-base font-semibold text-slate-900">
            {profile.occupation || '미입력'}
          </p>
        </div>

        {/* Referral Source */}
        <div className="bg-slate-50 border rounded-lg p-4">
          <p className="text-sm font-medium text-slate-600 mb-1">유입 경로</p>
          <p className="text-base font-semibold text-slate-900">
            {profile.referral_source || '미입력'}
          </p>
        </div>
      </div>

      {/* Edit Modal */}
      <ProfileEditModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        defaultValues={{
          nationality: profile.nationality,
          topik_level: profile.topik_level,
          occupation: profile.occupation,
          referral_source: profile.referral_source,
        }}
      />
    </div>
  )
}
