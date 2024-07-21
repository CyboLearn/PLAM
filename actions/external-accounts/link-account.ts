"use server";

import { createClient } from "@/utils/supabase/server";

import { createHash } from "crypto";

export type SupportedPlatforms = "facebook" | "google" | "tiktok" | "twitter";

export async function linkAccount({
	platform,
}: {
	readonly platform: SupportedPlatforms;
}) {
	switch (platform) {
		case "facebook":
			return await linkFacebook();

		case "google":
			return await linkGoogle();

		case "tiktok":
			return await linkTikTok();

		case "twitter":
			return await linkTwitter();

		default:
			return {
				error: "Invalid platform",
				redirectUrl: null,
			};
	}
}

async function linkFacebook() {
	const supabase = createClient();

	try {
		const { data, error } = await supabase.auth.linkIdentity({
			provider: "facebook",
			options: {
				scopes: "public_profile,email",
				redirectTo: `${process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://plam.app"}/api/callback/facebook`,
				queryParams: {
					config_id: "998948238270967",
				},
			},
		});

		if (error) {
			return {
				error: error.message,
				redirectUrl: null,
			};
		}

		return {
			error: null,
			redirectUrl: data?.url,
		};
	} catch (error) {
		console.error(error);
		return {
			error: "An unexpected error occurred.",
			redirectUrl: null,
		};
	}
}

async function linkGoogle() {
	const supabase = createClient();

	try {
		const { data, error } = await supabase.auth.linkIdentity({
			provider: "google",
			options: {
				redirectTo: `${process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://plam.app"}/api/callback/google`,
				scopes: "https://www.googleapis.com/auth/youtube.upload",
				queryParams: {
					access_type: "offline",
					prompt: "consent",
				},
			},
		});

		if (error) {
			return {
				error: error.message,
				redirectUrl: null,
			};
		}

		return {
			error: null,
			redirectUrl: data?.url,
		};
	} catch (error) {
		console.error(error);
		return {
			error: "An unexpected error occurred.",
			redirectUrl: null,
		};
	}
}

async function linkTikTok() {
	try {
		// generate 16 hexa random string
		const csrf = Array.from({ length: 16 }, () =>
			Math.floor(Math.random() * 16).toString(16),
		).join("");

		// TODO: Implement this correctly
		// using S256, generate a code challenge
		const codeChallenge = createHash("sha256").update(csrf).digest("base64");

		const queryParams = {
			client_key: process.env.TIKTOK_CLIENT_ID!,
			response_type: "code",
			scope: "user.info.basic,video.create",
			redirect_uri: `${process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://plam.app"}/api/callback/tiktok`,
			state: csrf,
			code_challenge: codeChallenge,
			code_challenge_method: "S256",
		} as Record<string, string>;

		const url = new URL("https://www.tiktok.com/v2/auth/authorize/");

		for (const key of Object.keys(queryParams)) {
			url.searchParams.append(key, queryParams[key]);
		}

		return {
			error: null,
			redirectUrl: url.toString(),
		};
	} catch (error) {
		console.error(error);
		return {
			error: "An unexpected error occurred.",
			redirectUrl: null,
		};
	}
}

async function linkTwitter() {
	try {
		// generate 16 hexa random string
		const csrf = Array.from({ length: 16 }, () =>
			Math.floor(Math.random() * 16).toString(16),
		).join("");

		// TODO: Implement this correctly
		// using S256, generate a code challenge
		//const codeChallenge = createHash("sha256").update(csrf).digest("base64");

		const queryParams = {
			client_id: process.env.TWITTER_CLIENT_ID!,
			response_type: "code",
			scope: "tweet.read tweet.write offline.access users.read",
			redirect_uri: `${process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://plam.app"}/api/callback/twitter`,
			state: csrf,
			code_challenge: "challenge",
			code_challenge_method: "plain",
		} as Record<string, string>;

		const url = new URL("https://twitter.com/i/oauth2/authorize/");

		for (const key of Object.keys(queryParams)) {
			url.searchParams.append(key, queryParams[key]);
		}

		return {
			error: null,
			redirectUrl: url.toString(),
		};
	} catch (error) {
		console.error(error);
		return {
			error: "An unexpected error occurred.",
			redirectUrl: null,
		};
	}
}
