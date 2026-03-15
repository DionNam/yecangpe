'use client'

import { useState } from 'react'
import { NATIONALITIES, KOREAN_LEVELS } from '@repo/lib'
import { Button } from '@/components/ui/button'
import { ProfileEditModal } from '@/components/my-page/profile-edit-modal'
import { useTranslation } from '@/lib/i18n'

interface SeekerProfileSectionProps {
  profile: {
    nationality: string
    korean_level: string | null
    occupation: string | null
    referral_source: string | null
  }
}

export function SeekerProfileSection({ profile }: SeekerProfileSectionProps) {
  const [editModalOpen, setEditModalOpen] = useState(false)
  const { t, language } = useTranslation()

  // Get nationality display name
  const nationalityName =
    NATIONALITIES.find((n) => n.code === profile.nationality)?.name ||
    profile.nationality

  // Get Korean level display
  const getKoreanLevelDisplay = (level: string | null) => {
    if (!level || level === 'not_specified') return t('profileSection.notEntered')
    const levelEntry = KOREAN_LEVELS.find(l => l.code === level)
    return language === 'en' ? (levelEntry?.name || level) : (levelEntry?.nameKo || level)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">{t('profileSection.title')}</h3>
        <Button onClick={() => setEditModalOpen(true)}>{t('profileSection.edit')}</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nationality */}
        <div className="bg-slate-50 border rounded-lg p-4">
          <p className="text-sm font-medium text-slate-600 mb-1">{t('profileSection.nationality')}</p>
          <p className="text-base font-semibold text-slate-900">
            {nationalityName}
          </p>
        </div>

        {/* Korean Level */}
        <div className="bg-slate-50 border rounded-lg p-4">
          <p className="text-sm font-medium text-slate-600 mb-1">{t('profileSection.koreanLevel')}</p>
          <p className="text-base font-semibold text-slate-900">
            {getKoreanLevelDisplay(profile.korean_level)}
          </p>
        </div>

        {/* Occupation */}
        <div className="bg-slate-50 border rounded-lg p-4">
          <p className="text-sm font-medium text-slate-600 mb-1">{t('profileSection.occupation')}</p>
          <p className="text-base font-semibold text-slate-900">
            {profile.occupation || t('profileSection.notEntered')}
          </p>
        </div>

        {/* Referral Source */}
        <div className="bg-slate-50 border rounded-lg p-4">
          <p className="text-sm font-medium text-slate-600 mb-1">{t('profileSection.referralSource')}</p>
          <p className="text-base font-semibold text-slate-900">
            {profile.referral_source || t('profileSection.notEntered')}
          </p>
        </div>
      </div>

      {/* Edit Modal */}
      <ProfileEditModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        defaultValues={{
          nationality: profile.nationality,
          korean_level: profile.korean_level,
          occupation: profile.occupation,
          referral_source: profile.referral_source,
        }}
      />
    </div>
  )
}
