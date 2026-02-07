'use server'

import { createClient } from '@repo/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createJobAlert(data: {
  keywords?: string
  country?: string
  job_type?: string
  frequency: string
}) {
  const supabase = await createClient()

  // Authenticate user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Authentication required' }
  }

  // Insert job alert
  const { error } = await (supabase as any).from('job_alerts').insert({
    user_id: user.id,
    keywords: data.keywords || null,
    country: data.country || null,
    job_type: data.job_type || null,
    frequency: data.frequency,
    is_active: true,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function updateJobAlert(
  id: string,
  data: {
    keywords?: string
    country?: string
    job_type?: string
    frequency?: string
    is_active?: boolean
  }
) {
  const supabase = await createClient()

  // Authenticate user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Authentication required' }
  }

  // Update job alert (RLS also enforces this, but belt-and-suspenders)
  const { error } = await (supabase as any)
    .from('job_alerts')
    .update(data)
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteJobAlert(id: string) {
  const supabase = await createClient()

  // Authenticate user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Authentication required' }
  }

  // Delete job alert
  const { error } = await (supabase as any)
    .from('job_alerts')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { success: true }
}
