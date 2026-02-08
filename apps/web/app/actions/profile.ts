'use server'

import { createClient } from '@repo/supabase/server'
import { revalidatePath } from 'next/cache'
import { seekerProfileUpdateSchema } from '@/lib/validations/profile'

export async function updateSeekerProfile(formData: FormData) {
  const supabase = await createClient()

  // Verify user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error('Not authenticated')
  }

  // Parse formData into raw object
  const rawData = {
    nationality: formData.get('nationality'),
    korean_level: formData.get('korean_level') || 'not_specified',
    occupation: formData.get('occupation') || null,
    referral_source: formData.get('referral_source') || null,
  }

  // Validate data
  const result = seekerProfileUpdateSchema.safeParse(rawData)
  if (!result.success) {
    return { error: result.error.flatten().fieldErrors }
  }

  // Update seeker profile
  const { error: updateError } = await (supabase as any)
    .from('seeker_profiles')
    .update(result.data)
    .eq('user_id', user.id)

  if (updateError) {
    return { error: { _form: [updateError.message] } }
  }

  revalidatePath('/dashboard')
  return { success: true }
}
