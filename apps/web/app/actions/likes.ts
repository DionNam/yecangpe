'use server'

import { createClient } from '@repo/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleLike(postId: string) {
  const supabase = await createClient()

  // Check authentication
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error('Unauthorized')
  }

  // Verify user is a seeker
  const { data: seekerProfile } = await supabase
    .from('seeker_profiles')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!seekerProfile) {
    throw new Error('Only seekers can like posts')
  }

  // Check if like already exists
  const { data: existingLikes } = await (supabase as any)
    .from('likes')
    .select('id')
    .eq('user_id', user.id)
    .eq('post_id', postId)

  const existingLike = existingLikes && existingLikes.length > 0 ? existingLikes[0] : null

  let liked = false

  if (existingLike) {
    // Unlike: delete the existing like
    const { error: deleteError } = await (supabase as any)
      .from('likes')
      .delete()
      .eq('id', existingLike.id)

    if (deleteError) {
      console.error('Error deleting like:', deleteError)
      throw new Error('Failed to unlike post')
    }
    liked = false
  } else {
    // Like: insert new like
    const { error: insertError } = await (supabase as any)
      .from('likes')
      .insert({
        user_id: user.id,
        post_id: postId,
      })

    if (insertError) {
      console.error('Error inserting like:', insertError)
      throw new Error('Failed to like post')
    }
    liked = true
  }

  // Fetch job slug for revalidation
  const { data: jobData } = await (supabase as any)
    .from('job_posts')
    .select('slug')
    .eq('id', postId)
    .single()

  // Revalidate paths
  revalidatePath('/jobs')
  if (jobData?.slug) {
    revalidatePath(`/jobs/${jobData.slug}`)
  }
  revalidatePath('/my-page')

  return { success: true, liked }
}
