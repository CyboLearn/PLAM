"use server";

import { StoreToken } from "@/utils/security/storeToken";
import { encrypt } from "@/utils/security/token";
import { createClient } from "@/utils/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const { searchParams, origin } = new URL(request.url);

	const code = searchParams.get("code");
	const next = searchParams.get("next") ?? "/settings";

	if (code) {
		const supabase = createClient();

		const {
			error,
			data: { user },
		} = await supabase.auth.getUser();

		const twitter_app_secret = Buffer.from(
			`${process.env.TWITTER_CLIENT_ID!}:${process.env.TWITTER_CLIENT_SECRET!}`,
		).toString("base64");

		const response = await fetch("https://api.twitter.com/2/oauth2/token", {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				Authorization: `Basic ${twitter_app_secret}`,
			},
			method: "POST",
			body: new URLSearchParams({
				code: code,
				grant_type: "authorization_code",
				client_id: process.env.TWITTER_CLIENT_ID as string,
				redirect_uri: `${process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://plam.app"}/api/callback/twitter`,
				code_verifier: "challenge",
			}),
		});

		const data = await response.json();

		if (!response.ok) {
			return NextResponse.json(
				{
					error: "Failed to get token",
					data,
				},
				{
					status: response.status,
				},
			);
		}

		const { access_token, refresh_token, expires_in } = data;

		const expiresIn = expires_in;
		const userId = user?.id;
		const providerToken = await encrypt(access_token);
		const providerRefreshToken = await encrypt(refresh_token);
		const externalAccountId = await getTwitterUserId(access_token);

		if (
			!expiresIn ||
			!userId ||
			!providerToken ||
			!externalAccountId ||
			!providerRefreshToken
		) {
			return NextResponse.redirect(`${origin}/sign-in`);
		}

		const { error: tokenError } = await StoreToken({
			userId,
			providerToken,
			expiresIn: expiresIn,
			externalAccountId,
			platform: "twitter",
			providerRefreshToken,
		});

		if (!error && !tokenError) {
			return NextResponse.redirect(`${origin}${next}`);
		}

		console.error(error, tokenError);
	}

	return NextResponse.redirect(`${origin}/sign-in`);
}

async function getTwitterUserId(access_token: string) {
	const response = await fetch("https://api.twitter.com/2/users/me", {
		headers: {
			Authorization: `Bearer ${access_token}`,
			"Content-Type": "application/json",
		},
	});

	const data = await response.json();

	if (!response.ok) {
		console.error(data);
		return "";
	}

	const { id: userId } = data.data;

	return userId;
}