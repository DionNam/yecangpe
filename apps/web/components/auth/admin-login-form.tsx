'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { createClient } from '@repo/supabase/client'
import { useRouter } from 'next/navigation'

const ADMIN_USERNAME = 'admin'
const ADMIN_PASSWORD = 'Nasig0reng!'
const ADMIN_EMAIL = 'ndh8392@gmail.com'

export function AdminLoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const username = formData.get('username') as string
    const password = formData.get('password') as string

    // Verify credentials
    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      setError('아이디 또는 비밀번호가 일치하지 않습니다')
      setIsLoading(false)
      return
    }

    try {
      // Sign in with admin email and password
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      })

      if (signInError) {
        console.error('Supabase auth error:', signInError)
        setError('로그인 처리 중 오류가 발생했습니다')
        setIsLoading(false)
        return
      }

      if (!data.user) {
        setError('관리자 계정을 찾을 수 없습니다')
        setIsLoading(false)
        return
      }

      router.push('/employer/posts')
      router.refresh()
    } catch (error) {
      console.error('Admin login error:', error)
      setError('로그인 처리 중 오류가 발생했습니다')
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-1.5">
          아이디
        </label>
        <Input
          id="username"
          name="username"
          type="text"
          required
          className="w-full"
          placeholder="admin"
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
          비밀번호
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          className="w-full"
          placeholder="••••••••"
          disabled={isLoading}
        />
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-11 text-sm font-medium"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            로그인 중...
          </>
        ) : (
          '로그인'
        )}
      </Button>
    </form>
  )
}
