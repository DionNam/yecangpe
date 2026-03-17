'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useTranslation } from '@/lib/i18n'

export function RoleErrorToast() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { t } = useTranslation()
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (searchParams.get('role_error') === 'employer_only') {
      setShow(true)
      // Clean up the URL
      const url = new URL(window.location.href)
      url.searchParams.delete('role_error')
      router.replace(url.pathname + url.search, { scroll: false })
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => setShow(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [searchParams, router])

  if (!show) return null

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-xl shadow-lg flex items-center gap-3">
        <span className="text-lg">⚠️</span>
        <p className="font-medium">{t('roleError.employerOnly')}</p>
        <button
          onClick={() => setShow(false)}
          className="ml-4 text-red-400 hover:text-red-600"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
