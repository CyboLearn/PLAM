"use server";

import { createClient } from "@/utils/supabase/server";
import type { UserIdentity } from "@supabase/supabase-js";

export async function linkAccount({ // NOSONAR
	platform,
}: {
	readonly platform: "facebook" | "google";
}) {
	const supabase = createClient();
	const { data: identityList, error: errorIdentities } =
		await supabase.auth.getUserIdentities();

	if (errorIdentities) {
		return {
			error: errorIdentities.message,
			redirectUrl: null,
		};
	}

	if (platform === "facebook") {
		const { identities = [] } = identityList;

		if (identities?.find((identity) => identity.provider === platform)) {
			const identity = identities.find(
				(identity) => identity.provider === platform,
			);

			const { error: unlinkError } = await supabase.auth.unlinkIdentity({
				provider: platform,
				user_id: identity?.user_id,
				identity_id: identity?.identity_id,
			} as UserIdentity);

			if (unlinkError) {
				return {
					error: unlinkError.message,
					redirectUrl: null,
				};
			}
		}

		const { data, error } = await supabase.auth.linkIdentity({
			provider: platform,
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
	}

	if (platform === "google") {
		const { data, error } = await supabase.auth.linkIdentity({
			provider: "google",
			options: {
				redirectTo: `${process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://plam.app"}/api/callback/google`,
				scopes: "https://www.googleapis.com/auth/youtube.upload",
				queryParams: {
					access_type: 'offline',
					prompt: 'consent',
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
	}

	return {
		error: "Invalid platform",
		redirectUrl: null,
	};
}