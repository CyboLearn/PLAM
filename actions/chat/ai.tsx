"use server";

import { generateId } from "ai";
import { createAI, getAIState, getMutableAIState, streamUI } from "ai/rsc";
import { z } from "zod";
import type { ReactNode } from "react";
import { openai } from "@ai-sdk/openai";
import { StockDisplay } from "@/components/chat/finance/StockDisplay";
import { getStockPricing } from "@/actions/finance/get-stock-information";
import Markdown from "react-markdown";

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

	const history = getMutableAIState();

	const result = await streamUI({
		model: openai("gpt-3.5-turbo"),
		messages: [...history.get(), { role: "user", content: input }],
		text: ({ content, done }) => {
			if (done) {
				history.done((messages: ServerMessage[]) => [
					...messages,
					{ role: "user", content: input },
					{ role: "assistant", content },
				]);
			}

			return <Markdown className="prose dark:prose-invert prose-zinc">{content}</Markdown>; // use it here
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
					history.done((messages: ServerMessage[]) => [
						...messages,
						{
							role: "assistant",
							tool_calls: [
								{
									name: "showStockInformation",
									content: JSON.stringify({ symbol, numOfMonths }),
								},
							],
							content: `{"symbol": "${symbol}", "numOfMonths": ${numOfMonths}}`,
						},
					]);

					const data = await getStockPricing({ stocks: symbol });

					return <StockDisplay symbol={symbol} data={data} />;
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

export const AIProvider = createAI<ServerMessage[], ClientMessage[]>({
	actions: {
		converse,
	},
	onSetAIState: async (event) => {
		"use server";

		const { done, state } = event;
		console.log(event);

		console.warn("AI State set called");

		if (done) {
			console.log(done, state);
		}
	},
	onGetUIState: async () => {
		"use server";

		const history: ServerMessage[] = getAIState() as any;

		return history.map(({ role, content }) => ({
			id: generateId(),
			role,
			display: role === "function" ? <div>function</div> : content,
		}));
	},
});
