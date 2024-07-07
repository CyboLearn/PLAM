"use server";

import { createClient } from "@/utils/supabase/server";

export async function getActionHistory() {
	const supabase = createClient();

	const { data, error } = await supabase
		.from("chats")
		.select("chat_id, chat_title, created_at");

	if (error) {
		return {
			error: error.message,
			data: null,
		};
	}

	return {
		error: null,
		data,
	};
}
