'use server'

import { createClient } from '@repo/supabase/server'

export async function adminLogin(email: string, password: string) {
  const supabase = await createClient()

  // Sign in with Supabase auth (server-side only - credentials never exposed to client)
  const { data, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (signInError || !data.user) {
    return { error: '이메일 또는 비밀번호가 일치하지 않습니다' }
  }

  // Verify admin role
  const { data: userRecord } = await supabase
    .from('users')
    .select('role')
    .eq('id', data.user.id)
    .single<{ role: string | null }>()

  if (userRecord?.role !== 'admin') {
    // Sign out non-admin user
    await supabase.auth.signOut()
    return { error: '관리자 권한이 없습니다' }
  }

  return { success: true }
}
