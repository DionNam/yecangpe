'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

const colorMap = {
  blue: {
    dot: 'bg-blue-400',
    cta: 'text-blue-400 hover:text-blue-300',
  },
  amber: {
    dot: 'bg-amber-400',
    cta: 'text-amber-400 hover:text-amber-300',
  },
}

export function ServiceIntroCards() {
  const { t } = useTranslation()

  const cards = [
    {
      title: t('serviceIntro.seekerTitle'),
      description: t('serviceIntro.seekerDesc'),
      features: t('serviceIntro.seekerFeatures') as string[],
      href: '/job-seekers',
      ctaText: t('serviceIntro.seekerCta'),
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
      color: 'blue' as const,
    },
    {
      title: t('serviceIntro.employerTitle'),
      description: t('serviceIntro.employerDesc'),
      features: t('serviceIntro.employerFeatures') as string[],
      href: '/employers',
      ctaText: t('serviceIntro.employerCta'),
      image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80',
      color: 'amber' as const,
    },
  ]

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center mb-12"
        >
          {t('serviceIntro.title')}
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-8">
          {cards.map((card, index) => {
            const colors = colorMap[card.color]
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
              >
                <Link
                  href={card.href}
                  className="group block rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                >
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent" />
                    <h3 className="absolute bottom-4 left-6 text-2xl font-bold text-white">
                      {card.title}
                    </h3>
                  </div>

                  {/* Content */}
                  <div className="bg-white p-6">
                    <p className="text-gray-600 mb-5">{card.description}</p>
                    <ul className="space-y-2.5 mb-6">
                      {card.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <div
                            className={`w-1.5 h-1.5 ${colors.dot} rounded-full mt-2 shrink-0`}
                          />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <span
                      className={`inline-flex items-center gap-2 font-semibold ${card.color === 'blue' ? 'text-blue-600' : 'text-amber-600'} transition-colors`}
                    >
                      {card.ctaText}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
