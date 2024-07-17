"use server";

import { createClient } from "@/utils/supabase/server";
import { postYouTubeShort } from "@/actions/external-accounts/google/post-youtube-short";
import { getItemFromStorage } from "@/actions/media/get-item-from-storage";
import { decrypt } from "@/utils/security/token";
import { postFacebookReel } from "../facebook/post-facebook-reel";
import { getFacebookPages } from "../facebook/get-facebook-pages";

type Platform = "youtube" | "instagram" | "tiktok" | "facebook";

export interface YouTubeShortVideoMetadata {
	title?: string;
	description?: string;
}

export interface InstagramShortVideoMetadata {
	title?: string;
	description?: string;
}

export interface FacebookShortVideoMetadata {
	title?: string;
	description?: string;
}
export interface ShortVideoMetadata {
	// General metadata
	title?: string;
	description?: string;
	// Platform-specific overrides
	youtube?: YouTubeShortVideoMetadata;
	instagram?: InstagramShortVideoMetadata;
	facebook?: FacebookShortVideoMetadata;
}

/**
 * This function posts a short video to the selected social media platforms.
 *
 * @param video - The video to post located inside of the user's storage.
 * @param platforms - The platforms to post the video to.
 *
 * @returns Any errors and the data of the post.
 */
export async function postShortVideo({ // NOSONAR
	video,
	metadata = {},
	platforms = [],
}: {
	readonly video: string;
	readonly metadata?: ShortVideoMetadata;
	readonly platforms: Platform[];
}) {
	if (platforms.length === 0) {
		return {
			error: "No platforms were selected.",
			data: null,
		};
	}

	let videoUrl = "";

	const { data } = await getItemFromStorage({ filename: video });

	if (data?.signedUrl) {
		videoUrl = data.signedUrl;
	}

	const supabase = createClient();

	const { data: accounts, error } = await supabase
		.from("external_accounts")
		.select("external_account_id, platform, access_token");

	if (error) {
		return {
			error: "An error occurred while fetching the external accounts.",
			data: null,
		};
	}

	const { data: facebookPages, error: getFacebookPagesError } =
		await getFacebookPages({
			accessToken:
				accounts.find((account) => account.platform === "facebook")
					?.access_token ?? "",
		});

	if (getFacebookPagesError) {
		return {
			error: "An error occurred while fetching the Facebook pages.",
			data: null,
		};
	}

	let postToYouTube = undefined;
	let postToInstagram = undefined;
	let postToFacebook = undefined;

	if (platforms.includes("facebook")) {
		postToFacebook = postFacebookReel({
			pageId: facebookPages?.data?.[0]?.id ?? "",
			pageToken: facebookPages?.data?.[0]?.access_token ?? "",
			accessToken:
				accounts.find((account) => account.platform === "facebook")
					?.access_token ?? "",
			videoUrl: videoUrl,
			title: metadata?.title ?? "My Short Video",
			description: metadata?.description ?? "Check out my short video!",
		});
	}

	if (platforms.includes("instagram")) {
		postToInstagram = async () => {
			console.log("Posting to Instagram...");
		};
	}
	if (platforms.includes("youtube")) {
		postToYouTube = postYouTubeShort({
			accessToken:
				(await decrypt(
					accounts.find((account) => account.platform === "google")
						?.access_token ?? "",
				)) ?? "",
			videoUrl: videoUrl,
			title: metadata?.title ?? "My Short Video",
			description: metadata?.description ?? "Check out my short video!",
		});
	}

	const postData = await Promise.all([
		postToYouTube,
		postToInstagram,
		postToFacebook,
	]);

	return {
		error: null,
		data: postData,
	};
}
