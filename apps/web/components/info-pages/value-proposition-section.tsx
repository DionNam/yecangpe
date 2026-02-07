'use client'

import { motion } from 'motion/react'
import { Target, Briefcase, Globe, CheckCircle } from 'lucide-react'

const valueProps = [
  {
    icon: Target,
    title: '타겟 인력풀',
    description: '한국어 구사자만을 위한 전문 잡보드',
    colorClass: 'bg-blue-100 text-blue-600',
  },
  {
    icon: Briefcase,
    title: '다양한 고용 형태',
    description: '정규직, 파트타임, 프리랜서, 인턴십 등',
    colorClass: 'bg-emerald-100 text-emerald-600',
  },
  {
    icon: Globe,
    title: '글로벌 커버리지',
    description: '전 세계 어디서든 일자리 검색 가능',
    colorClass: 'bg-amber-100 text-amber-600',
  },
  {
    icon: CheckCircle,
    title: '검증된 공고',
    description: '모든 공고는 관리자 승인 후 게시',
    colorClass: 'bg-purple-100 text-purple-600',
  },
]

export function ValuePropositionSection() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12"
        >
          HangulJobs가 도와드립니다
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {valueProps.map((prop, index) => {
            const Icon = prop.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-slate-50 rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                <div className={`w-12 h-12 rounded-lg ${prop.colorClass} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{prop.title}</h3>
                <p className="text-gray-600">{prop.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
