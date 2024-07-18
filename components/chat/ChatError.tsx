"use client";

import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Button } from "../ui/button";

export function ChatError() {
	return (
		<div className="flex flex-col">
			<Heading>We couldn’t load this chat.</Heading>
			<Text>
				You may not have access to this chat or it may have been deleted.
			</Text>
			<div className="flex flex-row w-fit mt-6 gap-x-4">
				<Button href="/chat" color="dark/white">
					Start a new chat
				</Button>
				<Button href="/support" plain>
					Contact Support
				</Button>
			</div>
		</div>
	);
}
