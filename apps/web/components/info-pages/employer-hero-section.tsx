'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import { Sparkles, Shield, Globe, ArrowRight, Users } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

export function EmployerHeroSection() {
  const { t } = useTranslation()

  const problems = t('employerPage.problems') as unknown as string[]
  const solutions = t('employerPage.solutions') as unknown as string[]

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-50 via-white to-slate-50 py-12 md:py-20">
        {/* Decorative blur circles */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-emerald-300/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-6"
            >
              <span className="px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold">
                {t('employerPage.badge')}
              </span>
            </motion.div>

            {/* Title with color highlight */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl md:text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight tracking-tight"
            >
              {t('employerPage.title')}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed"
            >
              {t('employerPage.subtitle')}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <Link
                href="/employer/new-post"
                className="group px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl transition-all shadow-lg shadow-amber-600/25 flex items-center justify-center gap-2 text-lg font-semibold"
              >
                {t('employerPage.ctaPrimary')}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              {/* TODO: Talent browse - premium feature
              <Link
                href="/employer/talent"
                className="group px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 text-lg font-semibold"
              >
                <Users className="w-5 h-5" />
                {t('employerPage.ctaTalent')}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              */}
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap gap-8 justify-center text-sm text-gray-600"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span className="font-medium">{t('employerPage.trustFree')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-500" />
                <span className="font-medium">{t('employerPage.trustVerified')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-500" />
                <span className="font-medium">{t('employerPage.trustGlobal')}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Problem -> Solution Section */}
      <section className="relative overflow-hidden bg-white py-12 md:py-20">
        {/* Decorative blur circles */}
        <div className="absolute top-10 right-20 w-64 h-64 bg-red-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-20 w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16">
            {/* Problem */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
                {t('employerPage.problemTitle')}
              </h2>
              <div className="space-y-4">
                {Array.isArray(problems) && problems.map((text, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="flex gap-4 bg-red-50/60 rounded-xl p-4 border border-red-100"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm">
                      {i + 1}
                    </div>
                    <p className="text-base md:text-lg text-gray-700">{text}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Solution */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
                {t('employerPage.solutionTitle')}
              </h2>
              <div className="space-y-4">
                {Array.isArray(solutions) && solutions.map((text, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 + 0.1 }}
                    className="flex gap-4 bg-emerald-50/60 rounded-xl p-4 border border-emerald-100"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm">
                      {i + 1}
                    </div>
                    <p className="text-base md:text-lg text-gray-700">{text}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
