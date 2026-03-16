import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'

export default async function AppleIcon() {
  const imageData = await fetch(
    new URL('../public/favicon.png', import.meta.url)
  ).then((res) => res.arrayBuffer())

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'white',
        }}
      >
        <img
          src={`data:image/png;base64,${Buffer.from(imageData).toString('base64')}`}
          width="160"
          height="160"
          style={{
            objectFit: 'contain',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  )
}
