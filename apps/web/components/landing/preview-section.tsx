'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { ArrowRight, Calendar } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

interface JobPreview {
  id: string
  slug: string | null
  title: string
  company_name: string
  job_type: string | null
  work_location_type: string | null
  work_location_country: string | null
  published_at: string | null
}

interface PreviewSectionProps {
  initialJobs: JobPreview[]
}

// Helper to format field values nicely
const formatFieldValue = (value: string) => {
  return value
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

// Helper to format work location type
const formatWorkLocationType = (type: string) => {
  const mapping: Record<string, string> = {
    remote: 'Remote',
    on_site: 'On-site',
    hybrid: 'Hybrid',
  }
  return mapping[type] || formatFieldValue(type)
}

// Format date helper
const formatDate = (dateString: string | null) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function PreviewSection({ initialJobs }: PreviewSectionProps) {
  const { t } = useTranslation()

  return (
    <section className="relative py-20 bg-white overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-blue-50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-50 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-slate-600 font-medium mb-3 text-xs tracking-widest uppercase">
            {t('preview.eyebrow')}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            {t('preview.title')}
          </h2>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            {t('preview.subtitle')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {initialJobs.slice(0, 6).map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group cursor-pointer"
            >
              <Link href={`/jobs/${job.slug || job.id}`} className="block h-full">
                <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200 p-6 h-full flex flex-col group-hover:-translate-y-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    {job.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">{job.company_name}</p>

                  {/* Badges */}
                  <div className="flex gap-2 flex-wrap mb-4">
                    {job.job_type && (
                      <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium">
                        {formatFieldValue(job.job_type)}
                      </span>
                    )}
                    {job.work_location_type && (
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-md text-xs font-medium">
                        {formatWorkLocationType(job.work_location_type)}
                      </span>
                    )}
                    {job.work_location_country && (
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-medium">
                        {job.work_location_country}
                      </span>
                    )}
                  </div>

                  {/* Published date */}
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-5 mt-auto">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(job.published_at)}</span>
                  </div>

                  {/* View Details button */}
                  <div className="w-full group/btn px-4 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2 text-sm font-medium">
                    {t('preview.viewDetails')}
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center"
        >
          <Link
            href="/jobs"
            className="group px-8 py-3.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/25 inline-flex items-center gap-2 text-sm font-semibold"
          >
            {t('preview.viewAll')}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
