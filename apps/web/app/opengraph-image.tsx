import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'HangulJobs - Find Korean-Speaking Jobs Worldwide'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function OGImage() {
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
          backgroundColor: '#f8fafc',
          padding: '40px',
        }}
      >
        {/* Main content card */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#ffffff',
            borderRadius: 24,
            padding: '80px 60px',
            width: '100%',
            flex: 1,
          }}
        >
          {/* Logo Text */}
          <div
            style={{
              fontSize: 96,
              fontWeight: 800,
              color: '#1e293b',
              marginBottom: 32,
              display: 'flex',
              letterSpacing: '-0.03em',
            }}
          >
            HangulJobs
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: 42,
              fontWeight: 600,
              color: '#475569',
              textAlign: 'center',
              marginBottom: 24,
              display: 'flex',
            }}
          >
            Find Korean-Speaking Jobs Worldwide
          </div>

          <div
            style={{
              fontSize: 32,
              color: '#64748b',
              textAlign: 'center',
              display: 'flex',
            }}
          >
            전 세계 한국어 구인구직 플랫폼
          </div>
        </div>

        {/* Bottom URL */}
        <div
          style={{
            fontSize: 24,
            color: '#94a3b8',
            marginTop: 24,
            display: 'flex',
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
