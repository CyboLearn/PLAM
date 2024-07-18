"use server";

import { createClient } from "@/utils/supabase/server";

export async function verifyMagicToken(email: string, otp: string) {
	const supabase = createClient();

	const { error } = await supabase.auth.verifyOtp({
		email: email,
		type: "email",
		token: otp,
	});

	return {
		error: !!error,
		message: error?.message,
	};
}
