'use client'

import Link from 'next/link'
import { ArrowLeft, Calendar, Eye, User } from 'lucide-react'
import { Footer } from '@/components/landing/footer'
import { useTranslation } from '@/lib/i18n'

interface BlogPost {
  id: string
  slug: string
  title: string
  content: string
  excerpt: string | null
  language: string
  category: string
  author_name: string
  thumbnail_url: string | null
  published_at: string | null
  view_count: number
}

const LANGUAGE_LABELS: Record<string, string> = {
  ko: '한국어',
  en: 'English',
  id: 'Bahasa Indonesia',
  vi: 'Tiếng Việt',
  zh: '中文',
  ja: '日本語',
}

export function BlogDetailClient({ post }: { post: BlogPost }) {
  const { t } = useTranslation()

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-b from-slate-50 to-white pt-12 pb-8">
        <div className="max-w-3xl mx-auto px-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('blog.backToList')}
          </Link>

          <div className="flex gap-2 mb-4">
            <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
              {t(`blog.categories.${post.category}` as any) || post.category}
            </span>
            <span className="px-2.5 py-0.5 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
              {LANGUAGE_LABELS[post.language]}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              {post.author_name}
            </span>
            {post.published_at && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {new Date(post.published_at).toLocaleDateString()}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              {post.view_count}
            </span>
          </div>
        </div>
      </section>

      {/* Thumbnail */}
      {post.thumbnail_url && (
        <div className="max-w-3xl mx-auto px-6 mb-8">
          <img
            src={post.thumbnail_url}
            alt={post.title}
            className="w-full rounded-2xl object-cover max-h-[400px]"
          />
        </div>
      )}

      {/* Content */}
      <section className="pb-16 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div
            className="prose prose-slate prose-lg max-w-none
              prose-headings:font-bold prose-headings:text-gray-900
              prose-p:text-gray-700 prose-p:leading-relaxed
              prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-xl
              prose-blockquote:border-l-slate-300 prose-blockquote:text-gray-600"
            dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
          />
        </div>
      </section>

      <Footer />
    </>
  )
}

/** Simple markdown-like formatting: headings, bold, links, lists, paragraphs */
function formatContent(content: string): string {
  return content
    .split('\n\n')
    .map(block => {
      block = block.trim()
      if (!block) return ''

      // Headings
      if (block.startsWith('### ')) return `<h3>${escapeHtml(block.slice(4))}</h3>`
      if (block.startsWith('## ')) return `<h2>${escapeHtml(block.slice(3))}</h2>`
      if (block.startsWith('# ')) return `<h1>${escapeHtml(block.slice(2))}</h1>`

      // Unordered list
      if (block.match(/^[-*] /m)) {
        const items = block.split('\n').map(line => {
          const text = line.replace(/^[-*] /, '')
          return `<li>${inlineFormat(text)}</li>`
        }).join('')
        return `<ul>${items}</ul>`
      }

      // Ordered list
      if (block.match(/^\d+\. /m)) {
        const items = block.split('\n').map(line => {
          const text = line.replace(/^\d+\. /, '')
          return `<li>${inlineFormat(text)}</li>`
        }).join('')
        return `<ol>${items}</ol>`
      }

      // Blockquote
      if (block.startsWith('> ')) {
        const text = block.split('\n').map(l => l.replace(/^> ?/, '')).join('<br>')
        return `<blockquote><p>${inlineFormat(text)}</p></blockquote>`
      }

      // Regular paragraph
      return `<p>${inlineFormat(block)}</p>`
    })
    .join('')
}

function inlineFormat(text: string): string {
  let result = escapeHtml(text)
  // Bold
  result = result.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  // Italic
  result = result.replace(/\*(.+?)\*/g, '<em>$1</em>')
  // Links
  result = result.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
  // Line breaks
  result = result.replace(/\n/g, '<br>')
  return result
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}
