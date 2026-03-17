'use client'

import Link from 'next/link'
import { useTranslation } from '@/lib/i18n'

export function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="bg-slate-900 text-slate-400 py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main footer grid */}
        <div className="grid md:grid-cols-4 gap-6 md:gap-8 mb-8">
          {/* Column 1 - Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo-full.png" alt="HangulJobs" className="h-8 brightness-0 invert" />
            </div>
            <p className="text-sm mb-4">
              {t('footer.taglineEn')}
            </p>
            <p className="text-xs text-slate-500">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Column 2 - Browse Jobs */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t('footer.browseJobs')}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/jobs?work_location_type=remote" className="hover:text-white transition-colors">
                  {t('footer.remoteJobs')}
                </Link>
              </li>
              <li>
                <Link href="/jobs?job_type=full_time" className="hover:text-white transition-colors">
                  {t('footer.fullTimeJobs')}
                </Link>
              </li>
              <li>
                <Link href="/jobs?job_type=part_time" className="hover:text-white transition-colors">
                  {t('footer.partTimeJobs')}
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="hover:text-white transition-colors">
                  {t('footer.allJobs')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Resources */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t('footer.resources')}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/job-seekers" className="hover:text-white transition-colors">
                  {t('footer.forJobSeekers')}
                </Link>
              </li>
              <li>
                <Link href="/employers" className="hover:text-white transition-colors">
                  {t('footer.forEmployers')}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  {t('footer.faqLink')}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  {t('footer.about')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 - Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t('footer.legal')}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  {t('footer.terms')}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  {t('footer.privacy')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  {t('footer.contact')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800 flex justify-between items-center">
          <p className="text-xs">{t('footer.copyright')}</p>
          <div className="flex gap-6 text-xs">
            <a href="#" className="hover:text-white transition-colors">
              Twitter
            </a>
            <a href="#" className="hover:text-white transition-colors">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
