/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";

export const runtime = "edge";

/**
 * @name Headline Template
 * @description Make it pop with a headline
 */
export async function GET() {
  const Satoshi = await fetch(
    new URL("@/fonts/Satoshi-Black.ttf", import.meta.url)
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div tw="flex flex-col items-center justify-center w-full h-full bg-zinc-50 text-zinc-900 p-4 text-[90px]">
        <div tw="bg-orange-400 rounded-2xl">Personal Large</div>
        <div tw="font-bold flex items-center underline">Action Model</div>
        <div tw="mt-4 text-[32px] text-zinc-700 text-center">
          Get things done, faster.
        </div>
        <div tw="mt-8 bg-orange-400 rounded-full px-20 py-8 text-[40px] text-black shadow-2xl border-[4px] border-orange-500 text-black/90">
          Get started now &rarr;
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control": "public, max-age=3600, immutable",
      },
      fonts: [
        {
          name: "Satoshi",
          data: Satoshi,
        },
      ],
    }
  );
}
