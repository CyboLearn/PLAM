"use client";

import { type StreamableValue, useStreamableValue } from "ai/rsc";

export function Message({
	textStream,
}: { readonly textStream: StreamableValue }) {
	const [text] = useStreamableValue(textStream);

	return <div>{text}</div>;
}
