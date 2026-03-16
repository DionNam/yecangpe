import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'HangulJobs - Find Korean-Speaking Jobs Worldwide'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function OGImage() {
  const logoData = await fetch(
    new URL('../public/logo-full.png', import.meta.url)
  ).then((res) => res.arrayBuffer())

  const logoSrc = `data:image/png;base64,${Buffer.from(logoData).toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#ffffff',
          padding: '60px 80px',
        }}
      >
        {/* Logo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoSrc}
          width={480}
          height={120}
          style={{ objectFit: 'contain', marginBottom: 40 }}
          alt="HangulJobs"
        />

        {/* Tagline */}
        <div
          style={{
            fontSize: 36,
            fontWeight: 600,
            color: '#1e293b',
            textAlign: 'center',
            marginBottom: 20,
          }}
        >
          Find Korean-Speaking Jobs Worldwide
        </div>

        <div
          style={{
            fontSize: 26,
            color: '#64748b',
            textAlign: 'center',
          }}
        >
          전 세계 한국어 구인구직 플랫폼
        </div>

        {/* Bottom URL bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 8,
            backgroundColor: '#0f172a',
          }}
        />

        <div
          style={{
            position: 'absolute',
            bottom: 28,
            fontSize: 22,
            color: '#94a3b8',
          }}
        >
          hanguljobs.com
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
