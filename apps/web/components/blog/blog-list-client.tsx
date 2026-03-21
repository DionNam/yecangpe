'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calendar, Eye, ArrowRight } from 'lucide-react'
import { Footer } from '@/components/landing/footer'
import { useTranslation } from '@/lib/i18n'

interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string | null
  language: string
  category: string
  author_name: string
  thumbnail_url: string | null
  published_at: string | null
  view_count: number
}

const LANGUAGES = ['ko', 'en', 'id', 'vi', 'zh', 'ja'] as const

const LANGUAGE_LABELS: Record<string, string> = {
  ko: '한국어',
  en: 'English',
  id: 'Bahasa',
  vi: 'Tiếng Việt',
  zh: '中文',
  ja: '日本語',
}

export function BlogListClient({ posts }: { posts: BlogPost[] }) {
  const { t, language } = useTranslation()
  // Default language based on site language setting
  const defaultLang = language === 'ko' ? 'ko' : 'en'
  const [selectedLang, setSelectedLang] = useState<string>(defaultLang)

  const filtered = posts.filter(p => p.language === selectedLang)

  // Count posts per language
  const langCounts = posts.reduce<Record<string, number>>((acc, p) => {
    acc[p.language] = (acc[p.language] || 0) + 1
    return acc
  }, {})

  return (
    <>
      <section className="bg-gradient-to-b from-slate-50 to-white py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('blog.title')}
          </h1>
          <p className="text-xl text-gray-600">
            {t('blog.subtitle')}
          </p>
        </div>
      </section>

      <section className="py-12 bg-white min-h-[50vh]">
        <div className="max-w-5xl mx-auto px-6">
          {/* Language dropdown */}
          <div className="mb-8">
            <select
              value={selectedLang}
              onChange={e => setSelectedLang(e.target.value)}
              className="px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-gray-400 cursor-pointer"
            >
              {LANGUAGES.map(lang => {
                const count = langCounts[lang] || 0
                return (
                  <option key={lang} value={lang}>
                    {LANGUAGE_LABELS[lang]} ({count})
                  </option>
                )
              })}
            </select>
          </div>

          {/* Posts grid */}
          {filtered.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(post => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group block bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-gray-300 hover:shadow-md transition-all"
                >
                  {/* Thumbnail */}
                  {post.thumbnail_url ? (
                    <div className="aspect-[16/9] overflow-hidden bg-slate-100">
                      <img
                        src={post.thumbnail_url}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[16/9] bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                      <span className="text-3xl font-bold text-slate-300">
                        {LANGUAGE_LABELS[post.language]}
                      </span>
                    </div>
                  )}

                  <div className="p-5">
                    {/* Category + Language badges */}
                    <div className="flex gap-2 mb-3">
                      <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
                        {t(`blog.categories.${post.category}` as any) || post.category}
                      </span>
                      <span className="px-2.5 py-0.5 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
                        {LANGUAGE_LABELS[post.language]}
                      </span>
                    </div>

                    <h2 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h2>

                    {post.excerpt && (
                      <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                        {post.excerpt}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <div className="flex items-center gap-3">
                        {post.published_at && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(post.published_at).toLocaleDateString()}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          {post.view_count}
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl font-semibold text-gray-400 mb-2">{t('blog.noPosts')}</p>
              <p className="text-gray-400">{t('blog.noPostsDesc')}</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  )
}
