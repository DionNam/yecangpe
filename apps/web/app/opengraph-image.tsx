import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'PotenHire - 한국어 가능한 외국인을 위한 구인구직 플랫폼'
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
          background: 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)',
          position: 'relative',
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: 'absolute',
            left: -100,
            bottom: -100,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'rgba(59, 130, 246, 0.1)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: -50,
            top: -50,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'rgba(59, 130, 246, 0.1)',
          }}
        />

        {/* Logo */}
        <div
          style={{
            position: 'absolute',
            top: 60,
            left: 60,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 40,
              fontWeight: 700,
              color: 'white',
            }}
          >
            P
          </div>
        </div>

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              fontSize: 96,
              fontWeight: 800,
              color: 'white',
              letterSpacing: -2,
            }}
          >
            PotenHire
          </div>
          <div
            style={{
              fontSize: 36,
              color: '#94a3b8',
              marginTop: 20,
            }}
          >
            한국어 가능한 외국인을 위한 구인구직 플랫폼
          </div>
        </div>

        {/* URL */}
        <div
          style={{
            position: 'absolute',
            bottom: 60,
            fontSize: 28,
            color: '#64748b',
          }}
        >
          potenhire.com
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
