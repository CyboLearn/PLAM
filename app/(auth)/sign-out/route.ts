import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
	const supabase = createClient();

	await supabase.auth.signOut();

	return NextResponse.redirect("/");
}
