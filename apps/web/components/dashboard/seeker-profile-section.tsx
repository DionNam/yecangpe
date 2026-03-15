'use client'

import { useState } from 'react'
import { NATIONALITIES, KOREAN_LEVELS, ENGLISH_LEVELS, JOB_TYPES, CATEGORIES } from '@repo/lib'
import { Button } from '@/components/ui/button'
import { ProfileEditModal } from '@/components/my-page/profile-edit-modal'
import { useTranslation } from '@/lib/i18n'
import type { Database } from '@repo/supabase/types'

type SeekerProfile = Database['public']['Tables']['seeker_profiles']['Row']

interface SeekerProfileSectionProps {
  profile: SeekerProfile
}

export function SeekerProfileSection({ profile }: SeekerProfileSectionProps) {
  const [editModalOpen, setEditModalOpen] = useState(false)
  const { t, language } = useTranslation()

  const isPublic = (profile as any).is_profile_public ?? false

  // Get nationality display name
  const nationalityName =
    NATIONALITIES.find((n) => n.code === profile.nationality)?.name || profile.nationality

  // Get Korean level display
  const getKoreanLevelDisplay = (level: string | null) => {
    if (!level || level === 'not_specified') return language === 'en' ? "I don't know" : '모르겠어요'
    const levelEntry = KOREAN_LEVELS.find(l => l.code === level)
    return language === 'en' ? (levelEntry?.name || level) : (levelEntry?.nameKo || level)
  }

  // Get English level display
  const getEnglishLevelDisplay = (level: string | null) => {
    if (!level) return t('profileSection.notEntered')
    const levelEntry = ENGLISH_LEVELS.find(l => l.code === level)
    return language === 'en' ? (levelEntry?.name || level) : (levelEntry?.nameKo || level)
  }

  // Get referral display
  const getReferralDisplay = (src: string | null) => {
    if (!src) return t('profileSection.notEntered')
    const map: Record<string, { ko: string; en: string }> = {
      google: { ko: '구글 검색', en: 'Google Search' },
      instagram: { ko: '인스타 광고', en: 'Instagram Ad' },
      referral: { ko: '지인 추천', en: 'Friend Referral' },
      other: { ko: '기타', en: 'Other' },
    }
    return language === 'en' ? (map[src]?.en || src) : (map[src]?.ko || src)
  }

  const profileForModal = {
    nationality: profile.nationality,
    korean_level: profile.korean_level,
    occupation: profile.occupation,
    referral_source: profile.referral_source,
    is_profile_public: (profile as any).is_profile_public ?? false,
    display_name: (profile as any).display_name ?? null,
    bio: (profile as any).bio ?? null,
    english_level: profile.english_level ?? null,
    country_of_residence: profile.country_of_residence ?? null,
    portfolio_url: (profile as any).portfolio_url ?? null,
    linkedin_url: (profile as any).linkedin_url ?? null,
    phone: (profile as any).phone ?? null,
    preferred_contact_method: (profile as any).preferred_contact_method ?? null,
    preferred_job_types: (profile as any).preferred_job_types ?? null,
    preferred_categories: (profile as any).preferred_categories ?? null,
    preferred_location_type: (profile as any).preferred_location_type ?? null,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-slate-900">{t('profileSection.title')}</h3>
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            isPublic
              ? 'bg-green-100 text-green-800'
              : 'bg-slate-100 text-slate-600'
          }`}>
            {isPublic ? t('profileSection.public') : t('profileSection.private')}
          </span>
        </div>
        <Button onClick={() => setEditModalOpen(true)} variant="outline" size="sm">{t('profileSection.edit')}</Button>
      </div>

      {/* Hint to go public when private */}
      {!isPublic && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          {t('profileSection.privateHint')}
          {' '}
          <button
            onClick={() => setEditModalOpen(true)}
            className="font-medium text-slate-900 underline underline-offset-2 hover:text-blue-600"
          >
            {t('profileSection.makePublic')}
          </button>
        </div>
      )}

      {/* Public profile bio block */}
      {isPublic && (profileForModal.display_name || profileForModal.bio) && (
        <div className="rounded-lg border border-blue-100 bg-blue-50/40 p-4 space-y-3">
          {profileForModal.display_name && (
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-0.5">{t('profileSection.displayName')}</p>
              <p className="font-semibold text-slate-900">{profileForModal.display_name}</p>
            </div>
          )}
          {profileForModal.bio && (
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-0.5">{t('profileSection.bio')}</p>
              <p className="text-sm text-slate-700 whitespace-pre-line">{profileForModal.bio}</p>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nationality */}
        <div className="bg-slate-50 border rounded-lg p-4">
          <p className="text-sm font-medium text-slate-600 mb-1">{t('profileSection.nationality')}</p>
          <p className="text-base font-semibold text-slate-900">{nationalityName}</p>
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
            {getReferralDisplay(profile.referral_source)}
          </p>
        </div>

        {/* Extended fields — only when public */}
        {isPublic && (
          <>
            {profileForModal.english_level && (
              <div className="bg-slate-50 border rounded-lg p-4">
                <p className="text-sm font-medium text-slate-600 mb-1">{t('profileSection.englishLevel')}</p>
                <p className="text-base font-semibold text-slate-900">{getEnglishLevelDisplay(profileForModal.english_level)}</p>
              </div>
            )}

            {profileForModal.country_of_residence && (
              <div className="bg-slate-50 border rounded-lg p-4">
                <p className="text-sm font-medium text-slate-600 mb-1">{t('profileSection.countryOfResidence')}</p>
                <p className="text-base font-semibold text-slate-900">{profileForModal.country_of_residence}</p>
              </div>
            )}

            {profileForModal.portfolio_url && (
              <div className="bg-slate-50 border rounded-lg p-4">
                <p className="text-sm font-medium text-slate-600 mb-1">{t('profileSection.portfolioUrl')}</p>
                <a href={profileForModal.portfolio_url} target="_blank" rel="noopener noreferrer" className="text-base font-semibold text-blue-600 hover:underline truncate block">
                  {profileForModal.portfolio_url}
                </a>
              </div>
            )}

            {profileForModal.linkedin_url && (
              <div className="bg-slate-50 border rounded-lg p-4">
                <p className="text-sm font-medium text-slate-600 mb-1">{t('profileSection.linkedinUrl')}</p>
                <a href={profileForModal.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-base font-semibold text-blue-600 hover:underline truncate block">
                  {profileForModal.linkedin_url}
                </a>
              </div>
            )}

            {((profileForModal.preferred_job_types as string[] | null) ?? []).length > 0 && (
              <div className="bg-slate-50 border rounded-lg p-4 md:col-span-2">
                <p className="text-sm font-medium text-slate-600 mb-2">{t('profileSection.preferredJobTypes')}</p>
                <div className="flex flex-wrap gap-2">
                  {(profileForModal.preferred_job_types as string[]).map((code: string) => {
                    const type = JOB_TYPES.find(j => j.code === code)
                    return (
                      <span key={code} className="rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-700">
                        {type ? (language === 'en' ? type.name : type.nameKo) : code}
                      </span>
                    )
                  })}
                </div>
              </div>
            )}

            {((profileForModal.preferred_categories as string[] | null) ?? []).length > 0 && (
              <div className="bg-slate-50 border rounded-lg p-4 md:col-span-2">
                <p className="text-sm font-medium text-slate-600 mb-2">{t('profileSection.preferredCategories')}</p>
                <div className="flex flex-wrap gap-2">
                  {(profileForModal.preferred_categories as string[]).map((code: string) => {
                    const cat = CATEGORIES.find(c => c.code === code)
                    return (
                      <span key={code} className="rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-700">
                        {cat ? (language === 'en' ? cat.name : cat.nameKo) : code}
                      </span>
                    )
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Edit Modal */}
      <ProfileEditModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        defaultValues={profileForModal}
      />
    </div>
  )
}
