'use server'

import { createClient } from '@repo/supabase/server'
import { redirect } from 'next/navigation'

const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'Nasig0reng!',
  email: 'admin@potenhire.com'
}

export async function adminLogin(formData: FormData) {
  const username = formData.get('username') as string
  const password = formData.get('password') as string

  // Validate hardcoded credentials
  if (username !== ADMIN_CREDENTIALS.username || password !== ADMIN_CREDENTIALS.password) {
    return { error: '아이디 또는 비밀번호가 올바르지 않습니다.' }
  }

  // Sign in with Supabase
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: ADMIN_CREDENTIALS.email,
    password,
  })

  if (error) {
    console.error('Admin login error:', error)
    return { error: '로그인 처리 중 오류가 발생했습니다.' }
  }

  redirect('/')
}
