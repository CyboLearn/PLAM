"use server";

import { generateId } from "ai";
import { createAI, getAIState, getMutableAIState, streamUI } from "ai/rsc";
import { z } from "zod";
import type { ReactNode } from "react";
import { openai } from "@ai-sdk/openai";
import Markdown from "react-markdown";
import { StockPrice } from "@/components/chat/finance/StockPrice";

// UUID
import { v4 as uuid } from "uuid";
import { createClient } from "@/utils/supabase/server";

const tools = {
	showStockInformation: StockPrice,
} as any;

export interface ServerMessage {
	role: "user" | "assistant" | "function";
	content: string;
	tool_calls?: { name: string; content: string }[];
}

export interface ClientMessage {
	id: string;
	role: "user" | "assistant" | "function";
	display: ReactNode;
}

export async function converse(input: string): Promise<ClientMessage> {
	"use server";

	const aiState = getMutableAIState();

	aiState.update({
		...aiState.get(),
		history: [...aiState.get().history, { role: "user", content: input }],
	});

	const result = await streamUI({
		model: openai("gpt-3.5-turbo"),
		messages: [
			...aiState.get().history.map((message: any) => ({
				role: message.role,
				content: message.content,
			})),
		],
		text: ({ content, done }) => {
			if (done) {
				aiState.done({
					...aiState.get(),
					history: [
						...aiState.get().history,
						{
							role: "assistant",
							content,
						},
					],
				});
			}

			return (
				<Markdown className="prose dark:prose-invert prose-zinc">
					{content}
				</Markdown>
			); // use it here
		},
		tools: {
			showStockInformation: {
				description:
					"Get stock information for symbol for the last numOfMonths months",
				parameters: z.object({
					symbol: z
						.string()
						.describe("The stock symbol to get information for"),
					numOfMonths: z
						.number()
						.describe("The number of months to get historical information for"),
				}),
				generate: async ({ symbol, numOfMonths }) => {
					const toolProps = { symbol, numOfMonths };

					aiState.done({
						...aiState.get(),
						history: [
							...aiState.get().history,
							{
								role: "assistant",
								tool_calls: [
									{
										name: "showStockInformation",
										content: JSON.stringify(toolProps),
									},
								],
								content: JSON.stringify(toolProps),
							},
						],
					});

					return <StockPrice {...toolProps} />;
				},
			},
		},
	});

	return {
		id: generateId(),
		role: "assistant",
		display: result.value,
	};
}

export type AIState = {
	chatId: string;
	history: ServerMessage[];
};

export const AIProvider = createAI<AIState, ClientMessage[]>({
	actions: {
		converse,
	},
	initialUIState: [],
	initialAIState: { chatId: uuid(), history: [] },
	onSetAIState: async ({ state }) => {
		"use server";

		const supabase = createClient();

		const {
			data: { user },
			error,
		} = await supabase.auth.getUser();

		if (error) {
			throw new Error("Failed to authenticate");
		}

		const { chatId, history } = state;

		console.warn("AI State set called", chatId);

		await supabase
			.from("chats")
			.upsert({ chat_id: chatId, chat: history, user_id: user?.id });
	},
	onGetUIState: async () => {
		"use server";

		const { history } = getAIState();

		return history.map((state: ServerMessage) => {
			const { role, content, tool_calls = null } = state;

			const hasToolCalls = tool_calls !== null;

			if (hasToolCalls) {
				const toolName = tool_calls[0].name;
				const toolProps = JSON.parse(tool_calls[0].content);

				const ToolComponent = tools?.[toolName];

				if (!ToolComponent) {
					return {
						id: generateId(),
						role,
						display: content,
					};
				}

				return {
					id: generateId(),
					role,
					display: <ToolComponent {...toolProps} />,
				};
			}

			return {
				id: generateId(),
				role,
				display: content,
			};
		});
	},
});
