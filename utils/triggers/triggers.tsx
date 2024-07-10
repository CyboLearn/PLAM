"use client";

import { RefreshTriggerProvider } from "@/utils/triggers/trigger-refresh";

export default function Triggers({
	children,
}: {
	readonly children: React.ReactNode;
}) {
	return <RefreshTriggerProvider>{children}</RefreshTriggerProvider>;
}
