"use server";

import { createClient as createSupaClient } from "@/utils/supabase/supa";

export async function StoreToken({
	userId,
	platform,
	expiresIn,
	providerToken,
	externalAccountId,
	providerRefreshToken,
}: {
	readonly userId: string;
	readonly platform: string;
	readonly expiresIn: number;
	readonly providerToken: string;
	readonly externalAccountId: string;
	readonly providerRefreshToken: string;
}) {
	const supa = createSupaClient();

	const { error: tokenError } = await supa.from("external_accounts").upsert({
		user_id: userId,
		platform: platform,
		access_token: providerToken,
		refresh_token: providerRefreshToken,
		external_account_id: externalAccountId,
		expiry: new Date(Date.now() + expiresIn * 1000).toISOString(),
	});

	if (tokenError) {
		return {
			data: null,
			error: tokenError.message,
		};
	}

	return {
		data: "success",
		error: null,
	};
}