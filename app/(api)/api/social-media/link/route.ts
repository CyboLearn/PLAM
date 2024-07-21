import { type NextRequest, NextResponse } from "next/server";

import {
	linkAccount,
	type SupportedPlatforms,
} from "@/actions/external-accounts/link-account";

export async function POST(req: NextRequest) {
	const { platform } = await req.json();

	const { redirectUrl, error } = await linkAccount({
		platform: platform as SupportedPlatforms,
	});

	return NextResponse.json(
		{
			error: error ?? null,
			redirectUrl: redirectUrl ?? null,
		},
		{
			status: redirectUrl ? 200 : 400,
		},
	);
}
