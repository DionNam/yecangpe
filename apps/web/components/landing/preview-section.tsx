'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import { ArrowRight, Calendar } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { NATIONALITIES } from '@repo/lib/constants'

interface JobPreview {
  id: string
  title: string
  company_name: string
  target_nationality: string
  hiring_status: 'hiring' | 'closed'
  published_at: string | null
}

interface PreviewSectionProps {
  initialJobs: JobPreview[]
}

export function PreviewSection({ initialJobs }: PreviewSectionProps) {
  const [selectedNationality, setSelectedNationality] = useState<string>('ALL')

  const filteredJobs = initialJobs.filter((job) => {
    if (selectedNationality === 'ALL') return true
    return (
      job.target_nationality === selectedNationality ||
      job.target_nationality === 'ANY'
    )
  })

  // Filter out 'ANY' from dropdown options (same as JobListFilters pattern)
  const nationalityOptions = NATIONALITIES.filter((n) => n.code !== 'ANY')

  // Helper to get nationality name
  const getNationalityName = (code: string) => {
    return NATIONALITIES.find(n => n.code === code)?.name || code
  }
  
  // Format date helper
  const formatDate = (dateString: string | null) => {
     if (!dateString) return ''
     return new Date(dateString).toLocaleDateString('ko-KR')
  }

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
          <p className="text-slate-600 font-medium mb-3 text-xs tracking-widest uppercase">최신 채용</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            최신 채용 공고
          </h2>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            실제 채용 공고를 미리 확인해보세요
          </p>
        </motion.div>
        
        {/* Filter */}
        <div className="mb-8 flex justify-center">
             <div className="w-full max-w-xs">
               <Select
                 value={selectedNationality}
                 onValueChange={setSelectedNationality}
               >
                 <SelectTrigger className="bg-white border-slate-200">
                   <SelectValue />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="ALL">전체</SelectItem>
                   {nationalityOptions.map((n) => (
                     <SelectItem key={n.code} value={n.code}>
                       {n.name}
                     </SelectItem>
                   ))}
                 </SelectContent>
               </Select>
             </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {filteredJobs.slice(0, 6).map((job, index) => (
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
                    <div className="flex gap-2 mb-4">
                      <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-medium">
                        {getNationalityName(job.target_nationality)}
                      </span>
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md text-xs font-medium">
                        {job.hiring_status === 'hiring' ? '채용중' : '마감'}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2">{job.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{job.company_name}</p>
                    <div className="flex flex-col gap-1.5 text-xs text-gray-500 mb-5 mt-auto">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(job.published_at)}</span>
                      </div>
                    </div>
                    <div className="w-full group/btn px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2 text-xs font-medium">
                      자세히 보기
                      <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                    </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        
        {filteredJobs.length === 0 && (
             <div className="text-center py-12 mb-8">
               <p className="text-muted-foreground">
                 선택한 국적에 해당하는 공고가 없습니다
               </p>
             </div>
        )}

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
            전체 공고 보기
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
