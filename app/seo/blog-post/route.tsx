/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

/**
 * @name Oscar Stories Blog Post Template
 * @description A template for a blog post with a screenshot of the Oscar Stories website
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const title = searchParams.get('title') || 'Oscar Stories'
  const image = searchParams.get('image') || 'https://ogimage.org/ogimage.png'

  const Satoshi = await fetch(
    new URL('@/fonts/Satoshi-Black.ttf', import.meta.url),
  ).then((res) => res.arrayBuffer())

  return new ImageResponse(
    (
      <div tw="flex w-full h-full bg-[#261e36]">
        <div tw="flex flex-col justify-end pl-16 pr-4 pb-16">
          <div tw="text-[32px] text-white max-w-[500px] mb-12">{title}</div>
          <div tw="flex items-center">
            <img
              src="https://oscarstories.com/static/220f4a0566d4dfec699c4cc300434165/ad8ac/oscar.png"
              alt=""
              tw="w-24 h-24 mr-4"
            />
            <div tw="text-[42px] font-black text-white">
              Afinity
            </div>
          </div>
        </div>
        <img
          tw="rounded-t-2xl shadow-2xl"
          src={image}
          alt=""
          width="630"
          height="630"
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        // 'Cache-Control': 'public, max-age=3600, immutable',
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
