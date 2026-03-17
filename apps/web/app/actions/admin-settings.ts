'use server'

import { createClient } from '@repo/supabase/server'
import { revalidatePath } from 'next/cache'
import { metricsConfigSchema } from '@/lib/validations/admin-settings'

/**
 * Verify that the current user is an admin
 * Defense-in-depth: middleware checks already, but verify at action level
 */
async function verifyAdmin() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { supabase: null, error: { _form: ['로그인이 필요합니다'] } }

  const { data: profile } = await (supabase as any)
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return { supabase: null, error: { _form: ['관리자 권한이 필요합니다'] } }
  }

  return { supabase, error: null }
}

export async function updateMetricsConfig(formData: FormData) {
  const { supabase, error: authError } = await verifyAdmin()
  if (authError) return { error: authError }

  const rawData = {
    view_target_min: Number(formData.get('view_target_min')),
    view_target_max: Number(formData.get('view_target_max')),
    like_target_min: Number(formData.get('like_target_min')),
    like_target_max: Number(formData.get('like_target_max')),
    ramp_days: Number(formData.get('ramp_days')),
    curve_strength: Number(formData.get('curve_strength')),
  }

  const result = metricsConfigSchema.safeParse(rawData)
  if (!result.success) {
    return { error: result.error.flatten().fieldErrors }
  }

  // Update the single config row
  const { error } = await (supabase as any)
    .from('global_metrics_config')
    .update(result.data)
    .not('id', 'is', null) // Update all rows (should be only 1)

  if (error) {
    return { error: { _form: ['설정 저장에 실패했습니다'] } }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/settings')
  return { success: true }
}

export async function updateSiteConfig(formData: FormData) {
  const { supabase, error: authError } = await verifyAdmin()
  if (authError) return { error: authError }

  const memberCountOffset = formData.get('member_count_offset')
  if (!memberCountOffset) {
    return { error: { _form: ['멤버 수 오프셋을 입력해주세요'] } }
  }

  // Validate number
  const offsetValue = Number(memberCountOffset)
  if (isNaN(offsetValue) || offsetValue < 0) {
    return { error: { _form: ['0 이상의 숫자를 입력해주세요'] } }
  }

  // Update site config
  const { error } = await (supabase as any)
    .from('site_config')
    .update({
      value: String(offsetValue),
      updated_at: new Date().toISOString(),
    })
    .eq('key', 'member_count_offset')

  if (error) {
    console.error('Site config update error:', error)
    return { error: { _form: ['설정 저장에 실패했습니다'] } }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/settings')
  revalidatePath('/', 'page') // Revalidate landing page
  return { success: true }
}
