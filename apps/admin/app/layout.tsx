import type { Metadata } from 'next'

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
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
