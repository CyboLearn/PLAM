import { generatePageMeta } from "@/app/seo/generate";
import { Button } from "@/components/ui/button";

import NoiseImage from "@/images/noise.png";

export const metadata = generatePageMeta({
	url: "/",
	title: "Anything. Anytime. Anywhere. PLAM.",
	description:
		"A Personal Large Action Model built to assist you with everything.",
});

export default function Homepage() {
	return (
		<main className="relative isolate overflow-hidden bg-zinc-950 min-h-screen px-8 lg:px-32">
			<div
				className="absolute inset-0 z-10 opacity-10 pointer-events-none"
				style={{
					backgroundImage: `url("${NoiseImage.src}")`,
				}}
			/>
			<svg
				aria-hidden="true"
				className="absolute inset-0 z-10 h-full w-full stroke-white/10 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)] pointer-events-none"
			>
				<defs>
					<pattern
						x="50%"
						y={-1}
						id="983e3e4c-de6d-4c3f-8d64-b9761d1534cc"
						width={200}
						height={200}
						patternUnits="userSpaceOnUse"
					>
						<path d="M.5 200V.5H200" fill="none" />
					</pattern>
				</defs>
				<svg x="50%" y={-1} className="overflow-visible fill-gray-800/20">
					<title>nothing</title>
					<path
						d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
						strokeWidth={0}
					/>
				</svg>
				<rect
					fill="url(#983e3e4c-de6d-4c3f-8d64-b9761d1534cc)"
					width="100%"
					height="100%"
					strokeWidth={0}
				/>
			</svg>
			<div
				aria-hidden="true"
				className="absolute top-10 z-10 transform-gpu blur-3xl pointer-events-none"
			>
				<div
					style={{
						clipPath:
							"polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)",
					}}
					className="aspect-[1108/632] w-[69.25rem] bg-gradient-to-r from-[#80caff] to-[#4f46e5]/25 opacity-20 filter-blur-3xl"
				/>
			</div>
			<section className="z-20 flex flex-col lg:flex-row gap-x-4 lg:items-center lg:justify-between py-48">
				<div>
					<h1 className="text-7xl font-bold tracking-tighter text-white leading-[1.1]">
						Anything.
						<br />
						Anytime.
						<br />
						Anywhere.
						<br />
						PLAM.
					</h1>
					<p className="text-zinc-50 mt-3 text-xl font-thin">
						A Personal Large Action Model built to assist you with everything.
					</p>
					<div className="flex flex-row gap-x-4 mt-5">
						<Button color="white" href="/sign-in">
							Automate now
						</Button>
						<Button href="/about" color="dark/zinc">
							Learn more &rarr;
						</Button>
					</div>
				</div>
				<div />
			</section>
		</main>
	);
}
