"use server";

import { makeFacebookApiRequest } from "@/apis/facebook-api";
import { decrypt } from "@/utils/security/token";

/**
 * This function posts a video eligible for YouTube Shorts to the user's YouTube account.
 *
 * @param accessToken - The user's Google access token.
 * @param pageToken - The page token of the Facebook page to post to.
 * @param videoUrl - The URL of the video to post.
 * @param title - The title of the video.
 * @param description - The description of the video.
 *
 */
export async function postFacebookReel({
	pageId,
	pageToken,
	accessToken,
	videoUrl,
	title,
	description,
	tags = [],
}: {
	readonly pageId: string;
	readonly pageToken: string;
	readonly accessToken: string;
	readonly videoUrl: string;
	readonly title: string;
	readonly description: string;
	readonly tags?: string[];
}) {
	const { data: facebookStartUploadRequest, error: facebookStartUploadError } =
		await makeFacebookApiRequest({
			endpoint: pageId,
			resource: "video_reels",
			accessToken,
			json: {
				upload_phase: "start",
				access_token: pageToken,
			},
			method: "POST",
		});

	if (facebookStartUploadError) {
		console.error(facebookStartUploadError);
		return {
			error: facebookStartUploadError,
			data: null,
		};
	}

	console.log(facebookStartUploadRequest);

	const { video_id } = facebookStartUploadRequest;

	const { data: facebookUploadRequest, error: facebookUploadError } =
		await makeFacebookApiRequest({
			host: "rupload.facebook.com",
			endpoint: "video-upload",
			resource: video_id,
			headers: {
				Authorization: `OAuth ${(await decrypt(accessToken)) ?? ""}`,
				file_url: videoUrl,
			},
		});

	if (facebookUploadError) {
		console.error(facebookUploadError);
		return {
			error: facebookUploadError,
			data: null,
		};
	}

	console.log(facebookUploadRequest);

	let isReadyToPublish = false;
	let timer = 0;

	while (!isReadyToPublish) {
		const { data: videoStatus, error: videoStatusError } =
			await checkFacebookUploadStatus({
				videoId: video_id,
				accessToken: accessToken,
			});

		if (videoStatusError) {
			console.error(videoStatusError);
			return {
				error: videoStatusError,
				data: null,
			};
		}

		console.log(videoStatus);

		if (videoStatus?.status === "ready") {
			isReadyToPublish = true;
		}

		await new Promise((resolve) => setTimeout(resolve, 5000));
		timer += 5000;

		if (timer > 60000) {
			return {
				error: "Video upload timed out.",
				data: null,
			};
		}
	}

	const {
		data: facebookFinishUploadRequest,
		error: facebookFinishUploadError,
	} = await makeFacebookApiRequest({
		endpoint: pageId,
		resource: "video_reels",
		accessToken,
		query: {
			video_id: video_id,
			upload_phase: "finish",
			video_state: "PUBLISHED",
			access_token: pageToken,
			description: description,
		},
		method: "POST",
	});

	if (facebookFinishUploadError) {
		console.error(facebookFinishUploadError);
		return {
			error: facebookFinishUploadError,
			data: null,
		};
	}

	console.log(facebookFinishUploadRequest);

	return {
		error: null,
		data: "",
	};
}

export async function checkFacebookUploadStatus({
	videoId,
	accessToken,
}: {
	readonly videoId: string;
	readonly accessToken: string;
}) {
	const {
		data: facebookUploadStatusRequest,
		error: facebookUploadStatusError,
	} = await makeFacebookApiRequest({
		endpoint: videoId,
		query: {
			fields: "status",
			access_token: (await decrypt(accessToken)) ?? "",
		},
	});

	if (facebookUploadStatusError) {
		console.error(facebookUploadStatusError);
		return {
			error: facebookUploadStatusError,
			data: null,
		};
	}

	return {
		error: null,
		data: facebookUploadStatusRequest,
	};
}
