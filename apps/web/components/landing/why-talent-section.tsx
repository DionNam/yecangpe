'use client'

import { motion } from 'motion/react'
import { AnimatedCounter } from './animated-counter'

const benefits = [
  {
    number: '01',
    title: '국적에 맞는 공고',
    description: '내 국적에 맞는 채용 공고를 필터링해서 찾을 수 있어 시간을 절약할 수 있습니다',
  },
  {
    number: '02',
    title: '한국어로 소통',
    description: '모든 공고가 한국어로 작성되어 있어 이해하기 쉽고 댓글로 궁금한 점을 물어볼 수 있습니다',
  },
  {
    number: '03',
    title: '검증된 공고만',
    description: '관리자가 검토한 신뢰할 수 있는 공고만 게시되어 안심하고 지원할 수 있습니다',
  },
]

interface WhyTalentSectionProps {
  employerCount: number
}

export function WhyTalentSection({ employerCount }: WhyTalentSectionProps) {
  return (
    <section className="relative py-24 bg-gradient-to-br from-slate-50 via-white to-slate-50 overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgb(15 23 42) 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-slate-600 font-medium mb-4 text-xs tracking-widest uppercase">
            구직자를 위한 혜택
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 tracking-tight">
            나에게 맞는
            <br />
            일자리를 쉽게 찾으세요
          </h2>

          {/* Live Stats Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-4 px-8 py-5 bg-white rounded-2xl border border-slate-200 shadow-lg shadow-slate-200/50 mb-6"
          >
            {/* Live Indicator */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <div className="absolute inset-0 w-2 h-2 bg-emerald-500 rounded-full animate-ping opacity-75" />
              </div>
              <span className="text-xs font-medium text-emerald-600 tracking-wide">
                LIVE
              </span>
            </div>

            <div className="h-6 w-px bg-slate-200" />

            {/* Animated Counter */}
            <div className="flex items-baseline gap-2">
              <AnimatedCounter
                value={employerCount}
                duration={2500}
                className="text-2xl md:text-3xl font-bold text-slate-900 tabular-nums"
              />
              <span className="text-sm font-medium text-slate-600">
                개 기업이 채용 중
              </span>
            </div>
          </motion.div>

          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            HangulJobs는 외국인 구직자에게 신뢰할 수 있는 채용 정보를 제공합니다
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-white rounded-xl p-6 hover:shadow-lg transition-all duration-300 border border-slate-200 h-full">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                    <span className="text-white text-lg font-bold">{benefit.number}</span>
                  </div>
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
