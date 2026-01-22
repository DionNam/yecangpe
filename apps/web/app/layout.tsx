import type { Metadata } from 'next'
import { createClient } from '@repo/supabase/server'
import { SiteHeader } from '@/components/site-header'
import './globals.css'
import { ScrollFix } from '@/components/scroll-fix'

export const metadata: Metadata = {
  title: '외국인 구인구직',
  description: '한국어 가능한 외국인을 위한 구인구직 플랫폼',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <html lang="ko">
      <body>
        <SiteHeader user={user} />
        <ScrollFix />
        {children}
      </body>
    </html>
  )
}
