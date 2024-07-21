"use server";

import { createClient } from "@/utils/supabase/server";
import { Unkey } from "@unkey/api";

export async function createApiKey(name = "API Key") {
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

	const ownerId = user.id;

	const key = await unkey.keys.create({
		apiId: process.env.UNKEY_API_ID!,
		ownerId: ownerId,
		prefix: "plam",
		byteLength: 32,
		enabled: true,
		name: name,
		meta: {
			enabled: true,
		}
	});

  if (key.error) {
    return {
      data: null,
      error: key.error.message,
    };
  }

	return {
		data: {
			key: key?.result?.key,
			keyId: key?.result?.keyId,
		},
		error: null,
	};
}
