'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LikeButton } from './like-button'
import {
  ExternalLink,
  Calendar,
  MapPin,
  Building2,
  Briefcase,
  DollarSign,
  Languages,
  GraduationCap,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ko, enUS } from 'date-fns/locale'
import {
  getCountryName,
  JOB_TYPES,
  KOREAN_LEVELS,
  ENGLISH_LEVELS,
  CAREER_LEVELS,
  SALARY_CURRENCIES,
  SALARY_PERIODS,
} from '@repo/lib'
import type { Database } from '@repo/supabase/types'
import { useTranslation } from '@/lib/i18n'

type JobPost = Database['public']['Tables']['job_posts']['Row']

interface JobDetailSidebarProps {
  job: JobPost
  isLiked: boolean
  canLike: boolean
  displayLikes: number
  user: { id: string } | null
}

export function JobDetailSidebar({
  job,
  isLiked,
  canLike,
  displayLikes,
  user,
}: JobDetailSidebarProps) {
  const { t, language } = useTranslation()

  const handleApply = () => {
    if (job.apply_url) {
      window.open(job.apply_url, '_blank', 'noopener,noreferrer')
    } else if (job.apply_email) {
      window.location.href = `mailto:${job.apply_email}`
    }
  }

  // Format salary
  const formatSalary = () => {
    if (!job.salary_min && !job.salary_max) return null

    const currency = SALARY_CURRENCIES.find(c => c.code === job.salary_currency)?.symbol || job.salary_currency || 'KRW'
    const periodEntry = SALARY_PERIODS.find(p => p.code === job.salary_period)
    const period = language === 'en' ? (periodEntry?.name || '') : (periodEntry?.nameKo || '')

    if (job.salary_min && job.salary_max) {
      return `${currency} ${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()} (${period})`
    } else if (job.salary_min) {
      return `${currency} ${job.salary_min.toLocaleString()}+ (${period})`
    } else if (job.salary_max) {
      return `${t('jobDetail.salaryMax')} ${currency} ${job.salary_max.toLocaleString()} (${period})`
    }
    return null
  }

  // Get work location display
  const getWorkLocation = () => {
    if (job.work_location_type === 'remote') return t('filters.remote')
    if (job.work_location_type === 'hybrid') return t('filters.hybrid')
    if (job.work_location_type === 'on_site' && job.work_location_country) {
      return getCountryName(job.work_location_country)
    }
    return t('common.onSiteShort')
  }

  const getWorkLocationType = () => {
    if (!job.work_location_type) return null
    const types: Record<string, string> = {
      on_site: t('common.onSiteShort'),
      remote: t('filters.remote'),
      hybrid: t('filters.hybrid'),
    }
    return types[job.work_location_type] ?? null
  }

  const jobTypeEntry = JOB_TYPES.find(jt => jt.code === job.job_type)
  const jobTypeKo = language === 'en' ? jobTypeEntry?.name : jobTypeEntry?.nameKo
  const koreanLevelEntry = KOREAN_LEVELS.find(l => l.code === job.korean_level)
  const koreanLevelKo = language === 'en' ? koreanLevelEntry?.name : koreanLevelEntry?.nameKo
  const englishLevelEntry = ENGLISH_LEVELS.find(l => l.code === job.english_level)
  const englishLevelKo = language === 'en' ? englishLevelEntry?.name : englishLevelEntry?.nameKo
  const careerLevelEntry = CAREER_LEVELS.find(l => l.code === job.career_level)
  const careerLevelKo = language === 'en' ? careerLevelEntry?.name : careerLevelEntry?.nameKo

  const salary = formatSalary()

  return (
    <div className="space-y-6">
      {/* Apply Button Section */}
      {(job.apply_url || job.apply_email) && (
        <Button
          onClick={handleApply}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
          size="lg"
        >
          {job.apply_url ? t('jobDetail.apply') : t('jobDetail.applyByEmail')}
          <ExternalLink className="w-5 h-5 ml-2" />
        </Button>
      )}

      {/* Job Summary Panel */}
      <Card className="p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg text-gray-900">{t('jobDetail.jobInfo')}</h3>
          {user && canLike && (
            <LikeButton
              postId={job.id}
              initialLiked={isLiked}
              initialCount={displayLikes}
              canLike={canLike}
              compact
            />
          )}
        </div>

        <div className="space-y-3 divide-y divide-slate-100">
          {/* Posted date */}
          <div className="flex items-start gap-3 pt-3 first:pt-0">
            <Calendar className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-xs text-slate-500 mb-1">{t('jobDetail.postedAt')}</div>
              <div className="text-sm font-medium text-slate-900">
                {formatDistanceToNow(new Date(job.published_at || job.created_at), {
                  addSuffix: true,
                  locale: language === 'en' ? enUS : ko,
                })}
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start gap-3 pt-3">
            <MapPin className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-xs text-slate-500 mb-1">{t('jobDetail.location')}</div>
              <div className="text-sm font-medium text-slate-900">
                {getWorkLocation()}
              </div>
            </div>
          </div>

          {/* Work location type */}
          {getWorkLocationType() && (
            <div className="flex items-start gap-3 pt-3">
              <Building2 className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-xs text-slate-500 mb-1">{t('jobDetail.workType')}</div>
                <div className="text-sm font-medium text-slate-900">
                  {getWorkLocationType()}
                </div>
              </div>
            </div>
          )}

          {/* Job type */}
          {jobTypeKo && (
            <div className="flex items-start gap-3 pt-3">
              <Briefcase className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-xs text-slate-500 mb-1">{t('jobDetail.jobType')}</div>
                <div className="text-sm font-medium text-slate-900">
                  {jobTypeKo}
                </div>
              </div>
            </div>
          )}

          {/* Salary */}
          {salary && (
            <div className="flex items-start gap-3 pt-3">
              <DollarSign className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-xs text-slate-500 mb-1">{t('jobDetail.salary')}</div>
                <div className="text-sm font-medium text-slate-900">
                  {salary}
                </div>
              </div>
            </div>
          )}

          {/* Korean level */}
          {koreanLevelKo && (
            <div className="flex items-start gap-3 pt-3">
              <Languages className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-xs text-slate-500 mb-1">{t('common.korean')}</div>
                <div className="text-sm font-medium text-slate-900">
                  {koreanLevelKo}
                </div>
              </div>
            </div>
          )}

          {/* English level (only if not not_specified) */}
          {job.english_level && job.english_level !== 'not_specified' && englishLevelKo && (
            <div className="flex items-start gap-3 pt-3">
              <Languages className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-xs text-slate-500 mb-1">{t('common.english')}</div>
                <div className="text-sm font-medium text-slate-900">
                  {englishLevelKo}
                </div>
              </div>
            </div>
          )}

          {/* Career level */}
          {careerLevelKo && (
            <div className="flex items-start gap-3 pt-3">
              <GraduationCap className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-xs text-slate-500 mb-1">{t('jobDetail.career')}</div>
                <div className="text-sm font-medium text-slate-900">
                  {careerLevelKo}
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

    </div>
  )
}
