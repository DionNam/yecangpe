'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { User } from '@supabase/supabase-js'
import { UserMenu } from '@/components/layout/user-menu'
import { useTranslation } from '@/lib/i18n'

interface SiteHeaderProps {
  user: User | null
  role: 'seeker' | 'employer' | 'admin' | null
}

export function SiteHeader({ user, role }: SiteHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { t, language, setLanguage } = useTranslation()

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo-full.png"
              alt="HangulJobs"
              width={160}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/jobs" className="text-sm text-gray-600 hover:text-slate-900 transition-colors font-medium">
              {t('header.jobs')}
            </Link>
            <Link href="/employers" className="text-sm text-gray-600 hover:text-slate-900 transition-colors font-medium">
              {t('header.employer')}
            </Link>

            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'ko' ? 'en' : 'ko')}
              className="px-3 py-1.5 rounded-full border border-gray-200 text-xs font-bold text-gray-700 hover:border-gray-400 transition-colors"
            >
              {language === 'ko' ? 'EN' : 'KO'}
            </button>

            {user ? (
               <UserMenu user={user} role={role} />
            ) : (
               <Link href="/login" className="px-5 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium">
                 {t('header.login')}
               </Link>
            )}
          </nav>

          <div className="flex items-center gap-4 md:hidden">
             {/* Mobile Language Toggle */}
             <button
               onClick={() => setLanguage(language === 'ko' ? 'en' : 'ko')}
               className="px-3 py-1.5 rounded-full border border-gray-200 text-xs font-bold text-gray-700 hover:border-gray-400 transition-colors"
             >
               {language === 'ko' ? 'EN' : 'KO'}
             </button>
             {user && <UserMenu user={user} role={role} />}
             <button
                className="p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6 text-gray-900"/> : <Menu className="w-6 h-6 text-gray-900"/>}
             </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-6 py-4 space-y-4 shadow-lg">
            <Link href="/jobs" className="block text-sm text-gray-600 font-medium" onClick={() => setMobileMenuOpen(false)}>
              {t('header.jobs')}
            </Link>
            <Link href="/employers" className="block text-sm text-gray-600 font-medium" onClick={() => setMobileMenuOpen(false)}>
              {t('header.employer')}
            </Link>
            {!user && (
                <Link href="/login" className="block w-full text-center px-5 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                  {t('header.login')}
                </Link>
            )}
        </div>
      )}
    </motion.header>
  )
}
