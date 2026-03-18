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

    // Soft delete using RPC function
    const { data, error: rpcError } = await supabase.rpc('soft_delete_user_account', {
      user_id_param: user.id,
      reason_param: reason || 'User requested account deletion',
    })

    if (rpcError || !data) {
      console.error('Error deleting account:', rpcError)
      return { success: false, error: rpcError?.message || 'Failed to delete account' }
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
    const { data, error: rpcError } = await supabase.rpc('soft_delete_user_account', {
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
    const { data, error: rpcError } = await supabase.rpc('restore_user_account', {
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
    const { data, error: rpcError } = await supabase.rpc('hard_delete_user_account', {
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
