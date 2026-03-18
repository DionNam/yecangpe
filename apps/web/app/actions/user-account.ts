'use server'

import { createClient } from '@repo/supabase/server'
import { revalidatePath } from 'next/cache'

interface DeleteAccountResult {
  success: boolean
  error?: string
}

/**
 * Hard delete user account (user-initiated)
 * Permanently deletes user and all related data from database
 * WARNING: This is irreversible
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

    // Delete from public.users (will cascade to related tables)
    const { error: deleteError } = await (supabase as any)
      .from('users')
      .delete()
      .eq('id', user.id)

    if (deleteError) {
      console.error('Error deleting user data:', deleteError)
      return { success: false, error: deleteError.message || 'Failed to delete account' }
    }

    // Delete from auth.users using admin API
    const { error: authDeleteError } = await supabase.auth.admin.deleteUser(user.id)

    if (authDeleteError) {
      console.error('Error deleting auth user:', authDeleteError)
      // Continue anyway since public.users is already deleted
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

    const { data: adminUser } = await (supabase as any).from('users').select('role').eq('id', user.id).single()

    if (adminUser?.role !== 'admin') {
      return { success: false, error: 'Unauthorized' }
    }

    // Soft delete using RPC function
    const { data, error: rpcError } = await (supabase as any).rpc('soft_delete_user_account', {
      user_id_param: userId,
      reason_param: reason || 'Admin deleted account',
    })

    if (rpcError || !data) {
      console.error('Error deleting user:', rpcError)
      return { success: false, error: rpcError?.message || 'Failed to delete user' }
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

    const { data: adminUser } = await (supabase as any).from('users').select('role').eq('id', user.id).single()

    if (adminUser?.role !== 'admin') {
      return { success: false, error: 'Unauthorized' }
    }

    // Restore using RPC function
    const { data, error: rpcError } = await (supabase as any).rpc('restore_user_account', {
      user_id_param: userId,
    })

    if (rpcError || !data) {
      console.error('Error restoring user:', rpcError)
      return { success: false, error: rpcError?.message || 'Failed to restore user' }
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

    const { data: adminUser } = await (supabase as any).from('users').select('role').eq('id', user.id).single()

    if (adminUser?.role !== 'admin') {
      return { success: false, error: 'Unauthorized' }
    }

    // Hard delete using RPC function
    const { data, error: rpcError } = await (supabase as any).rpc('hard_delete_user_account', {
      user_id_param: userId,
    })

    if (rpcError || !data) {
      console.error('Error hard deleting user:', rpcError)
      return { success: false, error: rpcError?.message || 'Failed to permanently delete user' }
    }

    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    console.error('Error in adminHardDeleteUser:', error)
    return { success: false, error: 'Failed to permanently delete user' }
  }
}
