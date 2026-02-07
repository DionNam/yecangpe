'use client'

import { motion } from 'motion/react'
import { Briefcase, Building2, Users } from 'lucide-react'
import { AnimatedCounter } from './animated-counter'

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
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="py-16 bg-white"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          {/* Jobs Counter */}
          <div>
            <Briefcase className="w-8 h-8 mx-auto mb-3 text-gray-400" />
            <AnimatedCounter
              value={jobCount}
              suffix="+"
              className="text-5xl font-bold text-blue-600"
            />
            <p className="text-gray-700 font-medium mt-2">Active Jobs</p>
            <p className="text-sm text-gray-500">등록 채용 공고</p>
          </div>

          {/* Companies Counter */}
          <div>
            <Building2 className="w-8 h-8 mx-auto mb-3 text-gray-400" />
            <AnimatedCounter
              value={companyCount}
              suffix="+"
              className="text-5xl font-bold text-amber-600"
            />
            <p className="text-gray-700 font-medium mt-2">Companies</p>
            <p className="text-sm text-gray-500">등록 기업</p>
          </div>

          {/* Members Counter */}
          <div>
            <Users className="w-8 h-8 mx-auto mb-3 text-gray-400" />
            <AnimatedCounter
              value={memberCount}
              suffix="+"
              className="text-5xl font-bold text-emerald-600"
            />
            <p className="text-gray-700 font-medium mt-2">Job Seekers</p>
            <p className="text-sm text-gray-500">가입 구직자</p>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
