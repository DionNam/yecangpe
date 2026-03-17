'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

interface FinalCTASectionProps {
  variant: 'seeker' | 'employer'
}

export function FinalCTASection({ variant }: FinalCTASectionProps) {
  const { t } = useTranslation()

  const prefix = variant === 'seeker' ? 'seekerPage' : 'employerPage'
  const heading = t(`${prefix}.ctaHeading`)
  const subtitle = t(`${prefix}.ctaSubtitle`)
  const primaryText = t(`${prefix}.ctaPrimaryButton`)
  const secondaryText = t(`${prefix}.ctaSecondaryButton`)

  const primaryHref = variant === 'seeker' ? '/jobs' : '/employer/new-post'
  const secondaryHref = variant === 'seeker' ? '#newsletter' : '/employer/talent'
  const primaryBgClass = variant === 'seeker' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/25' : 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/25'

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-slate-900 to-slate-800 py-12 md:py-20">
      {/* Decorative blur circles */}
      <div className="absolute top-10 left-20 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{heading}</h2>
          <p className="text-lg md:text-xl text-slate-300 mb-8">{subtitle}</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={primaryHref}
              className={`group px-8 py-4 ${primaryBgClass} text-white rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-lg font-semibold`}
            >
              {primaryText}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href={secondaryHref}
              className="px-8 py-4 bg-white text-slate-900 border-2 border-white hover:bg-slate-100 rounded-xl transition-all text-lg font-semibold"
            >
              {secondaryText}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
