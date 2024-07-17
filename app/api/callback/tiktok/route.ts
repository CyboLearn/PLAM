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

		const userId = user?.id;
		const providerToken = await encrypt("");
		const providerRefreshToken = await encrypt("");
		const externalAccountId = "";

		if (
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
			expiresIn: 86400,
			externalAccountId,
			platform: "tiktok",
			providerRefreshToken,
		});

		if (!error && !tokenError) {
			return NextResponse.redirect(`${origin}${next}`);
		}

		console.error(error, tokenError);
	}

	return NextResponse.redirect(`${origin}/sign-in`);
}
