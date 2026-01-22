'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { User } from '@supabase/supabase-js'
import { UserMenu } from '@/components/layout/user-menu'

interface SiteHeaderProps {
  user: User | null
}

export function SiteHeader({ user }: SiteHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <span className="text-lg font-bold text-white italic">P</span>
            </div>
            <span className="text-xl font-bold text-gray-900">PotenHire</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/jobs" className="text-sm text-gray-600 hover:text-slate-900 transition-colors font-medium">
              공고 보기
            </Link>
            <Link href="/employer" className="text-sm text-gray-600 hover:text-slate-900 transition-colors font-medium">
              구인자
            </Link>
            <Link href="/jobs" className="text-sm text-gray-600 hover:text-slate-900 transition-colors font-medium">
              구직자
            </Link>
            
            {user ? (
               <UserMenu user={user} />
            ) : (
               <Link href="/login" className="px-5 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium">
                 로그인
               </Link>
            )}
          </nav>

          <div className="flex items-center gap-4 md:hidden">
             {user && <UserMenu user={user} />}
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
              공고 보기
            </Link>
            <Link href="/employer" className="block text-sm text-gray-600 font-medium" onClick={() => setMobileMenuOpen(false)}>
              구인자
            </Link>
            <Link href="/jobs" className="block text-sm text-gray-600 font-medium" onClick={() => setMobileMenuOpen(false)}>
              구직자
            </Link>
            {!user && (
                <Link href="/login" className="block w-full text-center px-5 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                  로그인
                </Link>
            )}
        </div>
      )}
    </motion.header>
  )
}
