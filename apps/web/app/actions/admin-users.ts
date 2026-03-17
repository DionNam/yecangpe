'use server'

import { createClient } from '@repo/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Verify that the current user is an admin
 * Defense-in-depth: middleware checks already, but verify at action level
 */
async function verifyAdmin() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: profile } = await (supabase as any)
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    throw new Error('Admin access required')
  }

  return { supabase, user }
}

export async function toggleUserActive(userId: string, isActive: boolean) {
  const { supabase } = await verifyAdmin()

  // Update user active status
  const { error } = await (supabase as any)
    .from('users')
    .update({ is_active: isActive })
    .eq('id', userId)

  if (error) throw error

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/users/seekers')
  revalidatePath('/dashboard/users/employers')
  return { success: true }
}
