"use client";

import { getActionHistory } from "@/actions/chat/get-action-history";
import { useEffect, useState } from "react";
import {
	SidebarHeading,
	SidebarItem,
	SidebarSection,
} from "@/components/ui/sidebar";
import { isToday, isYesterday, subDays, isWithinInterval } from "date-fns";
import { Text } from "@/components/ui/text";
import { usePathname } from "next/navigation";

interface ActionHistory {
	chat_id: string;
	created_at: string;
	chat_title: string;
}

interface GroupedActionHistory {
	[date: string]: ActionHistory[];
}

export function ActionHistorySidebar() {
	const [history, setHistory] = useState<GroupedActionHistory | null>(null);
	const pathname = usePathname();
	const [status, setStatus] = useState<"loading" | "error" | "success">(
		"loading",
	);

	useEffect(() => {
		async function fetchData() {
			try {
				setStatus("loading");
				
				const response = await getActionHistory();
				if (response.error) {
					setStatus("error");
					console.error(response.error);
					return;
				}

				setStatus("success");

				if (!response.data) {
					return;
				}

				const today = new Date();
				const yesterday = subDays(today, 1);
				const last7Days = subDays(today, 7);

				const groupedHistory = response.data.reduce(
					(acc: GroupedActionHistory, action: ActionHistory) => {
						const actionDate = new Date(action.created_at);
						let category = "Older";

						if (isToday(actionDate)) {
							category = "Today";
						} else if (isYesterday(actionDate)) {
							category = "Yesterday";
						} else if (
							isWithinInterval(actionDate, { start: last7Days, end: yesterday })
						) {
							category = "Previous 7 Days";
						}

						if (!acc[category]) {
							acc[category] = [];
						}

						acc[category].push(action);

						return acc;
					},
					{},
				);

				for (const category of Object.keys(groupedHistory)) {
					groupedHistory[category].sort(
						(a, b) =>
							new Date(b.created_at).getTime() -
							new Date(a.created_at).getTime(),
					);
				}

				setHistory(groupedHistory);
			} catch (error) {
				console.error("Failed to fetch action history:", error);
				setStatus("error");
			}
		}

		if (pathname) fetchData();
	}, [
		pathname
	]);

	return (
		<SidebarSection className="max-lg:hidden">
			{status === "success" &&
				history &&
				Object.entries(history).map(([category, actions]) => (
					<SidebarSection key={category}>
						<SidebarHeading>{category}</SidebarHeading>
						{actions.map((action: ActionHistory) => (
							<SidebarItem
								key={action.chat_id}
								href={`/chat/${action.chat_id}`}
								current={pathname === `/chat/${action.chat_id}`}
							>
								{action.chat_title}
							</SidebarItem>
						))}
					</SidebarSection>
				))}
			{status === "loading" && (
				<SidebarSection>
					<SidebarItem>
						<Text className="!text-xs">Loading...</Text>
					</SidebarItem>
				</SidebarSection>
			)}
			{status === "error" && (
				<SidebarSection>
					<SidebarItem>
						<Text className="!text-xs">Unable to load history</Text>
					</SidebarItem>
				</SidebarSection>
			)}
		</SidebarSection>
	);
}
