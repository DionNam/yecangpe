'use client'

import { LoginButton } from '@/components/auth/login-button'
import { createClient } from '@repo/supabase/client'
import { Sparkles, Shield, Globe, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useRef, useState } from 'react'

export default function LoginPage() {
  const [clickCount, setClickCount] = useState(0)
  const [showEmailLogin, setShowEmailLogin] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const lastClickTime = useRef(0)
  const router = useRouter()

  const handleTitleClick = useCallback(() => {
    const now = Date.now()
    // Reset counter if more than 2 seconds since last click
    if (now - lastClickTime.current > 2000) {
      setClickCount(1)
    } else {
      setClickCount((prev) => {
        const next = prev + 1
        if (next >= 10) {
          setShowEmailLogin(true)
        }
        return next
      })
    }
    lastClickTime.current = now
  }, [])

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const supabase = createClient()
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError(signInError.message)
        setIsLoading(false)
        return
      }

      router.push('/')
    } catch {
      setError('An unexpected error occurred')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-50">
      {/* Back button */}
      <div className="absolute top-8 left-8 z-10">
        <a href="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors group">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
          >
            <path d="m15 18-6-6 6-6"/>
          </svg>
          메인으로
        </a>
      </div>

      {/* Simple background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-white to-slate-100" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl opacity-10 bg-slate-900" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-10 bg-slate-900" />
      </div>

      <div className="w-full max-w-md">
        <div className="relative">
          {/* Main card */}
          <div className="relative bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            {/* Header section */}
            <div className="relative p-8 pb-6 bg-slate-50">
              {/* Brand badge */}
              <div className="flex justify-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 text-white">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-medium">HangulJobs</span>
                </div>
              </div>

              {/* Title - clickable area for hidden login */}
              <h1
                className="text-4xl font-bold text-center mb-3 tracking-tight text-gray-900 select-none cursor-default"
                onClick={handleTitleClick}
              >
                환영합니다
              </h1>
              <p className="text-center text-lg text-slate-600">
                한국어 가능한 외국인을 위한 채용 플랫폼
              </p>
            </div>

            {/* Login section */}
            <div className="p-8 pt-6">
              <LoginButton />

              {/* Hidden email/password login form */}
              {showEmailLogin && (
                <form onSubmit={handleEmailLogin} className="mt-4 space-y-3">
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400"
                  />
                  {error && (
                    <p className="text-xs text-red-500">{error}</p>
                  )}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-10 text-sm font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 transition-colors flex items-center justify-center"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Sign in'
                    )}
                  </button>
                </form>
              )}

              {/* Trust indicators */}
              <div className="mt-8 pt-8 border-t border-slate-200">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <div className="p-2 rounded-lg bg-slate-100">
                      <Shield className="w-4 h-4 text-slate-900" />
                    </div>
                    <span>관리자 승인형 공고로 안전한 플랫폼</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <div className="p-2 rounded-lg bg-slate-100">
                      <Globe className="w-4 h-4 text-slate-900" />
                    </div>
                    <span>다양한 국적의 글로벌 인재 연결</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-sm text-slate-600 mt-6">
          계정이 없으신가요? 로그인 후 자동으로 프로필을 생성합니다
        </p>
      </div>
    </div>
  )
}
