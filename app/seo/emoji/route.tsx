/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from 'next/og'

export const runtime = 'edge'

/**
 * @name Emoji Template
 * @description zero-effort template with a centered emoji
 */
export async function GET() {
  return new ImageResponse(
    (
      <div tw="flex items-center justify-center w-full h-full p-4 bg-black border-[20px] border-white/10">
        <span
          style={{
            fontSize: '300px',
          }}
        >
          🔥
        </span>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        'Cache-Control': 'public, max-age=3600, immutable',
      },
    },
  )
}
