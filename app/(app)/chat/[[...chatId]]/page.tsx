"use client";

import { useState } from "react";
import type { ClientMessage } from "@/actions/chat/ai";
import { useActions, useUIState } from "ai/rsc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateId } from "ai";
import { Avatar } from "@/components/ui/avatar";
import Markdown from "react-markdown";

export default function ChatPanel() {
	const [input, setInput] = useState("");
	const [conversation, setConversation] = useUIState();
	const { converse: submitMessage } = useActions();

	const handleSubmission = async () => {
		setInput("");
		setConversation((currentConversation: any) => [
			...currentConversation,
			{
				id: generateId(),
				role: "user",
				display: input,
			},
		]);

		const response = await submitMessage(input);
		setConversation((currentConversation: any) => [
			...currentConversation,
			response,
		]);
	};

	return (
		<div className="flex flex-col h-full">
			<div className="flex flex-col overflow-y-scroll">
				<div className="flex flex-col w-full p-2 mb-8 gap-6">
					{conversation.map((message: ClientMessage) => {
						if (message.role === "user") {
							return (
								<div
									key={message.id}
									className="ml-auto w-full flex flex-col gap-y-1.5 items-end max-w-xl"
								>
									<Markdown className="rounded-t-lg rounded-bl-lg bg-zinc-50/80 dark:bg-zinc-950/80 px-4 py-2 prose dark:prose-invert prose-zinc">
										{message.display as string}
									</Markdown>
									<Avatar
										initials="A"
										className="bg-orange-400 text-zinc-950 size-6"
										square
									/>
								</div>
							);
						}

						return (
							<div
								key={message.id}
								className="mr-auto w-full flex flex-col gap-y-1.5 items-start max-w-xl" // max-w-4xl
							>
								<div className="min-h-10 rounded-t-lg rounded-br-lg bg-zinc-50/80 dark:bg-zinc-950/80 px-4 py-2">
									<div>{message.display}</div>
								</div>
								<Avatar
									initials="AI"
									className="bg-orange-400 text-zinc-950 size-6"
									square
								/>
							</div>
						);
					})}
				</div>
			</div>

			<div className="w-full max-w-6xl p-2 bg-zinc-50 dark:bg-zinc-950 rounded-t-xl fixed bottom-0">
				<div className="flex flex-row gap-2">
					<Input
						className="mt-auto"
						value={input}
						onChange={(event) => setInput(event.target.value)}
						placeholder="Ask a question"
						onKeyDown={(event) => {
							if (event.key === "Enter") {
								handleSubmission();
							}
						}}
					/>
					<Button onClick={handleSubmission}>Send</Button>
				</div>
			</div>
		</div>
	);
}
