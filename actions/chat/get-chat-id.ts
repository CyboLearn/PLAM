"use server";

import { createClient } from "@/utils/supabase/server";
// Supabase
import { createClient as createServerClient } from "@/utils/supabase/supa";

// UUID
import { v4 as uuid } from "uuid";

export async function getChatId() {
	const supa = createServerClient();
	const supabase = createClient();

	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();

	if (userError) {
		return {
			chatId: null,
			error: userError.message,
		};
	}

	if (!user) {
		return {
			chatId: null,
			error: "User not found",
		};
	}

	let chatId = uuid();

	while (true) {
		const { data, error } = await supa
			.from("chats")
			.select("chat_id")
			.eq("chat_id", chatId)
			.maybeSingle();

		if (error) {
			throw new Error("Failed to get chat id");
		}

		if (data) {
			chatId = uuid();
		} else {
			/**const { error } = await supabase
				.from("chats")
				.insert([{ chat_id: chatId, user_id: user.id }]);

      if (error) {
        return {
          chatId: null,
          error: error.message
        }
      }*/

			break;
		}
	}

	return {
		chatId: chatId,
		error: null,
	};
}
