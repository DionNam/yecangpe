'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { Briefcase, MapPin, Globe, Layers, Languages } from 'lucide-react'

const categories = [
  {
    title: 'By Job Type',
    description: 'Full-time, Part-time, Freelance & more',
    icon: Briefcase,
    href: '/jobs/by-type/full_time',
    color: 'bg-blue-600'
  },
  {
    title: 'By Work Location',
    description: 'Remote, Hybrid, On-site',
    icon: MapPin,
    href: '/jobs/by-location-type/remote',
    color: 'bg-emerald-600'
  },
  {
    title: 'By Region',
    description: 'Browse jobs by country',
    icon: Globe,
    href: '/jobs/by-country/KR',
    color: 'bg-amber-600'
  },
  {
    title: 'By Category',
    description: 'IT, Marketing, Teaching & more',
    icon: Layers,
    href: '/jobs/by-category/it_engineering',
    color: 'bg-purple-600'
  },
  {
    title: 'By Language Level',
    description: 'Korean proficiency levels',
    icon: Languages,
    href: '/jobs/by-language-level/advanced',
    color: 'bg-rose-600'
  }
]

export function FilterCategoryCards() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Browse Jobs by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon
            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={category.href} className="block group">
                  <div className={`rounded-xl p-6 text-white ${category.color} h-full hover:shadow-lg hover:scale-[1.02] transition-all`}>
                    <Icon className="w-10 h-10 mb-4" />
                    <h3 className="font-bold text-lg mb-1">{category.title}</h3>
                    <p className="text-sm opacity-90">{category.description}</p>
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
