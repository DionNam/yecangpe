'use client'

import Link from 'next/link'
import { Mail, Clock, Flag, Scale } from 'lucide-react'
import { Footer } from '@/components/landing/footer'
import { useTranslation } from '@/lib/i18n'

export function ContactPageClient() {
  const { t } = useTranslation()

  return (
    <>
      <section className="bg-gradient-to-b from-slate-50 to-white py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('contactPage.title')}
          </h1>
          <p className="text-xl text-gray-600">
            {t('contactPage.subtitle')}
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6 space-y-8">
          {/* Email */}
          <div className="flex gap-5 p-6 rounded-xl border border-gray-200">
            <div className="flex-shrink-0 w-11 h-11 bg-slate-100 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-slate-700" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 mb-1">{t('contactPage.email')}</h2>
              <a
                href="mailto:contact@hanguljobs.com"
                className="text-blue-600 hover:underline font-medium"
              >
                {t('contactPage.emailValue')}
              </a>
              <p className="text-sm text-gray-500 mt-1">{t('contactPage.emailDesc')}</p>
            </div>
          </div>

          {/* Response time */}
          <div className="flex gap-5 p-6 rounded-xl border border-gray-200">
            <div className="flex-shrink-0 w-11 h-11 bg-slate-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-slate-700" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 mb-1">{t('contactPage.response')}</h2>
              <p className="text-gray-700 font-medium">{t('contactPage.responseValue')}</p>
            </div>
          </div>

          {/* FAQ */}
          <div className="flex gap-5 p-6 rounded-xl border border-gray-200">
            <div className="flex-shrink-0 w-11 h-11 bg-slate-100 rounded-lg flex items-center justify-center">
              <Flag className="w-5 h-5 text-slate-700" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 mb-1">{t('contactPage.reportTitle')}</h2>
              <p className="text-sm text-gray-600">{t('contactPage.reportDesc')}</p>
            </div>
          </div>

          {/* Legal */}
          <div className="flex gap-5 p-6 rounded-xl border border-gray-200">
            <div className="flex-shrink-0 w-11 h-11 bg-slate-100 rounded-lg flex items-center justify-center">
              <Scale className="w-5 h-5 text-slate-700" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 mb-1">{t('contactPage.legalTitle')}</h2>
              <p className="text-sm text-gray-600">{t('contactPage.legalDesc')}</p>
            </div>
          </div>

          {/* FAQ link */}
          <div className="pt-4 text-sm text-gray-500">
            {t('contactPage.faqTitle')} →{' '}
            <Link href="/faq" className="text-blue-600 hover:underline">
              {t('contactPage.faqLink')}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
