"use server";

export async function createPost() {
	return {
		post: null,
	};
}

/**
 * 
 * Reel Specifications:
 * 
 * Container: MOV or MP4 (MPEG-4 Part 14), no edit lists, moov atom at the front of the file.
 * Audio codec: AAC, 48khz sample rate maximum, 1 or 2 channels (mono or stereo).
 * Video codec: HEVC or H264, progressive scan, closed GOP, 4:2:0 chroma subsampling.
 * Frame rate: 23-60 FPS.
 * Picture size:
 * Maximum columns (horizontal pixels): 1920
 * Required aspect ratio is between 0.01:1 and 10:1 but we recommend 9:16 to avoid cropping or blank space.
 * Video bitrate: VBR, 25Mbps maximum
 * Audio bitrate: 128kbps
 * Duration: 15 mins maximum, 3 seconds minimum
 * File size: 1GB maximum
 * 
 */
export async function postToInstagramReels({
  instagramUserId,
  videoUrl,
  description,
  thumbnailOffset = 0,
  shareToFeed = true,
}: {
  readonly instagramUserId: string;
  readonly videoUrl: string;
  readonly description: string;
  readonly thumbnailOffset?: number;
  readonly shareToFeed?: boolean;
}) {
  // make a check to ensure the video is within the specifications

  // select access_token

	return {
		ig_ig: null,
	};
}

export async function postToFacebookVideos() {
	return {
		fb_id: null,
	};
}

export async function postToYouTubeShorts() {
	return {
		success: null,
	};
}
