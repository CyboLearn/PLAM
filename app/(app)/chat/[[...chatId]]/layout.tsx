import { generatePageMeta } from "@/app/seo/generate";
import { AIProvider, type ServerMessage } from "@/actions/chat/ai";

export const metadata = generatePageMeta({
	title: "Chat",
	url: "/chat",
});

export default function SavedChatPage({
	params: { chatId = null },
	children,
}: {
	readonly params: { readonly chatId: string | null };
	readonly children: React.ReactNode;
}) {
	const history: ServerMessage[] = [
		{
			role: "assistant",
			content: "Hi, I am PLAM! How can I help you today?",
		}
	];

	if (chatId) {
		console.warn("Chat ID:", chatId);
	}

	return (
		<main>
			<AIProvider initialAIState={history} initialUIState={[]} key={chatId}>
				{children}
			</AIProvider>
		</main>
	);
}
