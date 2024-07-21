import { createClient } from "@/utils/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
	const supabase = createClient();

	const id = request.nextUrl.searchParams.get("id") ?? undefined;

	if (!id) {
		return NextResponse.json(
			{
				status: "ID not provided",
			},
			{
				status: 400,
			},
		);
	}

	const { tags } = await request.json();

	const { error } = await supabase
		.from("user_storage")
		.update({ tags })
		.eq("object_id", id);

	if (error) {
		console.error(error);
		return NextResponse.json(
			{
				status: "Failed",
			},
			{
				status: 400,
			},
		);
	}

	return NextResponse.json(
		{
			status: "Updated",
		},
		{
			status: 200,
		},
	);
}
