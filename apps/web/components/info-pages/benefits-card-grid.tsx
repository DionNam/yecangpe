'use client'

import { motion } from 'motion/react'
import { DollarSign, Target, Shield, BarChart } from 'lucide-react'

const benefits = [
  {
    icon: DollarSign,
    title: '완전 무료',
    description: '공고 게시, 지원자 조회, 통계 확인까지 모든 기능 무료',
    colorClass: 'bg-blue-100 text-blue-600',
  },
  {
    icon: Target,
    title: '타겟 인재풀',
    description: '한국어를 구사하는 글로벌 인재에게 직접 도달',
    colorClass: 'bg-emerald-100 text-emerald-600',
  },
  {
    icon: Shield,
    title: '검증된 플랫폼',
    description: '관리자 승인 프로세스로 공고 품질 보장',
    colorClass: 'bg-amber-100 text-amber-600',
  },
  {
    icon: BarChart,
    title: '실시간 통계',
    description: '공고별 조회수, 관심수를 실시간으로 확인',
    colorClass: 'bg-purple-100 text-purple-600',
  },
]

export function BenefitsCardGrid() {
  return (
    <section className="bg-slate-50 py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12"
        >
          HangulJobs를 선택해야 하는 이유
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl p-8 border border-slate-200 hover:shadow-md transition-shadow"
              >
                <div className={`w-14 h-14 rounded-full ${benefit.colorClass} flex items-center justify-center mb-4`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600 text-lg">{benefit.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
