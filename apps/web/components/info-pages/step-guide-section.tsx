'use client'

import { motion } from 'motion/react'
import { Search, Heart, Send, LogIn, FileText, Users } from 'lucide-react'

interface StepGuideSectionProps {
  variant: 'seeker' | 'employer'
}

const seekerSteps = [
  {
    icon: Search,
    title: '잡 검색',
    description: '국가, 고용형태, 카테고리 등 필터로 맞춤 검색',
    colorClass: 'bg-blue-100 text-blue-600',
  },
  {
    icon: Heart,
    title: '관심 표시',
    description: '마음에 드는 공고에 하트를 눌러 저장',
    colorClass: 'bg-emerald-100 text-emerald-600',
  },
  {
    icon: Send,
    title: '직접 지원',
    description: '공고 상세에서 바로 지원하세요',
    colorClass: 'bg-amber-100 text-amber-600',
  },
]

const employerSteps = [
  {
    icon: LogIn,
    title: '무료 가입',
    description: 'Google 계정으로 간편하게 시작',
    colorClass: 'bg-blue-100 text-blue-600',
  },
  {
    icon: FileText,
    title: '공고 작성',
    description: '5분이면 완료되는 간단한 폼',
    colorClass: 'bg-emerald-100 text-emerald-600',
  },
  {
    icon: Users,
    title: '인재 매칭',
    description: '적합한 인재가 직접 지원합니다',
    colorClass: 'bg-amber-100 text-amber-600',
  },
]

export function StepGuideSection({ variant }: StepGuideSectionProps) {
  const steps = variant === 'seeker' ? seekerSteps : employerSteps
  const heading = variant === 'seeker' ? '이용 방법' : '공고 게시 절차'

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
          {heading}
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center text-center relative"
              >
                <div className="relative">
                  <div className={`w-16 h-16 rounded-full ${step.colorClass} flex items-center justify-center mb-4`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-slate-900 text-white w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
