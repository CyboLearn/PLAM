import { type NextRequest, NextResponse } from "next/server";

export async function POST(_: NextRequest) {
	return NextResponse.json(
		{
			status: "Accepted",
		},
		{
			status: 200,
		},
	);
}
