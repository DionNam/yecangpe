'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { NATIONALITIES, CATEGORIES, JOB_TYPES, KOREAN_LEVELS, ENGLISH_LEVELS, COUNTRIES } from '@repo/lib'
import { Mail, Phone, Linkedin, ExternalLink } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

interface SeekerCardProps {
  seeker: {
    id: string
    display_name: string
    bio: string
    nationality: string
    korean_level: string | null
    english_level: string | null
    country_of_residence: string | null
    occupation: string | null
    preferred_job_types: string[] | null
    preferred_categories: string[] | null
    email?: string
    phone: string | null
    linkedin_url: string | null
    portfolio_url: string | null
    preferred_contact_method: string | null
    user_id: string
  }
}

export function SeekerCard({ seeker }: SeekerCardProps) {
  const { t, language } = useTranslation()

  const getNationalityName = (code: string) => {
    const n = NATIONALITIES.find(n => n.code === code)
    return n ? (language === 'en' ? n.nameEn : n.name) : code
  }

  const getCountryName = (code: string) => {
    const c = COUNTRIES.find(c => c.code === code)
    return c ? (language === 'en' ? c.nameEn : c.name) : code
  }

  const getCategoryName = (code: string) => {
    const c = CATEGORIES.find(c => c.code === code)
    return c ? (language === 'en' ? c.name : c.nameKo) : code
  }

  const getJobTypeName = (code: string) => {
    const j = JOB_TYPES.find(t => t.code === code)
    return j ? (language === 'en' ? j.name : j.nameKo) : code
  }

  const getKoreanLevelName = (code: string | null) => {
    if (!code || code === 'not_specified') return null
    const l = KOREAN_LEVELS.find(l => l.code === code)
    return l ? (language === 'en' ? l.name : l.nameKo) : code
  }

  const getEnglishLevelName = (code: string | null) => {
    if (!code || code === 'not_specified') return null
    const l = ENGLISH_LEVELS.find(l => l.code === code)
    return l ? (language === 'en' ? l.name : l.nameKo) : code
  }

  const koreanLevelDisplay = getKoreanLevelName(seeker.korean_level)
  const englishLevelDisplay = getEnglishLevelName(seeker.english_level)

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-bold text-lg text-gray-900">{seeker.display_name}</h3>
          <p className="text-sm text-gray-500">
            {getNationalityName(seeker.nationality)}
            {seeker.country_of_residence && ` • ${getCountryName(seeker.country_of_residence)}`}
          </p>
          {seeker.occupation && (
            <p className="text-sm text-gray-600 mt-1">{seeker.occupation}</p>
          )}
        </div>
        <div className="flex gap-1">
          {koreanLevelDisplay && (
            <Badge variant="default">{koreanLevelDisplay}</Badge>
          )}
          {englishLevelDisplay && (
            <Badge variant="secondary">{englishLevelDisplay}</Badge>
          )}
        </div>
      </div>

      {/* Bio */}
      {seeker.bio && (
        <p className="text-sm text-gray-700 line-clamp-3">{seeker.bio}</p>
      )}

      {/* Preferred Categories */}
      {seeker.preferred_categories && seeker.preferred_categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {seeker.preferred_categories.slice(0, 3).map(cat => (
            <Badge key={cat} variant="outline" className="text-xs">
              {getCategoryName(cat)}
            </Badge>
          ))}
          {seeker.preferred_categories.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{seeker.preferred_categories.length - 3}
            </Badge>
          )}
        </div>
      )}

      {/* Preferred Job Types */}
      {seeker.preferred_job_types && seeker.preferred_job_types.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {seeker.preferred_job_types.map(type => (
            <Badge key={type} variant="secondary" className="text-xs">
              {getJobTypeName(type)}
            </Badge>
          ))}
        </div>
      )}

      {/* Contact Buttons */}
      <div className="pt-4 border-t border-gray-200 space-y-2">
        {/* Email (via mailto with user_id context) */}
        {seeker.email && (
          <Button
            className="w-full"
            variant={seeker.preferred_contact_method === 'email' ? 'default' : 'outline'}
            size="sm"
            asChild
          >
            <a href={`mailto:${seeker.email}`}>
              <Mail className="w-4 h-4 mr-2" />
              {t('employerDashboard.contactEmail')}
            </a>
          </Button>
        )}

        {/* Phone */}
        {seeker.phone && (
          <Button
            className="w-full"
            variant={seeker.preferred_contact_method === 'phone' ? 'default' : 'outline'}
            size="sm"
            asChild
          >
            <a href={`tel:${seeker.phone}`}>
              <Phone className="w-4 h-4 mr-2" />
              {seeker.phone}
            </a>
          </Button>
        )}

        {/* LinkedIn */}
        {seeker.linkedin_url && (
          <Button
            className="w-full"
            variant={seeker.preferred_contact_method === 'linkedin' ? 'default' : 'outline'}
            size="sm"
            asChild
          >
            <a href={seeker.linkedin_url} target="_blank" rel="noopener noreferrer">
              <Linkedin className="w-4 h-4 mr-2" />
              {t('employerDashboard.viewLinkedIn')}
            </a>
          </Button>
        )}

        {/* Portfolio */}
        {seeker.portfolio_url && (
          <Button
            className="w-full"
            variant="outline"
            size="sm"
            asChild
          >
            <a href={seeker.portfolio_url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-2" />
              {t('employerDashboard.viewPortfolio')}
            </a>
          </Button>
        )}
      </div>
    </div>
  )
}
