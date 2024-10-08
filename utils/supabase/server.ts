import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function createClient(authorization?: string) {
	const cookieStore = cookies();

	if (
		!process.env.NEXT_PUBLIC_SUPABASE_URL ||
		!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
	) {
		throw new Error("Missing Supabase env variables");
	}

	return createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
		{
			cookies: {
				getAll() {
					return cookieStore.getAll();
				},
				setAll(cookiesToSet) {
					for (const { name, value, options } of cookiesToSet) {
						cookieStore.set(name, value, options);
					}
				},
			},
			global: {
				headers: {
					...(authorization ? { Authorization: authorization } : {}),
				},
			},
		},
	);
}
