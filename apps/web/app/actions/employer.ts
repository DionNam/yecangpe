'use server'

import { createClient } from '@repo/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Delete a job post (soft delete or hard delete)
 */
export async function deleteJobPost(postId: string): Promise<{ success: true } | { error: string }> {
  const supabase = await createClient()

  // Authenticate user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: '로그인이 필요합니다.' }
  }

  // Verify ownership
  const { data: post, error: fetchError } = await (supabase as any)
    .from('job_posts')
    .select('author_id')
    .eq('id', postId)
    .single()

  if (fetchError || !post) {
    return { error: '공고를 찾을 수 없습니다.' }
  }

  if (post.author_id !== user.id) {
    return { error: '공고를 삭제할 권한이 없습니다.' }
  }

  // Delete the post (hard delete)
  const { error: deleteError } = await (supabase as any)
    .from('job_posts')
    .delete()
    .eq('id', postId)

  if (deleteError) {
    return { error: '공고 삭제에 실패했습니다.' }
  }

  // Revalidate dashboard to show updated list
  revalidatePath('/dashboard')

  return { success: true }
}

/**
 * Update employer profile (company info)
 */
export async function updateEmployerProfile(
  formData: FormData
): Promise<{ success: true } | { error: string }> {
  const supabase = await createClient()

  // Authenticate user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: '로그인이 필요합니다.' }
  }

  // Verify employer profile exists
  const { data: profile, error: profileError } = await (supabase as any)
    .from('employer_profiles')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (profileError || !profile) {
    return { error: '고용주 프로필을 찾을 수 없습니다.' }
  }

  // Parse formData for fields
  const company_name = formData.get('company_name') as string | null
  const company_website = formData.get('company_website') as string | null
  const company_description = formData.get('company_description') as string | null
  const company_logo_url = formData.get('company_logo_url') as string | null

  // Build update object only including fields that were provided
  const updateData: Record<string, any> = {}

  if (company_name) {
    updateData.company_name = company_name
  }
  if (company_website !== null) {
    updateData.company_website = company_website || null
  }
  if (company_description !== null) {
    updateData.company_description = company_description || null
  }
  if (company_logo_url !== null) {
    // Empty string means remove, string means set
    updateData.company_logo_url = company_logo_url || null
  }

  // Update employer profile
  const { error: updateError } = await (supabase as any)
    .from('employer_profiles')
    .update(updateData)
    .eq('user_id', user.id)

  if (updateError) {
    return { error: '프로필 업데이트에 실패했습니다.' }
  }

  // Revalidate dashboard to show updated info
  revalidatePath('/dashboard')

  return { success: true }
}

/**
 * Helper function to require employer authentication
 */
async function requireEmployer() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: profile } = await (supabase as any)
    .from('employer_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!profile) throw new Error('Employer profile not found')
  return supabase
}

export interface SeekerFilters {
  nationality?: string[]
  topik_level?: number[]
  english_level?: string[]
  preferred_categories?: string[]
  preferred_job_types?: string[]
  preferred_countries?: string[]
  preferred_location_type?: string
}

/**
 * Get public seeker profiles with optional filtering
 * Only accessible to authenticated employers
 */
export async function getSeekers(filters: SeekerFilters = {}) {
  try {
    const supabase = await requireEmployer()

    let query = (supabase as any)
      .from('seeker_profiles')
      .select(`
        id,
        display_name,
        bio,
        nationality,
        topik_level,
        english_level,
        city,
        occupation,
        preferred_job_types,
        preferred_categories,
        preferred_countries,
        preferred_location_type,
        phone,
        linkedin_url,
        portfolio_url,
        preferred_contact_method,
        user_id,
        users!inner(email)
      `)
      .eq('is_profile_public', true)
      .order('created_at', { ascending: false })

    // Apply filters
    if (filters.nationality && filters.nationality.length > 0) {
      query = query.in('nationality', filters.nationality)
    }
    if (filters.topik_level && filters.topik_level.length > 0) {
      query = query.in('topik_level', filters.topik_level)
    }
    if (filters.english_level && filters.english_level.length > 0) {
      query = query.in('english_level', filters.english_level)
    }
    if (filters.preferred_categories && filters.preferred_categories.length > 0) {
      query = query.overlaps('preferred_categories', filters.preferred_categories)
    }
    if (filters.preferred_job_types && filters.preferred_job_types.length > 0) {
      query = query.overlaps('preferred_job_types', filters.preferred_job_types)
    }
    if (filters.preferred_countries && filters.preferred_countries.length > 0) {
      query = query.overlaps('preferred_countries', filters.preferred_countries)
    }
    if (filters.preferred_location_type) {
      query = query.eq('preferred_location_type', filters.preferred_location_type)
    }

    const { data, error } = await query

    if (error) {
      console.error('Failed to fetch seekers:', error)
      return { seekers: [], error: error.message }
    }

    // Flatten user email into seeker object
    const seekers = data?.map((s: any) => ({
      ...s,
      email: s.users?.email || '',
      users: undefined, // Remove nested users object
    })) || []

    return { seekers, error: null }
  } catch (error) {
    console.error('getSeekers error:', error)
    return { seekers: [], error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
