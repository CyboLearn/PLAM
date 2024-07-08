import { getChatId } from "@/actions/chat/get-chat-id";
import { ChatError } from "@/components/chat/ChatError";
import { redirect } from "next/navigation";

export default async function ChatCreateAndRedirect() {
	const { chatId, error } = await getChatId();

	if (error || !chatId) {
		return <ChatError />;
	}

	return redirect(`/chat/${chatId}`);
}
