'use server'

import { createClient } from '@repo/supabase/server'

const BUCKET_NAME = 'job-images'

/**
 * Get a signed URL for uploading an image to job-images bucket
 * Returns both the signed URL and the final public URL
 */
export async function getSignedUploadUrl(postId: string, filename: string) {
  const supabase = await createClient()

  // Verify user is authenticated and is employer or admin
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { error: '로그인이 필요합니다.' }
  }

  // Check if user is employer or admin
  const { data: profileData } = await (supabase as any)
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  const profile = profileData as { role: string } | null

  const { data: employerProfile } = await supabase
    .from('employer_profiles')
    .select('user_id')
    .eq('user_id', user.id)
    .single()

  if (profile?.role !== 'admin' && !employerProfile) {
    return { error: '권한이 없습니다.' }
  }

  // Generate unique filename to avoid collisions
  const extension = filename.split('.').pop() || 'jpg'
  const timestamp = Date.now()
  const storagePath = `${postId}/${timestamp}.${extension}`

  // Create signed upload URL (valid for 60 seconds)
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUploadUrl(storagePath)

  if (error) {
    console.error('Signed URL creation error:', error)
    return { error: '이미지 업로드 URL 생성에 실패했습니다.' }
  }

  // Construct the public URL that will be accessible after upload
  const { data: publicUrlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(storagePath)

  return {
    signedUrl: data.signedUrl,
    publicUrl: publicUrlData.publicUrl,
    path: storagePath,
  }
}

/**
 * Delete an image from storage (used when replacing or removing images)
 */
export async function deleteJobImage(imagePath: string) {
  const supabase = await createClient()

  // Verify user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { error: '로그인이 필요합니다.' }
  }

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([imagePath])

  if (error) {
    console.error('Image deletion error:', error)
    return { error: '이미지 삭제에 실패했습니다.' }
  }

  return { success: true }
}
