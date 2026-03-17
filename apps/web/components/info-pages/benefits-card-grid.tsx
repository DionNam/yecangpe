'use client'

import { motion } from 'motion/react'
import { DollarSign, Target, Shield, BarChart } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

const icons = [DollarSign, Target, Shield, BarChart]
const colorClasses = [
  'bg-blue-100 text-blue-600',
  'bg-emerald-100 text-emerald-600',
  'bg-amber-100 text-amber-600',
  'bg-purple-100 text-purple-600',
]

export function BenefitsCardGrid() {
  const { t } = useTranslation()

  const benefits = t('employerPage.benefits') as unknown as Array<{ title: string; description: string }>

  return (
    <section className="relative overflow-hidden bg-slate-50 py-12 md:py-20">
      {/* Decorative blur circles */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-300/15 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-300/15 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Eyebrow + Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold mb-4">
            Benefits
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            {t('employerPage.benefitsTitle')}
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {Array.isArray(benefits) && benefits.map((benefit, index) => {
            const Icon = icons[index] || DollarSign
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-5 md:p-8 border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <div className={`w-16 h-16 rounded-2xl ${colorClasses[index] || colorClasses[0]} flex items-center justify-center mb-5`}>
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600 text-lg leading-relaxed">{benefit.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
