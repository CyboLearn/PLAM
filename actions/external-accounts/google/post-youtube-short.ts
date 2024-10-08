"use server";

import { makeGoogleApiRequest } from "@/apis/google-api";

/**
 * This function posts a video eligible for YouTube Shorts to the user's YouTube account.
 *
 * @param accessToken - The user's Google access token.
 * @param videoUrl - The URL of the video to post.
 * @param title - The title of the video.
 * @param description - The description of the video.
 *
 */
export async function postYouTubeShort({
	accessToken,
	videoUrl,
	title,
	description,
	privacyStatus = "private",
	madeForKids = false,
	license = "youtube",
	tags = [],
	categoryId = 24,
	defaultLanguage = "en",
	publishAt,
	publicStatsViewable = true,
}: {
	readonly accessToken: string;
	readonly videoUrl: string;
	readonly title: string;
	readonly description: string;
	readonly privacyStatus?: "private" | "public" | "unlisted";
	readonly madeForKids?: boolean;
	readonly license?: "youtube" | "creativeCommon";
	readonly tags?: string[];
	readonly categoryId?: number;
	readonly defaultLanguage?: string;
	readonly publishAt?: string;
	readonly publicStatsViewable?: boolean;
}) {
	const response = await fetch(videoUrl);

	// Check that the video's description OR title contains the hashtag `#Shorts`.
	// If it doesn't, append it to the description and not to the title.
	const hashtag = "#Shorts";
	if (!title.includes(hashtag) && !description.includes(hashtag)) {
		description += ` ${hashtag}`;
	}

	const { data: googleResponse, error: googleError } =
		await makeGoogleApiRequest({
			endpoint: "upload/youtube/v3",
			resource: "videos",
			accessToken,
			query: {
				part: "snippet,status",
				notifySubscribers: "False",
			},
			json: {
				snippet: {
					title,
					description: description,
					tags,
					categoryId,
					defaultLanguage,
				},
				status: {
					license,
					privacyStatus,
					madeForKids,
					publishAt,
					publicStatsViewable,
				},
			},
			method: "POST",
			file: new File([await response.blob()], "video.mp4"),
		});

	if (googleError) {
		return {
			error: googleError,
			data: null,
		};
	}

	return {
		error: null,
		data: googleResponse,
	};
}
