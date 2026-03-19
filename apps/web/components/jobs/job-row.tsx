'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { LoginModal } from './login-modal'
import { ShareButton } from './share-button'
import { LikeButton } from './like-button'
import {
  getCountryName,
  JOB_TYPES,
  KOREAN_LEVELS,
  ENGLISH_LEVELS,
  SALARY_CURRENCIES,
  SALARY_PERIODS,
} from '@repo/lib'
import { MapPin, Calendar } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ko, enUS } from 'date-fns/locale'
import type { Database } from '@repo/supabase/types'
import { useTranslation } from '@/lib/i18n'

type JobPost = Database['public']['Tables']['job_posts']['Row']

interface JobRowProps {
  job: JobPost
  isAuthenticated: boolean
  canLike: boolean
  isLiked: boolean
}

export function JobRow({
  job,
  isAuthenticated,
  canLike,
  isLiked,
}: JobRowProps) {
  const router = useRouter()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const { t, language } = useTranslation()

  const handleClick = () => {
    router.push(`/jobs/${job.slug || job.id}`)
  }

  // Check if post is new (within 7 days)
  const isNew = job.published_at
    ? (Date.now() - new Date(job.published_at).getTime()) < 7 * 24 * 60 * 60 * 1000
    : false

  // Get company logo or fallback
  const getCompanyLogo = () => {
    const logoUrl = job.image_url

    if (logoUrl) {
      return (
        <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100">
          <Image
            src={logoUrl}
            alt={job.company_name || ''}
            fill
            className="object-cover"
            sizes="64px"
          />
        </div>
      )
    }

    // Fallback: first letter of company name in colored circle
    const firstLetter = (job.company_name || 'C')[0].toUpperCase()
    const colors = [
      'bg-blue-500',
      'bg-emerald-500',
      'bg-amber-500',
      'bg-purple-500',
      'bg-pink-500',
    ]
    const colorIndex = firstLetter.charCodeAt(0) % colors.length

    return (
      <div className={`w-16 h-16 flex-shrink-0 rounded-lg ${colors[colorIndex]} flex items-center justify-center text-white font-bold text-xl`}>
        {firstLetter}
      </div>
    )
  }

  // Get location text with icon
  const getLocationText = () => {
    switch (job.work_location_type) {
      case 'remote':
        return t('filters.remote')
      case 'hybrid':
        return t('filters.hybrid')
      case 'on_site':
        return job.work_location_country
          ? getCountryName(job.work_location_country, language)
          : t('filters.onSite')
      default:
        return t('filters.onSite')
    }
  }

  // Format salary
  const getSalaryText = () => {
    if ((job as any).salary_negotiable) return t('jobPostForm.salaryNegotiable')
    if (!job.salary_min && !job.salary_max) return null

    const currency = SALARY_CURRENCIES.find(c => c.code === job.salary_currency)
    const period = SALARY_PERIODS.find(p => p.code === job.salary_period)

    const formatAmount = (amount: number) => {
      return amount.toLocaleString('ko-KR')
    }

    let salaryText = ''
    if (job.salary_min && job.salary_max) {
      salaryText = `${currency?.symbol || '₩'}${formatAmount(job.salary_min)} - ${formatAmount(job.salary_max)}`
    } else if (job.salary_min) {
      salaryText = `${currency?.symbol || '₩'}${formatAmount(job.salary_min)}+`
    } else if (job.salary_max) {
      salaryText = `~${currency?.symbol || '₩'}${formatAmount(job.salary_max)}`
    }

    return `${salaryText} ${language === 'en' ? (period?.name || '') : (period?.nameKo || '')}`
  }

  // Get job type name
  const getJobTypeName = () => {
    const jobType = JOB_TYPES.find(jt => jt.code === job.job_type)
    return language === 'en' ? (jobType?.name || job.job_type) : (jobType?.nameKo || job.job_type)
  }

  // Get work location type name
  const getWorkLocationTypeName = () => {
    switch (job.work_location_type) {
      case 'remote':
        return t('filters.remote')
      case 'hybrid':
        return t('filters.hybrid')
      case 'on_site':
        return t('common.onSiteShort')
      default:
        return job.work_location_type
    }
  }

  // Get Korean level name
  const getKoreanLevelName = () => {
    if (!job.korean_level || job.korean_level === 'not_specified') return null
    const level = KOREAN_LEVELS.find(l => l.code === job.korean_level)
    return language === 'en' ? level?.name : level?.nameKo
  }

  // Get English level name
  const getEnglishLevelName = () => {
    if (!job.english_level || job.english_level === 'not_specified') return null
    const level = ENGLISH_LEVELS.find(l => l.code === job.english_level)
    return language === 'en' ? level?.name : level?.nameKo
  }

  // Format relative date
  const getRelativeDate = () => {
    const date = job.published_at || job.created_at
    if (!date) return '-'
    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
      locale: language === 'en' ? enUS : ko,
    })
  }

  const salaryText = getSalaryText()
  const koreanLevelName = getKoreanLevelName()
  const englishLevelName = getEnglishLevelName()

  return (
    <>
      <div
        onClick={handleClick}
        className="
          flex items-center gap-4 p-6 cursor-pointer
          border-b border-slate-200 last:border-0
          hover:bg-slate-50
          transition-all duration-200
          group
        "
      >
        {/* Company Logo */}
        {getCompanyLogo()}

        {/* Main Content - flex-1 to take remaining space */}
        <div className="flex-1 min-w-0">
          {/* Header: Title and New badge */}
          <div className="flex items-start gap-2 mb-1">
            <h3 className="font-semibold text-base group-hover:text-slate-900 transition-colors line-clamp-1 flex-1">
              {job.title}
            </h3>
            {isNew && (
              <Badge variant="destructive" className="text-xs px-2 py-0.5 flex-shrink-0">
                {t('common.new')}
              </Badge>
            )}
          </div>

          {/* Company */}
          <p className="text-sm text-slate-600 mb-2">
            {job.company_name}
          </p>

          {/* Info row: Location (on_site only) + Salary */}
          <div className="flex items-center gap-4 mb-2">
            {/* Location - only for on_site */}
            {job.work_location_type === 'on_site' && job.work_location_country && (
              <div className="flex items-center gap-1 text-sm text-slate-600">
                <MapPin className="w-4 h-4" />
                <span>{getCountryName(job.work_location_country, language)}</span>
              </div>
            )}

            {/* Salary */}
            {salaryText && (
              <span className="text-sm font-medium text-slate-700">
                {salaryText}
              </span>
            )}
          </div>

          {/* Badge row */}
          <div className="flex gap-2 flex-wrap">
            {/* Job type - blue */}
            <Badge variant="default" className="text-xs px-2 py-0.5 bg-blue-500">
              {getJobTypeName()}
            </Badge>

            {/* Work location type - emerald */}
            <Badge variant="default" className="text-xs px-2 py-0.5 bg-emerald-500">
              {getWorkLocationTypeName()}
            </Badge>

            {/* Korean level - outline */}
            {koreanLevelName && (
              <Badge variant="outline" className="text-xs px-2 py-0.5">
                {t('common.korean')}: {koreanLevelName}
              </Badge>
            )}

            {/* English level - outline */}
            {englishLevelName && (
              <Badge variant="outline" className="text-xs px-2 py-0.5">
                {t('common.english')}: {englishLevelName}
              </Badge>
            )}
          </div>
        </div>

        {/* Right side: Date, Save, and Share */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            {getRelativeDate()}
          </span>

          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            {canLike && (
              <LikeButton
                postId={job.id}
                initialLiked={isLiked}
                initialCount={0}
                canLike={canLike}
                compact
              />
            )}
            <ShareButton
              title={job.title || ''}
              url={`${typeof window !== 'undefined' ? window.location.origin : ''}/jobs/${job.slug || job.id}`}
            />
          </div>
        </div>
      </div>

      <LoginModal open={showLoginModal} onOpenChange={setShowLoginModal} />
    </>
  )
}
