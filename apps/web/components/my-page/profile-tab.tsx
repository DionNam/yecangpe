'use client'

import { useState } from 'react'
import { NATIONALITIES, KOREAN_LEVELS } from '@repo/lib'
import { Button } from '@/components/ui/button'
import { ProfileEditModal } from './profile-edit-modal'
import { useTranslation } from '@/lib/i18n'

interface ProfileTabProps {
  profile: {
    nationality: string
    korean_level: string | null
    occupation: string | null
    referral_source: string | null
    is_profile_public: boolean | null
    display_name: string | null
    bio: string | null
    english_level: string | null
    country_of_residence: string | null
    portfolio_url: string | null
    linkedin_url: string | null
    phone: string | null
    preferred_contact_method: string | null
    preferred_job_types: string[] | null
    preferred_categories: string[] | null
    preferred_location_type: string | null
  }
}

export function ProfileTab({ profile }: ProfileTabProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const { t, language } = useTranslation()

  // Get nationality name
  const nationality = NATIONALITIES.find(n => n.code === profile.nationality)

  // Get Korean level display
  const getKoreanLevelDisplay = (level: string | null) => {
    if (!level || level === 'not_specified') return t('profileSection.notEntered')
    const levelEntry = KOREAN_LEVELS.find(l => l.code === level)
    return language === 'en' ? (levelEntry?.name || level) : (levelEntry?.nameKo || level)
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold tracking-tight">{t('profileSection.title')}</h2>
          <Button onClick={() => setIsEditModalOpen(true)} variant="outline" size="sm">{t('profileSection.edit')}</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">{t('profileSection.nationality')}</p>
            <p className="font-semibold text-slate-900">{language === 'ko' ? (nationality?.name || profile.nationality) : (nationality?.nameEn || profile.nationality)}</p>
          </div>
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">{t('profileSection.koreanLevel')}</p>
            <p className="font-semibold text-slate-900">
              {getKoreanLevelDisplay(profile.korean_level)}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">{t('profileSection.occupation')}</p>
            <p className="font-semibold text-slate-900">{profile.occupation || t('profileSection.notEntered')}</p>
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
