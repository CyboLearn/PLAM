import { createClient } from "@/utils/supabase/server";
import type { UserIdentity } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	const supabase = createClient();

	const { platform } = await req.json();

	if (!platform) {
		return NextResponse.json(
			{
				error: "Platform is required",
			},
			{
				status: 400,
			},
		);
	}

	const { error } = await supabase
		.from("external_accounts")
		.delete()
		.eq("platform", platform);

	if (error) {
		return NextResponse.json(
			{
				error: error.message,
			},
			{
				status: 400,
			},
		);
	}

	const { data: identityList, error: errorIdentities } =
		await supabase.auth.getUserIdentities();

	if (errorIdentities) {
		return NextResponse.json(
			{
				error: errorIdentities.message,
			},
			{
				status: 400,
			},
		);
	}

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
			return NextResponse.json(
				{
					message: unlinkError.message,
				},
				{
					status: 400,
				},
			);
		}
	}

	return NextResponse.json(
		{
			message: "Successfully disconnected",
		},
		{
			status: 200,
		},
	);
}
