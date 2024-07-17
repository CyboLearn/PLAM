import { generatePageMeta } from "@/app/seo/generate";
import { AIProvider, type ServerMessage } from "@/actions/chat/ai";
import { createClient } from "@/utils/supabase/server";
import { ChatError } from "@/components/chat/ChatError";
import { getChatId } from "@/actions/chat/get-chat-id";

export const metadata = generatePageMeta({
	title: "Chat",
	url: "/chat",
});

export default async function SavedChatPage({
	params: { chatId = null },
	children,
}: {
	readonly params: {
		readonly chatId: string[] | null;
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
