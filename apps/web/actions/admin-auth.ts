'use server'

import { createClient } from '@repo/supabase/server'

const ADMIN_USERNAME = 'admin'
const ADMIN_PASSWORD = 'Nasig0reng!'
const ADMIN_EMAIL = 'ndh8392@gmail.com'

export async function loginAsAdmin(username: string, password: string) {
  // Verify credentials
  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return { success: false, error: '아이디 또는 비밀번호가 일치하지 않습니다' }
  }

  try {
    const supabase = await createClient()

    // Sign in with admin email and the same password
    const { data, error } = await supabase.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    })

    if (error) {
      console.error('Supabase auth error:', error)
      return { success: false, error: '로그인 처리 중 오류가 발생했습니다' }
    }

    if (!data.user) {
      return { success: false, error: '관리자 계정을 찾을 수 없습니다' }
    }

    return { success: true }
  } catch (error) {
    console.error('Admin login error:', error)
    return { success: false, error: '로그인 처리 중 오류가 발생했습니다' }
  }
}
