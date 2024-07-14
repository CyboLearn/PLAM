import { type NextRequest, NextResponse } from "next/server";

import { linkAccount } from "@/actions/social-media/link-account";

export async function POST(req: NextRequest) {
	const { platform } = await req.json();

	const { redirectUrl, error } = await linkAccount({
		platform: platform as  "facebook" | "google",
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
