'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { LoginModal } from './login-modal'
import { ShareButton } from './share-button'
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
import { ko } from 'date-fns/locale'
import type { Database } from '@repo/supabase/types'

type JobPost = Database['public']['Tables']['job_posts']['Row']

interface JobRowProps {
  job: JobPost
  isAuthenticated: boolean
}

export function JobRow({
  job,
  isAuthenticated,
}: JobRowProps) {
  const router = useRouter()
  const [showLoginModal, setShowLoginModal] = useState(false)

  const handleClick = () => {
    if (isAuthenticated) {
      router.push(`/jobs/${job.slug || job.id}`)
    } else {
      setShowLoginModal(true)
    }
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
        return '원격근무'
      case 'hybrid':
        return '하이브리드'
      case 'on_site':
        return job.work_location_country
          ? getCountryName(job.work_location_country)
          : '대면근무'
      default:
        return '대면근무'
    }
  }

  // Format salary
  const getSalaryText = () => {
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

    return `${salaryText} ${period?.nameKo || ''}`
  }

  // Get job type name
  const getJobTypeName = () => {
    const jobType = JOB_TYPES.find(t => t.code === job.job_type)
    return jobType?.nameKo || job.job_type
  }

  // Get work location type name
  const getWorkLocationTypeName = () => {
    switch (job.work_location_type) {
      case 'remote':
        return '원격'
      case 'hybrid':
        return '하이브리드'
      case 'on_site':
        return '현장'
      default:
        return job.work_location_type
    }
  }

  // Get Korean level name
  const getKoreanLevelName = () => {
    if (!job.korean_level || job.korean_level === 'not_specified') return null
    const level = KOREAN_LEVELS.find(l => l.code === job.korean_level)
    return level?.nameKo
  }

  // Get English level name
  const getEnglishLevelName = () => {
    if (!job.english_level || job.english_level === 'not_specified') return null
    const level = ENGLISH_LEVELS.find(l => l.code === job.english_level)
    return level?.nameKo
  }

  // Format relative date
  const getRelativeDate = () => {
    if (!job.published_at) return '-'
    return formatDistanceToNow(new Date(job.published_at), {
      addSuffix: true,
      locale: ko
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
                New
              </Badge>
            )}
          </div>

          {/* Company */}
          <p className="text-sm text-slate-600 mb-2">
            {job.company_name}
          </p>

          {/* Info row: Location + Salary */}
          <div className="flex items-center gap-4 mb-2">
            {/* Location */}
            <div className="flex items-center gap-1 text-sm text-slate-600">
              <MapPin className="w-4 h-4" />
              <span>{getLocationText()}</span>
            </div>

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
                한국어: {koreanLevelName}
              </Badge>
            )}

            {/* English level - outline */}
            {englishLevelName && (
              <Badge variant="outline" className="text-xs px-2 py-0.5">
                영어: {englishLevelName}
              </Badge>
            )}
          </div>
        </div>

        {/* Right side: Date and Share */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            {getRelativeDate()}
          </span>

          <div onClick={(e) => e.stopPropagation()}>
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
