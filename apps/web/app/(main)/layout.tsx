import type { ReactNode } from 'react'
import { createClient } from '@repo/supabase/server'

export default async function MainLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <>
      <main className="min-h-screen pt-16 bg-slate-50">{children}</main>
    </>
  )
}
