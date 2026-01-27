'use server'

import { createClient } from '@repo/supabase/server'
import { redirect } from 'next/navigation'

export async function adminLogin(formData: FormData) {
  const email = formData.get('username') as string
  const password = formData.get('password') as string

  const supabase = await createClient()

  // Sign in with Supabase
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (authError) {
    console.error('Admin login error:', authError)
    return { error: '이메일 또는 비밀번호가 올바르지 않습니다.' }
  }

  // Check if user has admin role
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', authData.user.id)
    .single<{ role: string }>()

  if (!profile || profile.role !== 'admin') {
    await supabase.auth.signOut()
    return { error: '관리자 권한이 없습니다.' }
  }

  redirect('/')
}
