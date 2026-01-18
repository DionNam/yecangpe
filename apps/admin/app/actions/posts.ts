'use server'

import { createClient } from '@repo/supabase/server'
import { revalidatePath } from 'next/cache'
import { postEditSchema, postCreateSchema } from '@/lib/validations/post'

/**
 * Verify that the current user is an admin
 * Defense-in-depth: middleware checks already, but verify at action level
 */
async function verifyAdmin() {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error('로그인이 필요합니다.')
  }

  const { data: profile } = await (supabase as any)
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    throw new Error('관리자 권한이 필요합니다.')
  }

  return { supabase, user }
}

/**
 * Approve a pending post - sets review_status to 'published' and sets published_at timestamp
 */
export async function approvePost(postId: string) {
  const { supabase } = await verifyAdmin()

  const { error } = await (supabase as any)
    .from('job_posts')
    .update({
      review_status: 'published',
      published_at: new Date().toISOString(),
      rejection_reason: null,
    })
    .eq('id', postId)

  if (error) {
    console.error('Post approval error:', error)
    throw new Error('공고 승인에 실패했습니다.')
  }

  revalidatePath('/posts')
  revalidatePath('/posts/pending')
  return { success: true }
}

/**
 * Reject a pending post with a reason
 */
export async function rejectPost(postId: string, reason: string) {
  const { supabase } = await verifyAdmin()

  if (!reason || reason.trim().length === 0) {
    throw new Error('반려 사유를 입력해주세요.')
  }

  const { error } = await (supabase as any)
    .from('job_posts')
    .update({
      review_status: 'rejected',
      rejection_reason: reason,
    })
    .eq('id', postId)

  if (error) {
    console.error('Post rejection error:', error)
    throw new Error('공고 반려에 실패했습니다.')
  }

  revalidatePath('/posts')
  revalidatePath('/posts/pending')
  return { success: true }
}

/**
 * Update a post's content (title, content, company_name, target_nationality)
 */
export async function updatePost(postId: string, formData: FormData) {
  const { supabase } = await verifyAdmin()

  const rawData = {
    title: formData.get('title'),
    content: formData.get('content'),
    company_name: formData.get('company_name'),
    target_nationality: formData.get('target_nationality'),
  }

  const result = postEditSchema.safeParse(rawData)
  if (!result.success) {
    return { error: result.error.flatten().fieldErrors }
  }

  const { error } = await (supabase as any)
    .from('job_posts')
    .update({
      title: result.data.title,
      content: result.data.content,
      company_name: result.data.company_name,
      target_nationality: result.data.target_nationality,
      updated_at: new Date().toISOString(),
    })
    .eq('id', postId)

  if (error) {
    console.error('Post update error:', error)
    return { error: { _form: ['공고 수정에 실패했습니다.'] } }
  }

  revalidatePath('/posts')
  revalidatePath(`/posts/${postId}`)
  return { success: true }
}

/**
 * Create a new post as admin - immediately published
 */
export async function createAdminPost(formData: FormData) {
  const { supabase, user } = await verifyAdmin()

  const rawData = {
    title: formData.get('title'),
    content: formData.get('content'),
    company_name: formData.get('company_name'),
    target_nationality: formData.get('target_nationality'),
  }

  const result = postCreateSchema.safeParse(rawData)
  if (!result.success) {
    return { error: result.error.flatten().fieldErrors }
  }

  // Fetch global_metrics_config for view_target and like_target ranges
  const { data: configData } = await supabase
    .from('global_metrics_config')
    .select('view_target_min, view_target_max, like_target_min, like_target_max')
    .single()

  // Default values if config not found
  const config = configData || {
    view_target_min: 100,
    view_target_max: 500,
    like_target_min: 10,
    like_target_max: 50,
  }

  // Calculate random target values within configured ranges
  const viewTarget = Math.floor(
    Math.random() * (config.view_target_max - config.view_target_min + 1) + config.view_target_min
  )
  const likeTarget = Math.floor(
    Math.random() * (config.like_target_max - config.like_target_min + 1) + config.like_target_min
  )

  const { error } = await (supabase as any)
    .from('job_posts')
    .insert({
      author_id: user.id,
      title: result.data.title,
      content: result.data.content,
      company_name: result.data.company_name,
      target_nationality: result.data.target_nationality,
      review_status: 'published',
      published_at: new Date().toISOString(),
      hiring_status: 'hiring',
      view_target: viewTarget,
      like_target: likeTarget,
    })

  if (error) {
    console.error('Admin post creation error:', error)
    return { error: { _form: ['공고 등록에 실패했습니다.'] } }
  }

  revalidatePath('/posts')
  return { success: true }
}
