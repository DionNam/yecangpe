'use client'

import { motion } from 'motion/react'
import { Target, Briefcase, Globe, CheckCircle } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

const iconConfig = [
  { icon: Target, colorClass: 'bg-blue-100 text-blue-600' },
  { icon: Briefcase, colorClass: 'bg-emerald-100 text-emerald-600' },
  { icon: Globe, colorClass: 'bg-amber-100 text-amber-600' },
  { icon: CheckCircle, colorClass: 'bg-purple-100 text-purple-600' },
]

export function ValuePropositionSection() {
  const { t } = useTranslation()
  const valueProps = t('seekerPage.valuePropositions') as Array<{ title: string; description: string }>

  return (
    <section className="bg-white py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12"
        >
          {t('seekerPage.valuePropositionTitle')}
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {valueProps.map((prop, index) => {
            const Icon = iconConfig[index].icon
            const colorClass = iconConfig[index].colorClass
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-slate-50 rounded-xl p-4 md:p-6 hover:shadow-md transition-shadow"
              >
                <div className={`w-12 h-12 rounded-lg ${colorClass} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{prop.title}</h3>
                <p className="text-gray-600">{prop.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
