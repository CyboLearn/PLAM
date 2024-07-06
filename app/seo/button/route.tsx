/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from 'next/og'

export const runtime = 'edge'

/**
 * @name Button Template
 * @description A simple template with a button
 */
export async function GET() {
  const Satoshi = await fetch(
    new URL('@/fonts/Satoshi-Black.ttf', import.meta.url),
  ).then((res) => res.arrayBuffer())

  return new ImageResponse(
    (
      <div tw="flex flex-col items-center justify-center w-full h-full bg-[#2663ec]">
        <div tw="text-[150px] -mb-2">🤯</div>
        <div tw="text-[64px] text-white mb-10">OG Image Generator</div>
        <div tw="bg-[#ffd400] rounded-full px-12 py-4 text-[60px] text-black shadow-2xl border-[10px] border-purple-400/70">
          Create beautiful OG images
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        'Cache-Control': 'public, max-age=3600, immutable',
      },
      fonts: [
        {
          name: 'Satoshi',
          data: Satoshi,
        },
      ],
    },
  )
}
