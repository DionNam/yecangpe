// Supabase Edge Function for safe user deletion
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      console.error('Missing authorization header')
      return new Response(
        JSON.stringify({ success: false, error: 'Missing authorization header' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    console.log('Auth header present, verifying token...')

    // Create Supabase client with service role for admin operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Verify JWT using service role (can verify any token)
    const token = authHeader.replace('Bearer ', '')
    const { data: { user: requestingUser }, error: verifyError } = await supabaseAdmin.auth.getUser(token)

    if (verifyError || !requestingUser) {
      console.error('Token verification failed:', verifyError?.message)
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid or expired token' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    console.log('Token verified for user:', requestingUser.id)

    const { userId, reason } = await req.json()

    if (!userId) {
      return new Response(
        JSON.stringify({ success: false, error: 'User ID is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Security check: User can only delete their own account (unless admin)
    const { data: requestingUserData } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('id', requestingUser.id)
      .single()

    const isAdmin = requestingUserData?.role === 'admin'

    if (!isAdmin && requestingUser.id !== userId) {
      console.error(`Unauthorized: User ${requestingUser.id} tried to delete ${userId}`)
      return new Response(
        JSON.stringify({ success: false, error: 'You can only delete your own account' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
      )
    }

    console.log(`Deleting user: ${userId}, reason: ${reason || 'none'}, requested by: ${requestingUser.id}`)

    // Step 1: Delete user from public.users (will cascade to related tables)
    const { error: publicDeleteError } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', userId)

    if (publicDeleteError) {
      console.error('Error deleting from public.users:', publicDeleteError)
      return new Response(
        JSON.stringify({ success: false, error: publicDeleteError.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    console.log('Deleted from public.users, now deleting from auth.users...')

    // Step 2: Delete user from auth.users
    const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(userId)

    if (authDeleteError) {
      console.error('Error deleting from auth.users:', authDeleteError)
      // public.users already deleted, log but don't fail
      return new Response(
        JSON.stringify({
          success: true,
          warning: 'User data deleted but auth cleanup failed',
          authError: authDeleteError.message
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Successfully deleted user: ${userId}`)

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
