'use client'

import { motion } from 'motion/react'
import { AnimatedCounter } from './animated-counter'

const benefits = [
  {
    title: '한국어 구사 가능한 인재',
    description: '한국어를 유창하게 구사하고 한국 문화를 이해하는 외국인 인재를 찾을 수 있습니다',
  },
  {
    title: '승인형 공고로 신뢰도 확보',
    description: '모든 공고는 관리자 승인 후 게시되어 허위 공고 없이 신뢰할 수 있는 정보만 제공됩니다',
  },
  {
    title: '간편한 공고 등록',
    description: '복잡한 절차 없이 필요한 정보만 입력하면 빠르게 채용 공고를 게시할 수 있습니다',
  },
]

interface WhyEmployersSectionProps {
  employerCount: number
}

export function WhyEmployersSection({ employerCount }: WhyEmployersSectionProps) {
  return (
    <section className="relative py-24 bg-white overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
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
            구인자를 위한 혜택
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 tracking-tight">
            우수한 외국인 인재를
            <br />
            쉽게 찾으세요
          </h2>

          {/* Live Stats Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-4 px-8 py-5 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200 shadow-lg shadow-slate-200/50 mb-6"
          >
            {/* Live Indicator */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <div className="absolute inset-0 w-2 h-2 bg-blue-500 rounded-full animate-ping opacity-75" />
              </div>
              <span className="text-xs font-medium text-blue-600 tracking-wide">
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
            PotenHire는 한국어 가능한 글로벌 인재와 기업을 연결하는 신뢰할 수 있는 플랫폼입니다
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
              <div className="bg-slate-50 rounded-xl p-6 h-full hover:shadow-lg transition-all duration-300 border border-slate-100">
                <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
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
