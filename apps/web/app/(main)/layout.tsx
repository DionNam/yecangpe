import type { ReactNode } from 'react'
import { createClient } from '@repo/supabase/server'
import { MainNav } from '@/components/layout/main-nav'

export default async function MainLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <>
      <MainNav user={user} />
      <main className="min-h-screen">{children}</main>
    </>
  )
}
