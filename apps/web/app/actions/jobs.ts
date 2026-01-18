'use server'

import { createClient } from '@repo/supabase/server'
import { jobPostSchema } from '@/lib/validations/job-post'

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
  const rawData = {
    title: formData.get('title'),
    content: formData.get('content'),
    company_name: formData.get('company_name'),
    target_nationality: formData.get('target_nationality'),
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
      review_status: 'pending',
      hiring_status: 'hiring',
      view_target: viewTarget,
      like_target: likeTarget,
    } as any)

  if (insertError) {
    console.error('Job post insert error:', insertError)
    return { error: { _form: ['구인글 등록에 실패했습니다. 다시 시도해주세요.'] } }
  }

  return { success: true }
}
