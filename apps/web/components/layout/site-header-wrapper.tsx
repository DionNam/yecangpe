import { createClient } from '@repo/supabase/server'
import { SiteHeader } from '@/components/site-header'

export async function SiteHeaderWrapper() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let userRole: 'seeker' | 'employer' | 'admin' | null = null

  if (user) {
    const { data: userData } = await (supabase as any)
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    userRole = userData?.role || null
  }

  return <SiteHeader user={user} role={userRole} />
}
