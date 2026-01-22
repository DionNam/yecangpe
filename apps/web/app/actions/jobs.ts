'use server'

import { createClient } from '@repo/supabase/server'
import { revalidatePath } from 'next/cache'
import { jobPostSchema, jobPostUpdateSchema } from '@/lib/validations/job-post'

export async function createJobPost(formData: FormData) {
  const supabase = await createClient()

  // Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { error: { _form: ['로그인이 필요합니다.'] } }
  }

  // Verify employer role
  const { data: employerProfile } = await supabase
    .from('employer_profiles')
    .select('user_id')
    .eq('user_id', user.id)
    .single()

  if (!employerProfile) {
    return { error: { _form: ['고용주만 구인글을 작성할 수 있습니다.'] } }
  }

  // Parse form data
  const imageUrlRaw = formData.get('image_url')
  const rawData = {
    title: formData.get('title'),
    content: formData.get('content'),
    company_name: formData.get('company_name'),
    target_nationality: formData.get('target_nationality'),
    work_location_type: formData.get('work_location_type'),
    work_location_country: formData.get('work_location_country') || undefined,
    image_url: imageUrlRaw ? String(imageUrlRaw) : null,
  }

  // Validate with Zod schema
  const result = jobPostSchema.safeParse(rawData)
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

  // Insert job post with pending review status
  const { error: insertError } = await supabase
    .from('job_posts')
    .insert({
      author_id: user.id,
      title: result.data.title,
      content: result.data.content,
      company_name: result.data.company_name,
      target_nationality: result.data.target_nationality,
      work_location_type: result.data.work_location_type,
      work_location_country: result.data.work_location_country || null,
      review_status: 'pending',
      hiring_status: 'hiring',
      view_target: viewTarget,
      like_target: likeTarget,
      image_url: result.data.image_url || null,
    } as any)

  if (insertError) {
    console.error('Job post insert error:', insertError)
    return { error: { _form: ['구인글 등록에 실패했습니다. 다시 시도해주세요.'] } }
  }

  return { success: true }
}

export async function updateJobPost(formData: FormData) {
  const supabase = await createClient()

  // Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { error: { _form: ['로그인이 필요합니다.'] } }
  }

  // Parse form data
  const postId = formData.get('id') as string
  const imageUrlFormValue = formData.get('image_url')
  const rawData = {
    title: formData.get('title'),
    content: formData.get('content'),
    hiring_status: formData.get('hiring_status'),
    work_location_type: formData.get('work_location_type'),
    work_location_country: formData.get('work_location_country') || undefined,
    // Handle image_url: only include in validation if explicitly provided
    ...(imageUrlFormValue !== null && {
      image_url: imageUrlFormValue === '' ? null : String(imageUrlFormValue),
    }),
  }

  // Validate with Zod schema
  const result = jobPostUpdateSchema.safeParse(rawData)
  if (!result.success) {
    return { error: result.error.flatten().fieldErrors }
  }

  // Verify ownership and get post status
  const { data: postData } = await (supabase as any)
    .from('job_posts')
    .select('author_id, review_status')
    .eq('id', postId)
    .single()

  const post = postData as { author_id: string; review_status: string } | null
  if (!post || post.author_id !== user.id) {
    return { error: { _form: ['자신이 작성한 공고만 수정할 수 있습니다.'] } }
  }

  // Business rule: Only published posts can change hiring_status
  if (post.review_status !== 'published') {
    return { error: { _form: ['게시된 공고만 채용 상태를 변경할 수 있습니다.'] } }
  }

  // Build update object
  const updateData: Record<string, unknown> = {
    title: result.data.title,
    content: result.data.content,
    hiring_status: result.data.hiring_status,
    work_location_type: result.data.work_location_type,
    work_location_country: result.data.work_location_country || null,
    updated_at: new Date().toISOString(),
  }

  // Handle image_url - check if it was explicitly set in formData
  if (imageUrlFormValue !== null) {
    // Explicitly set (could be URL or empty string to remove)
    updateData.image_url = imageUrlFormValue === '' ? null : imageUrlFormValue
  }

  // Update job post
  const { error: updateError } = await (supabase as any)
    .from('job_posts')
    .update(updateData)
    .eq('id', postId)

  if (updateError) {
    console.error('Job post update error:', updateError)
    return { error: { _form: ['구인글 수정에 실패했습니다. 다시 시도해주세요.'] } }
  }

  revalidatePath('/employer/posts')
  return { success: true }
}

/**
 * @deprecated This function is kept for potential admin panel use.
 * Use updateJobPost instead for regular updates.
 */
export async function updateHiringStatus(
  postId: string,
  newStatus: 'hiring' | 'closed'
) {
  const supabase = await createClient()

  // Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error('로그인이 필요합니다.')
  }

  // Fetch post and verify ownership + published status
  const { data: postData } = await (supabase as any)
    .from('job_posts')
    .select('author_id, review_status')
    .eq('id', postId)
    .single()

  const post = postData as { author_id: string; review_status: string } | null
  if (!post) {
    throw new Error('공고를 찾을 수 없습니다.')
  }

  if (post.author_id !== user.id) {
    throw new Error('자신이 작성한 공고만 수정할 수 있습니다.')
  }

  if (post.review_status !== 'published') {
    throw new Error('게시된 공고만 채용 상태를 변경할 수 있습니다.')
  }

  // Update hiring status
  const { error: updateError } = await (supabase as any)
    .from('job_posts')
    .update({
      hiring_status: newStatus,
      updated_at: new Date().toISOString(),
    })
    .eq('id', postId)

  if (updateError) {
    console.error('Hiring status update error:', updateError)
    throw new Error('채용 상태 변경에 실패했습니다.')
  }

  revalidatePath('/employer/posts')
  return { success: true }
}
