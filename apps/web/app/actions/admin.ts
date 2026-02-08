'use server'

import { createClient } from '@repo/supabase/server'

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: profile } = await (supabase as any)
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if ((profile as any)?.role !== 'admin') throw new Error('Forbidden')
  return supabase
}

export async function getNewsletterSubscribers() {
  const supabase = await requireAdmin()

  const { data, error } = await (supabase as any)
    .from('newsletter_subscribers')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch subscribers:', error)
    return { subscribers: [], error: error.message }
  }

  return { subscribers: data || [] }
}

export async function deleteNewsletterSubscriber(id: string) {
  const supabase = await requireAdmin()

  const { error } = await (supabase as any)
    .from('newsletter_subscribers')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}
