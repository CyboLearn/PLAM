"use server";

import { createClient } from "@/utils/supabase/server";

/**
 * Get the conencted social media accounts of a user
 *
 * @returns {Promise<{data: any, error: any}>} The data and error
 */
export async function getSocialMediaAccounts(): Promise<{
	data: any[] | null;
	error: string | null;
}> {
	const supabase = createClient();

	const { data, error } = await supabase
		.from("external_accounts")
		.select("external_account_id,platform");

	if (error) {
		return {
			data: null,
			error: error.message,
		};
	}

	return {
		data,
		error: null,
	};
}
