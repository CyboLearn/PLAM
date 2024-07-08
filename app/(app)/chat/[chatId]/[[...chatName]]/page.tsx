"use client";

import { useState, useRef } from "react";
import type { ClientMessage } from "@/actions/chat/ai";
import { useActions, useAIState, useUIState } from "ai/rsc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateId } from "ai";
import { Avatar } from "@/components/ui/avatar";
import Markdown from "react-markdown";
import { Heading } from "@/components/ui/heading";
import {
	PencilSquareIcon,
	PlusIcon,
	ShareIcon,
	TrashIcon,
} from "@heroicons/react/20/solid";
import {
	Dialog,
	DialogActions,
	DialogBody,
	DialogDescription,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Description,
	Field,
	FieldGroup,
	Fieldset,
	Label,
} from "@/components/ui/fieldset";
import { Radio, RadioField, RadioGroup } from "@/components/ui/radio";
import { Text } from "@/components/ui/text";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function ChatPanel() {
	const supabase = createClient();
	const router = useRouter();
	const [input, setInput] = useState("");
	const bottomOfChatRef = useRef<HTMLDivElement>(null);
	const topOfChatRef = useRef<HTMLDivElement>(null);
	const [conversation, setConversation] = useUIState();
	const { converse } = useActions();
	const aiState = useAIState();
	const chatContainerRef = useRef<HTMLDivElement>(null);
	const [chatId] = useState(aiState[0].chatId);
	const [chatTitle, setChatTitle] = useState(aiState[0].chatTitle);
	const [newChatTitle, setNewChatTitle] = useState(aiState[0].chatTitle);
	const [privacy, setPrivacy] = useState<"Private" | "Public">(
		aiState[0].privacy,
	);

	const [changeTitleDialog, setChangeTitleDialog] = useState(false);
	const [changePrivacyDialog, setChangePrivacyDialog] = useState(false);
	const [deleteChatDialog, setDeleteChatDialog] = useState(false);

	const changeChatTitle = async (title: string) => {
		setChatTitle(title);
		await converse("", {
			chatTitle: title,
		});
		router.push(`/chat/${chatId}/${title.toLowerCase().split(" ").join("-")}`); // redirect to new chat URL
	};

	const changePrivacy = async (privacy: "Private" | "Public") => {
		setPrivacy(privacy);
		await converse("", {
			privacy: privacy,
		});
	};

	const deleteChat = async () => {
		router.prefetch("/dashboard");
		await supabase.from("chats").delete().eq("chat_id", chatId);
		router.push("/dashboard");
	};

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

		const response = await converse(input);
		setConversation((currentConversation: any) => [
			...currentConversation,
			response,
		]);
	};

	const scrollToBottom = () => {
		bottomOfChatRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	return (
		<>
			<Dialog open={changeTitleDialog} onClose={setChangeTitleDialog}>
				<DialogTitle>Rename Chat</DialogTitle>
				<DialogDescription>Change the title of this chat.</DialogDescription>
				<DialogBody>
					<Field>
						<Label>New Chat Title</Label>
						<Input
							name="title"
							placeholder={chatTitle}
							defaultValue={chatTitle}
							value={newChatTitle}
							onChange={(e) => setNewChatTitle(e.target.value)}
						/>
					</Field>
				</DialogBody>
				<DialogActions>
					<Button plain onClick={() => setChangeTitleDialog(false)}>
						Cancel
					</Button>
					<Button
						color="orange"
						onClick={() => {
							changeChatTitle(newChatTitle);
							setChangeTitleDialog(false);
						}}
					>
						Rename
					</Button>
				</DialogActions>
			</Dialog>
			<Dialog open={changePrivacyDialog} onClose={setChangePrivacyDialog}>
				<DialogTitle>Share Chat</DialogTitle>
				<DialogDescription>
					Share this chat with others or keep it private.
				</DialogDescription>
				<DialogBody>
					<FieldGroup>
						<Fieldset>
							<Label>Privacy</Label>
							<Text>Decide who can view this chat.</Text>
							<RadioGroup
								name="privacy"
								defaultValue={privacy}
								value={privacy}
								onChange={setPrivacy as any}
							>
								<RadioField>
									<Radio value="Private" color="orange" />
									<Label>Keep chat private</Label>
									<Description>Only you can view this chat.</Description>
								</RadioField>
								<RadioField>
									<Radio value="Public" color="orange" />
									<Label>Make chat public</Label>
									<Description>
										Anyone with the link can view this chat.
									</Description>
								</RadioField>
							</RadioGroup>
						</Fieldset>
						<Field>
							<Label>
								Share this link with others so they can view this chat.
							</Label>
							<Input
								name="link"
								value={`https://example.com/chat/${aiState[0].chatId}`}
								readOnly
								disabled
							/>
						</Field>
					</FieldGroup>
				</DialogBody>
				<DialogActions>
					<Button plain onClick={() => setChangePrivacyDialog(false)}>
						Cancel
					</Button>
					<Button
						color="orange"
						onClick={() => {
							changePrivacy(privacy);
							setChangePrivacyDialog(false);
						}}
					>
						Save Changes
					</Button>
				</DialogActions>
			</Dialog>
			<Dialog open={deleteChatDialog} onClose={setDeleteChatDialog}>
				<DialogTitle>Delete Chat</DialogTitle>
				<DialogDescription>
					Permanentaly delete this chat. This action cannot be undone.
				</DialogDescription>
				<DialogActions>
					<Button plain onClick={() => setDeleteChatDialog(false)}>
						Cancel
					</Button>
					<Button
						color="red"
						onClick={() => {
							deleteChat();
							setDeleteChatDialog(false);
						}}
					>
						I want to delete this chat
					</Button>
				</DialogActions>
			</Dialog>
			<div className="flex flex-col h-full">
				<div className="w-full max-w-6xl p-2 bg-zinc-50 dark:bg-zinc-950 rounded-b-xl fixed top-0 flex flex-row justify-between gap-x-2 px-3">
					<div className="flex flex-row justify-center items-center gap-2">
						<Button
							plain
							onClick={() => {
								setChangeTitleDialog(true);
							}}
						>
							<Heading>{chatTitle}</Heading>
							<PencilSquareIcon className="!size-5" />
						</Button>
					</div>
					<div className="flex flex-row justify-center items-center gap-2">
						<Button outline href="/chat">
							New Chat
							<PlusIcon />
						</Button>
						<Button
							onClick={() => {
								setChangePrivacyDialog(true);
							}}
							outline
						>
							Share
							<ShareIcon />
						</Button>
						<Button
							outline
							onClick={() => {
								setDeleteChatDialog(true);
							}}
						>
							Delete
							<TrashIcon />
						</Button>
					</div>
				</div>

				<div className="flex flex-col overflow-y-scroll">
					<div
						className="flex flex-col w-full p-2 gap-6 min-h-full"
						ref={chatContainerRef}
					>
						<div ref={topOfChatRef} className="mb-4" />
						{conversation.map((message: ClientMessage) => {
							scrollToBottom();

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
									className="mr-auto w-full flex flex-col gap-y-1.5 items-start max-w-xl"
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
						<div ref={bottomOfChatRef} className="mt-4" />
					</div>
				</div>

				<div className="w-full max-w-6xl p-2 bg-zinc-50 dark:bg-zinc-950 rounded-t-xl fixed bottom-0">
					<div className="flex flex-row gap-2">
						<Input
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
		</>
	);
}
