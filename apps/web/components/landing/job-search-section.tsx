'use client'

import { Search, MapPin } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { motion } from 'motion/react'
import { useTranslation } from '@/lib/i18n'

export function JobSearchSection() {
  const router = useRouter()
  const [keyword, setKeyword] = useState('')
  const [location, setLocation] = useState('')
  const { t } = useTranslation()

  const tags: string[] = t('jobSearch.tags')

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (keyword) params.set('search', keyword)
    if (location) params.set('location', location)
    router.push(`/jobs?${params.toString()}`)
  }

  function handleTagClick(tag: string) {
    router.push(`/jobs?search=${encodeURIComponent(tag)}`)
  }

  return (
    <section className="py-12 md:py-20 bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-12"
        >
          {t('jobSearch.title')}
        </motion.h2>

        <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t('jobSearch.keywordPlaceholder')}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t('jobSearch.locationPlaceholder')}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            {t('jobSearch.searchButton')}
          </button>
        </form>

        {/* Popular tags */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-3">{t('jobSearch.popularSearches')}</p>
          <div className="flex flex-wrap justify-center gap-2">
            {tags.map((tag: string) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm hover:border-blue-500 hover:text-blue-600 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
