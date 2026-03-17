'use client'

import { useState } from 'react'
import { subscribeNewsletter } from '@/app/actions/newsletter'
import { useTranslation } from '@/lib/i18n'

export function NewsletterSection() {
  const [selectedType, setSelectedType] = useState<'job_seeker' | 'employer'>('job_seeker')
  const [status, setStatus] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { t } = useTranslation()

  async function handleSubmit(formData: FormData) {
    // Optimistic: show success immediately
    setIsSubmitting(true)
    setStatus(t('newsletter.success'))
    setIsSuccess(true)

    formData.set('type', selectedType)

    const result = await subscribeNewsletter(formData)

    if (result.error) {
      setStatus(result.error)
      setIsSuccess(false)
    }

    setIsSubmitting(false)
  }

  return (
    <section className="relative py-12 md:py-20 bg-slate-900 text-white overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>
      {/* Decorative gradient blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />

      <div className="relative max-w-4xl mx-auto px-6">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-3">
          {t('newsletter.title')}
        </h2>
        <p className="text-slate-400 text-center mb-8 text-lg">
          {t('newsletter.subtitle')}
        </p>

        {/* Type selector */}
        <div className="flex gap-4 justify-center mb-6">
          <button
            onClick={() => setSelectedType('job_seeker')}
            className={`px-4 py-2 md:px-6 md:py-2.5 rounded-xl font-semibold transition-all ${
              selectedType === 'job_seeker'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {t('newsletter.seekerType')}
          </button>
          <button
            onClick={() => setSelectedType('employer')}
            className={`px-4 py-2 md:px-6 md:py-2.5 rounded-xl font-semibold transition-all ${
              selectedType === 'employer'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {t('newsletter.employerType')}
          </button>
        </div>

        {/* Form */}
        <form action={handleSubmit} className="grid sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
          <input
            type="text"
            name="name"
            placeholder={t('newsletter.namePlaceholder')}
            required
            disabled={isSubmitting}
            className="px-4 py-3.5 rounded-xl bg-slate-800 text-white placeholder-slate-500 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          />
          <input
            type="email"
            name="email"
            placeholder={t('newsletter.emailPlaceholder')}
            required
            disabled={isSubmitting}
            className="px-4 py-3.5 rounded-xl bg-slate-800 text-white placeholder-slate-500 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold transition-all shadow-lg shadow-blue-600/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? t('newsletter.subscribing') : t('newsletter.subscribe')}
          </button>
        </form>

        {/* Status message */}
        {status && (
          <p className={`text-center mt-4 text-sm ${
            isSuccess ? 'text-emerald-400' : 'text-red-400'
          }`}>
            {status}
          </p>
        )}
      </div>
    </section>
  )
}
