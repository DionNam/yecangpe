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
    throw new Error('Unauthorized')
  }

  // Parse form data
  const rawData = {
    nationality: formData.get('nationality'),
    topik_level: formData.get('topik_level') || null,
    occupation: formData.get('occupation') || null,
    referral_source: formData.get('referral_source') || null,
  }

  // Validate with Zod schema
  const result = seekerProfileSchema.safeParse(rawData)
  if (!result.success) {
    return { error: result.error.flatten().fieldErrors }
  }

  // Upsert users table first (required for FK constraint)
  const { error: userError } = await supabase
    .from('users')
    .upsert({
      id: user.id,
      email: user.email!,
      role: 'seeker',
    } as any)

  if (userError) throw userError

  // Insert seeker profile
  const { error: profileError } = await supabase
    .from('seeker_profiles')
    .insert({
      user_id: user.id,
      ...result.data,
    } as any)

  if (profileError) throw profileError

  // Revalidate and redirect
  revalidatePath('/')
  redirect('/')
}

export async function createEmployerProfile(formData: FormData) {
  const supabase = await createClient()

  // Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error('Unauthorized')
  }

  // Parse form data
  const rawData = {
    company_name: formData.get('company_name'),
    referral_source: formData.get('referral_source') || null,
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
    } as any)

  if (userError) throw userError

  // Insert employer profile
  const { error: profileError } = await supabase
    .from('employer_profiles')
    .insert({
      user_id: user.id,
      ...result.data,
    } as any)

  if (profileError) throw profileError

  // Revalidate and redirect
  revalidatePath('/')
  redirect('/')
}
