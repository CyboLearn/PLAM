// Types
import type { Metadata } from "next";
import type { OpenGraph } from "next/dist/lib/metadata/types/opengraph-types";
import type { Twitter } from "next/dist/lib/metadata/types/twitter-types";

// Media

// Constants
const url = new URL(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL!}`);

const site = {
	title: "PLAM",
	description: "",
	url: url ?? new URL("https://plam.app"),
	name: "Personal Large Action Model",
};

type OGImageType = "emoji" | "button" | "headline";

export const rootOpenGraph: OpenGraph = {
	locale: "en",
	type: "website",
	url: site.url.href,
	siteName: site.name,
	title: {
		default: site.title,
		template: "%s - ",
	},
	description: site.description,
};

export const rootTwitter: Twitter = {
	title: {
		default: site.title,
		template: "%s - PLAM",
	},
	description: site.description,
	card: "summary_large_image",
	creator: "@plamapp",
	site: "@plamapp",
};

export const rootMetadata: Metadata = {
	metadataBase: site.url,
	title: {
		default: site.title,
		template: "%s - PLAM",
	},
	description: site.description,
	applicationName: site.name,
	openGraph: rootOpenGraph,
	twitter: rootTwitter,
};

/**
 * @example
 *
 * Minimal usage
 * ```tsx
 *  const metadata = generatePageMeta({
 *     title: 'About',
 *     description: 'Learn more about us',
 *     url: '/about',
 *  })
 * ```
 *
 * Blog post page usage
 * ```tsx
 * export async function generateMetadata({ params }) {
 *  const post = await getPost(params.slug)
 *  if (!post) return
 *
 *  return generatePageMeta({
 *    title: post.title,
 *    description: post.description,
 *    url: `/blog/${post.slug}`,
 *    publishedAt: post.createdAt,
 *    updatedAt: post.updatedAt,
 *  })
 * }
 * ```
 */
export function generatePageMeta({
	title = site.title,
	description = site.description,
	url,
	image,
	publishedAt,
	updatedAt,
	siteName = site.name,
	type = "headline",
	screenshotData = "",
}: {
	title?: string;
	description?: string;
	url?: string;
	image?: string;
	publishedAt?: string;
	updatedAt?: string;
	author?: string;
	siteName?: string;
	type?: OGImageType;
	screenshotData?: string;
} = {}): Metadata {
	const metadata = {
		...rootMetadata,
		title: `${title} - PLAM`,
		description,
		alternates: {
			canonical: url,
		},
		icons: [],
		openGraph: {
			...rootOpenGraph,
			url,
			title: `${title} - ${siteName ?? rootOpenGraph.siteName}`,
			description,
		} as OpenGraph,
		twitter: {
			...rootTwitter,
			title: `${title} - ${siteName ?? rootOpenGraph.siteName}`,
			description,
		} as Twitter,
	} as Metadata;

	if (publishedAt) {
		metadata.openGraph = {
			...metadata.openGraph,
			type: "article",
			publishedTime: publishedAt,
			modifiedTime: updatedAt ?? publishedAt,
			authors: [siteName],
			section: siteName,
			tags: [siteName],
		};
	}

	const screenshot = {
		// add any screenshot data here
		url: `${metadata.metadataBase}seo/${type}${screenshotData}`,
		width: 1200,
		height: 630,
		alt: title,
		type: "image/png",
	};

	metadata.openGraph!.images = image ? [image] : [screenshot];
	metadata.twitter!.images = image ? [image] : [screenshot];

	if (siteName) {
		metadata.applicationName = siteName;
		metadata.openGraph!.siteName = siteName;
	}

	return metadata;
}
