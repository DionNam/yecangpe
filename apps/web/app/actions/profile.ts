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

  // Parse arrays from JSON strings
  const parseArray = (key: string): string[] => {
    const value = formData.get(key)
    if (!value) return []
    try {
      return JSON.parse(value as string)
    } catch {
      return []
    }
  }

  // Parse formData into raw object
  const rawData = {
    is_profile_public: formData.get('is_profile_public') === 'true',
    nationality: formData.get('nationality'),
    korean_level: formData.get('korean_level') || 'not_specified',
    occupation: formData.get('occupation') || null,
    referral_source: formData.get('referral_source') || null,
    display_name: formData.get('display_name') || '',
    bio: formData.get('bio') || '',
    english_level: formData.get('english_level') || undefined,
    country_of_residence: formData.get('country_of_residence') || undefined,
    portfolio_url: formData.get('portfolio_url') || '',
    linkedin_url: formData.get('linkedin_url') || '',
    phone: formData.get('phone') || undefined,
    preferred_contact_method: formData.get('preferred_contact_method') || undefined,
    preferred_location_type: formData.get('preferred_location_type') || undefined,
    preferred_job_types: parseArray('preferred_job_types'),
    preferred_categories: parseArray('preferred_categories'),
    preferred_countries: parseArray('preferred_countries'),
  }

  // Validate data
  const result = seekerProfileUpdateSchema.safeParse(rawData)
  if (!result.success) {
    return { error: result.error.flatten().fieldErrors }
  }

  // Build update object
  const updateData: any = {
    is_profile_public: result.data.is_profile_public,
    nationality: result.data.nationality,
    korean_level: result.data.korean_level,
    occupation: result.data.occupation,
    referral_source: result.data.referral_source,
    // Always update these (allow clearing when going private)
    display_name: result.data.display_name || null,
    bio: result.data.bio || null,
    english_level: result.data.english_level || null,
    country_of_residence: result.data.country_of_residence || null,
    portfolio_url: result.data.portfolio_url || null,
    linkedin_url: result.data.linkedin_url || null,
    phone: result.data.phone || null,
    preferred_contact_method: result.data.preferred_contact_method || null,
    preferred_location_type: result.data.preferred_location_type || null,
    preferred_job_types: result.data.preferred_job_types?.length ? result.data.preferred_job_types : null,
    preferred_categories: result.data.preferred_categories?.length ? result.data.preferred_categories : null,
    preferred_countries: result.data.preferred_countries?.length ? result.data.preferred_countries : null,
  }

  // Update seeker profile
  const { error: updateError } = await (supabase as any)
    .from('seeker_profiles')
    .update(updateData)
    .eq('user_id', user.id)

  if (updateError) {
    return { error: { _form: [updateError.message] } }
  }

  revalidatePath('/dashboard')
  return { success: true }
}
