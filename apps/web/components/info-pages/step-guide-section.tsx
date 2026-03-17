'use client'

import { motion } from 'motion/react'
import { Search, Heart, Send, LogIn, FileText, Users } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

interface StepGuideSectionProps {
  variant: 'seeker' | 'employer'
}

const seekerIcons = [Search, Heart, Send]
const employerIcons = [LogIn, FileText, Users]

const colorClasses = [
  'bg-blue-100 text-blue-600 ring-blue-200',
  'bg-emerald-100 text-emerald-600 ring-emerald-200',
  'bg-amber-100 text-amber-600 ring-amber-200',
]

export function StepGuideSection({ variant }: StepGuideSectionProps) {
  const { t } = useTranslation()

  const prefix = variant === 'seeker' ? 'seekerPage' : 'employerPage'
  const icons = variant === 'seeker' ? seekerIcons : employerIcons
  const steps = t(`${prefix}.steps`) as unknown as Array<{ title: string; description: string }>
  const heading = t(`${prefix}.stepsTitle`)

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-slate-50/50 py-12 md:py-20">
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Eyebrow + Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold mb-4">
            How It Works
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            {heading}
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting dotted lines (desktop only) */}
          <div className="hidden md:block absolute top-14 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px border-t-2 border-dashed border-slate-300" />

          {Array.isArray(steps) && steps.map((step, index) => {
            const Icon = icons[index] || Search
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="bg-white rounded-2xl p-5 md:p-8 border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center text-center relative"
              >
                <div className="relative mb-5">
                  <div className={`w-16 h-16 rounded-full ${colorClasses[index] || colorClasses[0]} ring-4 flex items-center justify-center`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-slate-900 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
