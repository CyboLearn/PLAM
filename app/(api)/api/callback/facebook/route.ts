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
			data: { session, user },
		} = await supabase.auth.exchangeCodeForSession(code);

		const expiresIn = session?.expires_in ?? 0;
		const providerToken = (await encrypt(session?.provider_token)) ?? null;
		const providerRefreshToken =
			(await encrypt(session?.provider_refresh_token)) ?? null;
		const userId = session?.user?.id ?? null;
		const externalAccountId =
			user?.identities?.find((identity) => identity.provider === "facebook")
				?.id ?? null;

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
			expiresIn: expiresIn,
			externalAccountId,
			platform: "facebook",
			providerRefreshToken,
		});

		if (!error && !tokenError) {
			return NextResponse.redirect(`${origin}${next}`);
		}

		console.error(error, tokenError);
	}

	return NextResponse.redirect(`${origin}/sign-in`);
}
