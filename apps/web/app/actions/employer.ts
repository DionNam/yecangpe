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
