'use server'

import { createClient } from '@repo/supabase/server'
import { revalidatePath } from 'next/cache'
import { metricsConfigSchema } from '@/lib/validations/settings'

export async function updateMetricsConfig(formData: FormData) {
  const supabase = await createClient()

  // Verify admin (defense in depth)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: { _form: ['로그인이 필요합니다'] } }

  const { data: profile } = await (supabase as any)
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return { error: { _form: ['관리자 권한이 필요합니다'] } }
  }

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

  revalidatePath('/settings')
  return { success: true }
}
