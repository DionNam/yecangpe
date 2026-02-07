'use client'

import { motion } from 'motion/react'
import Link from 'next/link'

interface FinalCTASectionProps {
  variant: 'seeker' | 'employer'
}

export function FinalCTASection({ variant }: FinalCTASectionProps) {
  const content =
    variant === 'seeker'
      ? {
          heading: '지금 바로 시작하세요',
          subtitle: '전 세계 한국어 일자리를 무료로 검색하세요',
          primaryButton: {
            text: '잡 검색하기',
            href: '/jobs',
            bgClass: 'bg-blue-600 hover:bg-blue-700',
          },
          secondaryButton: {
            text: '뉴스레터 구독',
            href: '#newsletter',
            bgClass: 'bg-white text-slate-900 border-2 border-white hover:bg-slate-100',
          },
        }
      : {
          heading: '무료로 공고를 올려보세요',
          subtitle: '한국어 가능 인재를 찾는 가장 빠른 방법',
          primaryButton: {
            text: '무료로 공고 올리기',
            href: '/employer/new-post',
            bgClass: 'bg-amber-600 hover:bg-amber-700',
          },
          secondaryButton: {
            text: '잡보드 둘러보기',
            href: '/jobs',
            bgClass: 'bg-white text-slate-900 border-2 border-white hover:bg-slate-100',
          },
        }

  return (
    <section className="bg-gradient-to-r from-slate-900 to-slate-800 py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{content.heading}</h2>
          <p className="text-xl text-slate-300 mb-8">{content.subtitle}</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={content.primaryButton.href}
              className={`px-8 py-4 ${content.primaryButton.bgClass} text-white rounded-lg transition-all shadow-lg text-lg font-semibold`}
            >
              {content.primaryButton.text}
            </Link>
            <Link
              href={content.secondaryButton.href}
              className={`px-8 py-4 ${content.secondaryButton.bgClass} rounded-lg transition-all text-lg font-semibold`}
            >
              {content.secondaryButton.text}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
