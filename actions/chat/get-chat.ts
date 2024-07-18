"use server";

import { createClient } from "@/utils/supabase/server";

export async function getChatFromDatabase({
	chatId,
}: { readonly chatId: string }) {
	const supabase = createClient();

	const { data, error } = await supabase
		.from("chats")
		.select("chat")
		.eq("chat_id", chatId)
		.maybeSingle();

	if (error) {
		return {
			error: true,
			data: {},
		};
	}

	return {
		error: false,
		data: data?.chat ?? {},
	};
}
