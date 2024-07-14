import { createClient } from "@/utils/supabase/server";
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
		.from("social_accounts")
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

	return NextResponse.json(
		{
			message: "Successfully disconnected",
		},
		{
			status: 200,
		},
	);
}
