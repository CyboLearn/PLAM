"use server";

import { Unkey } from "@unkey/api";

async function getKeyIdFromKey(key: string) {
	const unkey = new Unkey({ rootKey: process.env.UNKEY_ROOT_KEY! });

	const keyId = await unkey.keys.verify({
		key: key,
		apiId: process.env.UNKEY_API_ID!,
	});

	return keyId.result?.keyId;
}

export async function deleteApiKey({
	key,
	keyId,
}: {
	readonly key?: string;
	readonly keyId?: string;
}) {
	// either key or keyId must be provided
	if (!key && !keyId) {
		return {
			data: null,
			error: "Either key or keyId must be provided",
		};
	}

	if (key) {
		keyId = await getKeyIdFromKey(key);
	}

	const unkey = new Unkey({ rootKey: process.env.UNKEY_ROOT_KEY! });

	if (!keyId) {
		return {
			data: null,
			error: "Key not found",
		};
	}

	const result = await unkey.keys.delete({
		keyId: keyId,
	});

	if (result.error) {
		return {
			data: null,
			error: result.error.message,
		};
	}

	return {
		data: result?.result,
		error: null,
	};
}

export async function toggleApiKey({
	keyId,
	enabled,
}: {
	readonly keyId: string;
	readonly enabled?: boolean;
}) {
	if (!keyId) {
		return {
			data: null,
			error: "keyId must be provided",
		};
	}

	const unkey = new Unkey({ rootKey: process.env.UNKEY_ROOT_KEY! });

	if (enabled === undefined) {
		const key = await unkey.keys.get({ keyId: keyId });

		if (key.error) {
			return {
				data: null,
				error: key.error.message,
			};
		}

		enabled = !key.result?.enabled;
	}

	const result = await unkey.keys.update({
		keyId: keyId,
		enabled: enabled,
		meta: {
			enabled: enabled.toString(),
		},
	});

	if (result.error) {
		return {
			data: null,
			error: result.error.message,
		};
	}

	return {
		data: result?.result,
		error: null,
	};
}
