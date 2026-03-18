'use server'

import { createClient } from '@repo/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { seekerProfileSchema, employerProfileSchema } from '@/lib/validations/auth'

export async function createSeekerProfile(formData: FormData) {
  const supabase = await createClient()

  // Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { error: 'Unauthorized' }
  }

  // Parse form data
  const isPublic = formData.get('is_profile_public') === 'true'

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

  const rawData = {
    is_profile_public: isPublic,
    nationality: formData.get('nationality'),
    korean_level: formData.get('korean_level') || 'not_specified',
    occupation: formData.get('occupation') || null,
    referral_source: formData.get('referral_source') || null,
    // Extended fields for public profiles
    display_name: formData.get('display_name') || undefined,
    bio: formData.get('bio') || undefined,
    english_level: formData.get('english_level') || undefined,
    country_of_residence: formData.get('country_of_residence') || undefined,
    portfolio_url: formData.get('portfolio_url') || undefined,
    linkedin_url: formData.get('linkedin_url') || undefined,
    phone: formData.get('phone') || undefined,
    preferred_contact_method: formData.get('preferred_contact_method') || undefined,
    preferred_location_type: formData.get('preferred_location_type') || undefined,
    preferred_job_types: parseArray('preferred_job_types'),
    preferred_categories: parseArray('preferred_categories'),
    preferred_countries: parseArray('preferred_countries'),
  }

  // Validate with Zod schema
  const result = seekerProfileSchema.safeParse(rawData)
  if (!result.success) {
    console.error('Validation error:', result.error)
    return { error: result.error.flatten().fieldErrors }
  }

  // Upsert users table first (required for FK constraint)
  const { error: userError } = await supabase
    .from('users')
    .upsert({
      id: user.id,
      email: user.email!,
      role: 'seeker',
      marketing_consent: result.data.marketing_consent || false,
      marketing_consent_at: result.data.marketing_consent ? new Date().toISOString() : null,
    } as any)

  if (userError) {
    console.error('User upsert error:', userError)
    return { error: userError.message }
  }

  // Prepare data for insert, filtering out undefined values
  const profileData: any = {
    user_id: user.id,
    is_profile_public: result.data.is_profile_public,
    nationality: result.data.nationality,
    korean_level: result.data.korean_level,
    occupation: result.data.occupation,
    referral_source: result.data.referral_source,
  }

  // Add extended fields if they exist
  if (result.data.display_name) profileData.display_name = result.data.display_name
  if (result.data.bio) profileData.bio = result.data.bio
  if (result.data.english_level) profileData.english_level = result.data.english_level
  if (result.data.country_of_residence) profileData.country_of_residence = result.data.country_of_residence
  if (result.data.portfolio_url) profileData.portfolio_url = result.data.portfolio_url
  if (result.data.linkedin_url) profileData.linkedin_url = result.data.linkedin_url
  if (result.data.phone) profileData.phone = result.data.phone
  if (result.data.preferred_contact_method) profileData.preferred_contact_method = result.data.preferred_contact_method
  if (result.data.preferred_location_type) profileData.preferred_location_type = result.data.preferred_location_type
  if (result.data.preferred_job_types && result.data.preferred_job_types.length > 0) {
    profileData.preferred_job_types = result.data.preferred_job_types
  }
  if (result.data.preferred_categories && result.data.preferred_categories.length > 0) {
    profileData.preferred_categories = result.data.preferred_categories
  }
  if (result.data.preferred_countries && result.data.preferred_countries.length > 0) {
    profileData.preferred_countries = result.data.preferred_countries
  }

  // Insert seeker profile
  const { error: profileError } = await supabase
    .from('seeker_profiles')
    .insert(profileData)

  if (profileError) {
    console.error('Profile insert error:', profileError)
    return { error: profileError.message }
  }

  // Revalidate and redirect to jobs page for seekers
  revalidatePath('/')
  redirect('/jobs')
}

export async function createEmployerProfile(formData: FormData) {
  const supabase = await createClient()

  // Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { error: 'Unauthorized' }
  }

  // Helper to parse JSON arrays
  const parseArray = (key: string): string[] | undefined => {
    const value = formData.get(key)
    if (!value) return undefined
    try {
      return JSON.parse(value as string)
    } catch {
      return undefined
    }
  }

  // Parse form data
  const rawData = {
    company_name: formData.get('company_name'),
    referral_source: formData.get('referral_source') || null,
    target_countries: parseArray('target_countries'),
    marketing_consent: formData.get('marketing_consent') === 'true',
  }

  // Validate with Zod schema
  const result = employerProfileSchema.safeParse(rawData)
  if (!result.success) {
    return { error: result.error.flatten().fieldErrors }
  }

  // Upsert users table first (required for FK constraint)
  const { error: userError } = await supabase
    .from('users')
    .upsert({
      id: user.id,
      email: user.email!,
      role: 'employer',
      marketing_consent: result.data.marketing_consent || false,
      marketing_consent_at: result.data.marketing_consent ? new Date().toISOString() : null,
    } as any)

  if (userError) {
    console.error('User upsert error:', userError)
    return { error: userError.message }
  }

  // Insert employer profile
  const { error: profileError } = await supabase
    .from('employer_profiles')
    .insert({
      user_id: user.id,
      company_name: result.data.company_name,
      referral_source: result.data.referral_source,
      target_countries: result.data.target_countries || null,
    } as any)

  if (profileError) {
    console.error('Profile insert error:', profileError)
    return { error: profileError.message }
  }

  // Revalidate and redirect to employers page
  revalidatePath('/')
  redirect('/employers')
}
