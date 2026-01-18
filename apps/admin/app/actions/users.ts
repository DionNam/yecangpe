'use server'

import { createClient } from '@repo/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleUserActive(userId: string, isActive: boolean) {
  const supabase = await createClient()

  // Verify admin role (defense in depth)
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

  // Update user active status
  const { error } = await (supabase as any)
    .from('users')
    .update({ is_active: isActive })
    .eq('id', userId)

  if (error) throw error

  revalidatePath('/users/seekers')
  revalidatePath('/users/employers')
  return { success: true }
}
