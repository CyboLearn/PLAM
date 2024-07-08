"use client";

import { ChevronDownIcon } from "@heroicons/react/20/solid";
import {
	Dropdown,
	DropdownButton,
	DropdownItem,
	DropdownMenu,
} from "@/components/ui/dropdown";
import { Strong, Text, TextLink } from "@/components/ui/text";
import { createClient } from "@/utils/supabase/client";
import type {
	EnabledServices,
	Service,
} from "@/actions/services/get-available-services";
import { useRouter } from "next/navigation";

export function ServiceViewer({
	services = [],
	enabledServices = [],
}: {
	readonly services: Service[] | null;
	readonly enabledServices: EnabledServices[] | null;
}) {
	const router = useRouter();
	const supabase = createClient();

	const toggleService = async (enabled: boolean, service_id: string) => {
		const {
			data: { user },
			error: userError,
		} = await supabase.auth.getUser();

		if (userError) {
			console.error(userError);
			return;
		}

		if (!user) {
			console.error("User not found.");
			return;
		}

		const { error } = await supabase.from("enabled_services").upsert({
			service_id,
			is_enabled: enabled,
			user_id: user.id,
		});

		if (error) {
			console.error(error);
		}

		router.refresh();
	};

	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
			{services?.map((item) => {
				return (
					<div
						key={item.service_id}
						className="p-4 rounded-lg border border-zinc-950/10 dark:border-white/10 flex flex-row"
					>
						<div className="flex flex-col">
							<Text className="!text-sm">
								<TextLink href={`/services/${item.service_slug}`}>
									<Strong>{item.service_name}</Strong>
								</TextLink>
							</Text>
							<Text className="!text-xs">{item.description}</Text>
						</div>
						<div className="flex flex-col ml-auto">
							<Dropdown>
								<DropdownButton outline>
									Options
									<ChevronDownIcon />
								</DropdownButton>
								<DropdownMenu>
									<DropdownItem href={`/services/${item.service_slug}`}>
										Learn more
									</DropdownItem>
									<DropdownItem
										onClick={() => {
											toggleService(
												!enabledServices?.find(
													(service) => service.service_id === item.service_id,
												)?.is_enabled,
												item.service_id,
											);
										}}
									>
										{enabledServices?.find(
											(service) => service.service_id === item.service_id,
										)?.is_enabled
											? "Disable"
											: "Enable"}{" "}
										{item.service_name}
									</DropdownItem>
								</DropdownMenu>
							</Dropdown>
						</div>
					</div>
				);
			})}
			{services?.length === 0 && (
				<div className="p-4 rounded-lg text-center border-zinc-950/10 dark:border-white/10 col-span-full">
					<Text className="!text-sm">No services found.</Text>
				</div>
			)}
		</div>
	);
}
