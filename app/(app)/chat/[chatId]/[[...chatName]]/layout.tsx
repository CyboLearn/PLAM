import { generatePageMeta } from "@/app/seo/generate";
import { AIProvider, type ServerMessage } from "@/actions/chat/ai";
import { createClient } from "@/utils/supabase/server";
import { ChatError } from "@/components/chat/ChatError";
import { getChatId } from "@/actions/chat/get-chat-id";
import { redirect } from "next/navigation";

export const metadata = generatePageMeta({
	title: "Chat",
	url: "/chat",
});

export default async function SavedChatPage({ // NOSONAR
	params: { chatId = null, chatName = null },
	children,
}: {
	readonly params: {
		readonly chatId: string[] | null;
		readonly chatName: string[] | null;
	};
	readonly children: React.ReactNode;
}) {
	const supabase = createClient();

	let id = chatId?.toString() ?? null;
	let chatTitle = "New Chat";
	let privacy = "Private" as "Private" | "Public";

	if (id === null) {
		const { chatId: newChatId, error } = await getChatId();

		if (error || !newChatId) {
			return <ChatError />;
		}

		id = newChatId;
	}

	if (!chatId && id) {
		return redirect(`/chat/${id}`);
	}

	let history: ServerMessage[] = [
		{
			role: "assistant",
			content:
				"Hey! I’m PLAM your Personal Large Action Model! I can do anything you want me to!",
		},
	];

	if (chatId) {
		const { data, error } = await supabase
			.from("chats")
			.select("chat, chat_title, privacy")
			.eq("chat_id", id)
			.single();

		if (error) {
			return <ChatError />;
		}

		if (data) {
			history = data?.chat ?? [];
			chatTitle = data?.chat_title ?? "New Chat";
			privacy = data?.privacy ?? "Private";
		}

		if (!chatName || chatName.join("") !== chatTitle.toLowerCase().split(" ").join("-")) {
			return redirect(`/chat/${id}/${chatTitle.toLowerCase().split(" ").join("-")}`);
		}
	}

	return (
		<main>
			<AIProvider
				initialAIState={{
					history: history,
					chatId: id,
					privacy: privacy,
					chatTitle: chatTitle,
				}}
				initialUIState={[]}
			>
				{children}
			</AIProvider>
		</main>
	);
}
