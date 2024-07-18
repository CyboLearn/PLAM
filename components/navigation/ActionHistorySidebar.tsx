"use client";

import { getActionHistory } from "@/actions/chat/get-action-history";
import { useEffect, useState } from "react";
import {
	SidebarHeading,
	SidebarItem,
	SidebarSection,
	SidebarSpacer,
} from "@/components/ui/sidebar";
import { isToday, isYesterday, subDays, isWithinInterval } from "date-fns";
import { Text } from "@/components/ui/text";
import { usePathname } from "next/navigation";
import { useRefreshTrigger } from "@/utils/triggers/trigger-refresh";

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
	const { trigger } = useRefreshTrigger();

	useEffect(() => {
		async function fetchData() {
			try {
				setStatus("loading");

				const response = await getActionHistory();
				if (response.error) {
					handleError(response.error);
					return;
				}

				setStatus("success");

				if (!response.data) {
					return;
				}

				const groupedHistory = groupActionHistory(response.data);
				sortGroupedHistory(groupedHistory);
				setHistory(groupedHistory);
			} catch (error) {
				handleError(error);
			}
		}

		if (trigger) {
			fetchData();
		}

		fetchData();
	}, [trigger]);

	function handleError(error: any) {
		console.error("Failed to fetch action history:", error);
		setStatus("error");
	}

	function groupActionHistory(data: any[]): GroupedActionHistory {
		const today = new Date();
		const yesterday = subDays(today, 1);
		const last7Days = subDays(today, 7);

		return data.reduce((acc: GroupedActionHistory, action: ActionHistory) => {
			const actionDate = new Date(action.created_at);
			const category = categorizeAction(actionDate, yesterday, last7Days);

			if (!acc[category]) {
				acc[category] = [];
			}

			acc[category].push(action);

			return acc;
		}, {});
	}

	function categorizeAction(
		actionDate: Date,
		yesterday: Date,
		last7Days: Date,
	): string {
		if (isToday(actionDate)) {
			return "Today";
		}
		if (isYesterday(actionDate)) {
			return "Yesterday";
		}
		if (isWithinInterval(actionDate, { start: last7Days, end: yesterday })) {
			return "Previous 7 Days";
		}
		return "Older";
	}

	function sortGroupedHistory(groupedHistory: GroupedActionHistory) {
		for (const category of Object.keys(groupedHistory)) {
			groupedHistory[category].sort(
				(a: ActionHistory, b: ActionHistory) =>
					new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
			);
		}
	}

	const categoryOrder = ["Today", "Yesterday", "Previous 7 Days", "Older"];

	return (
		<SidebarSection className="max-lg:hidden">
			<SidebarSection>
				{status === "success" &&
					history &&
					Object.entries(history)
						.sort(
							([a], [b]) => categoryOrder.indexOf(a) - categoryOrder.indexOf(b),
						)
						.map(([category, actions]) => (
							<div key={category}>
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
								<SidebarSpacer className="!mt-2" />
							</div>
						))}
			</SidebarSection>
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
