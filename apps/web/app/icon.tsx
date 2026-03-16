import { ImageResponse } from 'next/og'

export const runtime = 'edge'

// favicon: Hangul ㅎ character
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: '#1e293b',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignments: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 700,
          borderRadius: 6,
        }}
      >
        ㅎ
      </div>
    ),
    {
      ...size,
    }
  )
}
