import { createClient } from "@/utils/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	const authorization = req.headers.get("authorization") ?? undefined;

	if (!authorization) {
		return NextResponse.json(
			{
				error: "Unauthorized",
			},
			{
				status: 401,
			},
		);
	}

	const supabase = createClient(authorization);

	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();

	return NextResponse.json(
		{
			message: "Hello!",
			data: {
				user,
				error,
			},
		},
		{
			status: 200,
		},
	);
}
