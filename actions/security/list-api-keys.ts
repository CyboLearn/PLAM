"use server";

import { createClient } from "@/utils/supabase/server";
import { Unkey } from "@unkey/api";

export async function listApiKeys() {
	const supabase = createClient();

	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();

	if (error) {
		return {
			data: null,
			error: error.message,
		};
	}

	if (!user) {
		return {
			data: null,
			error: "User not found",
		};
	}

	const unkey = new Unkey({ rootKey: process.env.UNKEY_ROOT_KEY! });

	const listKeys = await unkey.apis.listKeys({
		apiId: process.env.UNKEY_API_ID!,
		ownerId: user.id,
	});

	if (listKeys.error) {
		return {
			data: null,
			error: listKeys.error.message,
		};
	}

	return {
		data: {
			keys: listKeys?.result?.keys,
			total: listKeys?.result?.total,
		},
		error: null,
	};
}
