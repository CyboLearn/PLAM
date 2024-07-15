"use server";

import { encrypt } from "@/utils/security/token";
import { createClient } from "@/utils/supabase/server";
import { createClient as createSupaClient } from "@/utils/supabase/supa";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const { searchParams, origin } = new URL(request.url);

	const code = searchParams.get("code");
	const next = searchParams.get("next") ?? "/settings";

	if (code) {
		const supabase = createClient();
		const supa = createSupaClient();

		const {
			error,
			data: { session, user },
		} = await supabase.auth.exchangeCodeForSession(code);

		const providerToken = await encrypt(session?.provider_token) ?? null;
		const userId = session?.user?.id ?? null;		
		const externalAccountId = user?.identities?.find(
			(identity) => identity.provider === "facebook"
		)?.id ?? null;

		const { error: tokenError } = await supa.from("external_accounts").upsert(
			{
				user_id: userId,
				access_token: providerToken,
				platform: "facebook",
				external_account_id: externalAccountId,
			}
		);

		if (!error && !tokenError) {
			return NextResponse.redirect(`${origin}${next}`);
		}

		console.error(error, tokenError);
	}

	return NextResponse.redirect(`${origin}/sign-in`);
}
