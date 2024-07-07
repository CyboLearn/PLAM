"use server";

import { createClient } from "@/utils/supabase/server";

export async function sendMagicEmail(email: string) {
	const supabase = createClient();

	const { error } = await supabase.auth.signInWithOtp({
		email: email,
		options: {
			emailRedirectTo:
				process.env.NODE_ENV === "production"
					? "https://plam.app/"
					: "http://localhost:2800/",
		},
	});

	return {
		error: !!error,
		message: error?.message,
	};
}
