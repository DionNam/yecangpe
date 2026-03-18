'use server'

import { createClient } from '@repo/supabase/server'
import { revalidatePath } from 'next/cache'

interface DeleteAccountResult {
  success: boolean
  error?: string
}

/**
 * Soft delete user account (user-initiated)
 * Sets deleted_at timestamp and optionally stores reason
 */
export async function deleteUserAccount(reason?: string): Promise<DeleteAccountResult> {
  try {
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: 'Not authenticated' }
    }

    // Soft delete: set deleted_at timestamp
    const { error: updateError } = await (supabase as any)
      .from('users')
      .update({
        deleted_at: new Date().toISOString(),
        deletion_reason: reason || 'User requested account deletion',
        is_active: false,
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('Error deleting account:', updateError)
      return { success: false, error: updateError.message }
    }

    // Sign out the user
    await supabase.auth.signOut()

    revalidatePath('/', 'layout')
    return { success: true }
  } catch (error) {
    console.error('Error in deleteUserAccount:', error)
    return { success: false, error: 'Failed to delete account' }
  }
}

/**
 * Admin: Soft delete any user account
 */
export async function adminDeleteUser(userId: string, reason?: string): Promise<DeleteAccountResult> {
  try {
    const supabase = await createClient()

    // Verify admin
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: 'Not authenticated' }
    }

    const { data: adminUser } = await supabase.from('users').select('role').eq('id', user.id).single()

    if (adminUser?.role !== 'admin') {
      return { success: false, error: 'Unauthorized' }
    }

    // Soft delete user
    const { error: updateError } = await (supabase as any)
      .from('users')
      .update({
        deleted_at: new Date().toISOString(),
        deletion_reason: reason || 'Admin deleted account',
        is_active: false,
      })
      .eq('id', userId)

    if (updateError) {
      console.error('Error deleting user:', updateError)
      return { success: false, error: updateError.message }
    }

    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    console.error('Error in adminDeleteUser:', error)
    return { success: false, error: 'Failed to delete user' }
  }
}

/**
 * Admin: Restore deleted user account
 */
export async function adminRestoreUser(userId: string): Promise<DeleteAccountResult> {
  try {
    const supabase = await createClient()

    // Verify admin
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: 'Not authenticated' }
    }

    const { data: adminUser } = await supabase.from('users').select('role').eq('id', user.id).single()

    if (adminUser?.role !== 'admin') {
      return { success: false, error: 'Unauthorized' }
    }

    // Restore user
    const { error: updateError } = await (supabase as any)
      .from('users')
      .update({
        deleted_at: null,
        deletion_reason: null,
        is_active: true,
      })
      .eq('id', userId)

    if (updateError) {
      console.error('Error restoring user:', updateError)
      return { success: false, error: updateError.message }
    }

    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    console.error('Error in adminRestoreUser:', error)
    return { success: false, error: 'Failed to restore user' }
  }
}

/**
 * Admin: Permanently delete user and all related data (hard delete)
 * WARNING: This is irreversible
 */
export async function adminHardDeleteUser(userId: string): Promise<DeleteAccountResult> {
  try {
    const supabase = await createClient()

    // Verify admin
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: 'Not authenticated' }
    }

    const { data: adminUser } = await supabase.from('users').select('role').eq('id', user.id).single()

    if (adminUser?.role !== 'admin') {
      return { success: false, error: 'Unauthorized' }
    }

    // Hard delete user (cascades to related tables via FK constraints)
    const { error: deleteError } = await supabase.from('users').delete().eq('id', userId)

    if (deleteError) {
      console.error('Error hard deleting user:', deleteError)
      return { success: false, error: deleteError.message }
    }

    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    console.error('Error in adminHardDeleteUser:', error)
    return { success: false, error: 'Failed to permanently delete user' }
  }
}
