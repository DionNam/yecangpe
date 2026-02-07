import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'HangulJobs - Find Korean-Speaking Jobs Worldwide'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default function OGImage() {
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
          backgroundColor: '#0f172a',
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              backgroundColor: '#0f172a',
              border: '2px solid #334155',
              borderRadius: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 48,
              fontWeight: 700,
              fontStyle: 'italic',
              color: 'white',
            }}
          >
            P
          </div>
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              color: 'white',
            }}
          >
            HangulJobs
          </div>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 32,
            color: '#94a3b8',
          }}
        >
          Find Korean-Speaking Jobs Worldwide
        </div>

        {/* URL */}
        <div
          style={{
            position: 'absolute',
            bottom: 50,
            fontSize: 24,
            color: '#64748b',
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
