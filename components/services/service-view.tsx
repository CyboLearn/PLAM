"use client";

import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Dropdown, DropdownButton, DropdownItem, DropdownMenu } from "@/components/ui/dropdown";
import { Strong, Text, TextLink } from "@/components/ui/text";

export function ServiceViewer({
  services = [],
}: {
  readonly services: any[] | null;
}) {
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
								<Text className="!text-xs">
                  {item.description}
                </Text>
							</div>
							<div className="flex flex-col ml-auto">
								<Dropdown>
									<DropdownButton outline>
										Options
										<ChevronDownIcon />
									</DropdownButton>
									<DropdownMenu>
										<DropdownItem>
											Enable {item.service_name}
										</DropdownItem>
									</DropdownMenu>
								</Dropdown>
							</div>
						</div>
					);
				})}
				{services?.length === 0 && (
					<div className="p-4 rounded-lg text-center border-zinc-950/10 dark:border-white/10 col-span-full">
						<Text className="!text-sm">No items found.</Text>
					</div>
				)}
			</div>
  )
}