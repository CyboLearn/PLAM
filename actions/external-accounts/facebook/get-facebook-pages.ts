"use server";

import { makeFacebookApiRequest } from "@/apis/facebook-api";
import { decrypt } from "@/utils/security/token";

export async function getFacebookPages({
	accessToken,
}: {
	readonly accessToken: string;
}) {
	const { data, error } = await makeFacebookApiRequest({
		endpoint: "me",
		resource: "accounts",
		accessToken: (await decrypt(accessToken)) ?? "",
		method: "GET",
	});

	if (error) {
		return {
			error: error,
			data: null,
		};
	}

	return {
		data,
		error: null,
	};
}
