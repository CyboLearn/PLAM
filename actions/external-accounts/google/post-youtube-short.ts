"use server";

import { makeGoogleApiRequest } from "@/apis/google-api";
import { getVideoDurationInSeconds } from "get-video-duration";

/**
 * This function posts a video eligible for YouTube Shorts to the user's YouTube account.
 *
 * @param accessToken - The user's Google access token.
 * @param videoUrl - The URL of the video to post.
 * @param title - The title of the video.
 * @param caption - The caption of the video.
 *
 */
export async function postYouTubeShort({
	accessToken,
	videoUrl,
	title,
	caption,
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
	readonly caption: string;
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

	// Check that the video is less than 60 seconds long.
  const duration = await getVideoDurationInSeconds(videoUrl);

  if (duration > 60) {
    return {
      error: "The video must be less than 60 seconds long.",
      data: null,
    };
  }

	// Check that the video's caption OR title contains the hashtag `#Shorts`.
	// If it doesn't, append it to the caption and not to the title.
	const hashtag = "#Shorts";
	if (!title.includes(hashtag) && !caption.includes(hashtag)) {
		caption += ` ${hashtag}`;
	}

	const { data: googleResponse, error: googleError } =
		await makeGoogleApiRequest({
			endpoint: "upload/youtube/v3",
			resource: "videos",
			accessToken,
			json: {
				snippet: {
					title,
					description: caption,
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
		data: await googleResponse.json(),
	};
}
