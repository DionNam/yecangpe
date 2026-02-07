'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { ArrowRight, Calendar } from 'lucide-react'

interface JobPreview {
  id: string
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
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-slate-600 font-medium mb-3 text-xs tracking-widest uppercase">
            Latest Opportunities
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            Latest Job Openings
          </h2>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            Discover the most recent opportunities
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {initialJobs.slice(0, 8).map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <Link href={`/jobs/${job.id}`} className="block h-full">
                <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-slate-200 p-6 h-full flex flex-col">
                  <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2">
                    {job.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">{job.company_name}</p>

                  {/* Badges */}
                  <div className="flex gap-2 flex-wrap mb-4">
                    {job.job_type && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium">
                        {formatFieldValue(job.job_type)}
                      </span>
                    )}
                    {job.work_location_type && (
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md text-xs font-medium">
                        {formatWorkLocationType(job.work_location_type)}
                      </span>
                    )}
                    {job.work_location_country && (
                      <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-medium">
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
                  <div className="w-full group/btn px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2 text-xs font-medium">
                    View Details
                    <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
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
            className="group px-6 py-3 bg-white text-slate-900 rounded-lg hover:bg-slate-50 transition-all border border-slate-200 flex items-center gap-2 text-sm font-medium mx-auto inline-flex"
          >
            View All Jobs
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
