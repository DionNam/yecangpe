import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '관리자 패널',
  description: '한국어 가능한 외국인을 위한 구인구직 플랫폼',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
