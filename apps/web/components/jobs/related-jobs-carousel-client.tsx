'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { JOB_TYPES, SALARY_PERIODS } from '@repo/lib'
import { formatDistanceToNow } from 'date-fns'
import { ko, enUS } from 'date-fns/locale'
import { useTranslation } from '@/lib/i18n'

interface RelatedJob {
  id: string
  slug: string | null
  title: string
  company_name: string
  image_url: string | null
  work_location_type: string | null
  work_location_country: string | null
  job_type: string | null
  published_at: string | null
  salary_min: number | null
  salary_max: number | null
  salary_currency: string | null
  salary_period: string | null
}

interface RelatedJobsCarouselClientProps {
  jobs: RelatedJob[]
}

export function RelatedJobsCarouselClient({ jobs }: RelatedJobsCarouselClientProps) {
  const { t, language } = useTranslation()

  // Logo fallback colors (same pattern as job-card.tsx)
  const logoColors = [
    'bg-blue-500',
    'bg-amber-500',
    'bg-emerald-500',
    'bg-purple-500',
    'bg-pink-500',
  ]

  const getLogoFallback = (companyName: string) => {
    const colorIndex = companyName.charCodeAt(0) % logoColors.length
    const initial = companyName.charAt(0).toUpperCase()
    return { color: logoColors[colorIndex], initial }
  }

  const getWorkLocationTypeName = (type: string | null) => {
    if (!type) return null
    if (type === 'remote') return t('filters.remote')
    if (type === 'hybrid') return t('filters.hybrid')
    if (type === 'on_site') return t('common.onSiteShort')
    return type
  }

  const formatSalary = (
    min: number | null,
    max: number | null,
    currency: string | null,
    period: string | null
  ) => {
    if (!min && !max) return null

    const currencySymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '₩'
    const periodEntry = period ? SALARY_PERIODS.find(p => p.code === period) : null
    const periodText = periodEntry
      ? (language === 'en' ? periodEntry.name : periodEntry.nameKo)
      : (period || '')

    if (min && max) {
      return `${currencySymbol}${min.toLocaleString()} - ${currencySymbol}${max.toLocaleString()} ${periodText}`
    } else if (min) {
      return `${currencySymbol}${min.toLocaleString()}+ ${periodText}`
    } else {
      return `${currencySymbol}${max!.toLocaleString()} ${periodText}`
    }
  }

  return (
    <>
    <h2 className="text-2xl font-bold mb-6">{t('jobDetail.relatedJobs')}</h2>
    <Carousel
      opts={{
        align: 'start',
        loop: false,
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-2 md:-ml-4">
        {jobs.map(job => {
          const jobTypeEntry = JOB_TYPES.find(jt => jt.code === job.job_type)
          const jobTypeKo = language === 'en' ? jobTypeEntry?.name : jobTypeEntry?.nameKo
          const workLocationType = getWorkLocationTypeName(job.work_location_type)
          const salary = formatSalary(
            job.salary_min,
            job.salary_max,
            job.salary_currency,
            job.salary_period
          )
          const postedDate = job.published_at
            ? formatDistanceToNow(new Date(job.published_at), { addSuffix: true, locale: language === 'en' ? enUS : ko })
            : null

          const logoFallback = getLogoFallback(job.company_name)

          return (
            <CarouselItem
              key={job.id}
              className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
            >
              <Link
                href={`/jobs/${job.slug || job.id}`}
                className="block h-full group hover:shadow-lg transition-shadow duration-200 rounded-xl bg-white border border-slate-200 overflow-hidden"
              >
                <div className="p-4 flex flex-col h-full">
                  {/* Company Logo */}
                  <div className="flex items-center gap-3 mb-3">
                    {job.image_url ? (
                      <div className="relative w-12 h-12 flex-shrink-0 overflow-hidden rounded-lg border border-slate-200">
                        <Image
                          src={job.image_url}
                          alt={`${job.company_name} 로고`}
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div
                        className={`w-12 h-12 flex-shrink-0 rounded-lg ${logoFallback.color} flex items-center justify-center text-white font-bold text-lg`}
                      >
                        {logoFallback.initial}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {job.title}
                      </h3>
                    </div>
                  </div>

                  {/* Company Name */}
                  <p className="text-sm text-slate-600 mb-2">{job.company_name}</p>

                  {/* Location + Job Type Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {jobTypeKo && (
                      <Badge variant="default" className="bg-blue-500 text-xs">
                        {jobTypeKo}
                      </Badge>
                    )}
                    {workLocationType && (
                      <Badge variant="default" className="bg-emerald-500 text-xs">
                        {workLocationType}
                      </Badge>
                    )}
                    {job.work_location_type === 'on_site' && job.work_location_country && (
                      <Badge variant="outline" className="text-xs">
                        {job.work_location_country}
                      </Badge>
                    )}
                  </div>

                  {/* Salary */}
                  {salary && (
                    <p className="text-sm font-semibold text-gray-900 mb-2">{salary}</p>
                  )}

                  {/* Posted Date */}
                  {postedDate && (
                    <p className="text-xs text-slate-500 mt-auto">{postedDate}</p>
                  )}
                </div>
              </Link>
            </CarouselItem>
          )
        })}
      </CarouselContent>
      <CarouselPrevious className="hidden md:flex" />
      <CarouselNext className="hidden md:flex" />
    </Carousel>
    </>
  )
}
