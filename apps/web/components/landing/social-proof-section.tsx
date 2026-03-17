'use client'

import { motion } from 'motion/react'
import { Briefcase, Building2, Users } from 'lucide-react'
import { AnimatedCounter } from './animated-counter'
import { useTranslation } from '@/lib/i18n'

interface SocialProofSectionProps {
  jobCount: number
  companyCount: number
  memberCount: number
}

export function SocialProofSection({
  jobCount,
  companyCount,
  memberCount
}: SocialProofSectionProps) {
  const { t } = useTranslation()

  // Show minimum values for better social proof even when starting out
  const displayJobCount = Math.max(jobCount, 10)
  const displayCompanyCount = Math.max(companyCount, 25)
  const displayMemberCount = Math.max(memberCount, 100)

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="py-10 md:py-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          {/* Jobs Counter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 bg-white/15 rounded-full flex items-center justify-center mb-4">
                <Briefcase className="w-7 h-7 text-white" />
              </div>
              <AnimatedCounter
                value={displayJobCount}
                suffix="+"
                className="text-3xl md:text-5xl lg:text-6xl font-bold text-white"
              />
              <p className="text-white font-semibold mt-2 text-lg">{t('socialProof.activeJobsLabel')}</p>
              <p className="text-blue-200 text-sm">{t('socialProof.activeJobs')}</p>
            </div>
            {/* Divider for desktop */}
            <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-16 bg-white/20" />
          </motion.div>

          {/* Companies Counter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative"
          >
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 bg-white/15 rounded-full flex items-center justify-center mb-4">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <AnimatedCounter
                value={displayCompanyCount}
                suffix="+"
                className="text-3xl md:text-5xl lg:text-6xl font-bold text-white"
              />
              <p className="text-white font-semibold mt-2 text-lg">{t('socialProof.companiesLabel')}</p>
              <p className="text-blue-200 text-sm">{t('socialProof.companies')}</p>
            </div>
            <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-16 bg-white/20" />
          </motion.div>

          {/* Members Counter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 bg-white/15 rounded-full flex items-center justify-center mb-4">
                <Users className="w-7 h-7 text-white" />
              </div>
              <AnimatedCounter
                value={displayMemberCount}
                suffix="+"
                className="text-3xl md:text-5xl lg:text-6xl font-bold text-white"
              />
              <p className="text-white font-semibold mt-2 text-lg">{t('socialProof.jobSeekersLabel')}</p>
              <p className="text-blue-200 text-sm">{t('socialProof.jobSeekers')}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}
