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

    // Get session for authentication
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return { success: false, error: 'No active session' }
    }

    // Call Edge Function to safely delete user with service role key
    const functionUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/delete-user`
    console.log('Calling Edge Function:', functionUrl)

    const deleteResponse = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        userId: user.id,
        reason: reason || 'User requested account deletion',
      }),
    })

    console.log('Edge Function response status:', deleteResponse.status)

    if (!deleteResponse.ok) {
      const errorText = await deleteResponse.text()
      console.error('Edge Function error response:', errorText)
      return { success: false, error: `Server error: ${deleteResponse.status} - ${errorText}` }
    }

    const result = await deleteResponse.json()
    console.log('Edge Function result:', result)

    if (!result.success) {
      console.error('Error deleting account:', result.error)
      return { success: false, error: result.error || 'Failed to delete account' }
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
