"use client";

import { formatDistance } from "date-fns";
import { PageSubheading } from "@/components/ui/page-heading";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Dropdown,
	DropdownButton,
	DropdownItem,
	DropdownMenu,
} from "@/components/ui/dropdown";
import {
	EllipsisHorizontalIcon,
	TrashIcon,
	EyeIcon,
	PlayPauseIcon,
} from "@heroicons/react/16/solid";
import { Code } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { deleteApiKey, toggleApiKey } from "@/actions/security/stop-api-key";
import { useRouter } from "next/navigation";
import { Badge } from "../ui/badge";

interface Key {
	id: string;
	start: string;
	apiId?: string;
	workspaceId: string;
	ownerId?: string;
	meta?: Record<string, any>;
	createdAt: number;
	updatedAt?: number;
	roles?: string[];
	permissions?: string[];
	name?: string;
	plaintext?: string;
}

interface ApiKeys {
	keys?: Key[];
	total?: number;
}

export function APIKeysSettings({
	apiKeys,
}: {
	readonly apiKeys: ApiKeys | null;
}) {
	const router = useRouter();

	return (
		<div>
			<PageSubheading
				title="API Keys"
				description="Use API Keys to interact with PLAM programmatically."
			>
				<Button>Create New Key</Button>
			</PageSubheading>
			<Table className="[--gutter:theme(spacing.4)]">
				<TableHead>
					<TableRow>
						<TableHeader>Key Name</TableHeader>
						<TableHeader>Created at</TableHeader>
						<TableHeader>Status</TableHeader>
						<TableHeader>Hint</TableHeader>
						<TableHeader className="relative w-0">
							<span className="sr-only">Actions</span>
						</TableHeader>
					</TableRow>
				</TableHead>
				<TableBody>
					{apiKeys?.keys?.map((key) => {
						const enabled = key.meta?.enabled === "true";

						return (
							<TableRow key={key.id}>
								<TableCell className="font-medium">
									{key.name ?? "An Unnamed Key"}
								</TableCell>
								<TableCell>
									{formatDistance(new Date(key.createdAt), new Date(), {
										addSuffix: true,
									})}
								</TableCell>
								<TableCell>
									{enabled ? (
										<Badge color="green">Active</Badge>
									) : (
										<Badge color="amber">Paused</Badge>
									)}
								</TableCell>
								<TableCell className="text-zinc-500">
									<Code>{key.start}</Code>
								</TableCell>
								<TableCell>
									<div className="-mx-3 -my-1.5 sm:-mx-2.5">
										<Dropdown>
											<DropdownButton plain aria-label="More options">
												<EllipsisHorizontalIcon />
											</DropdownButton>
											<DropdownMenu anchor="bottom end">
												<DropdownItem href={`/settings/keys/${key.id}`}>
													View Key
													<EyeIcon />
												</DropdownItem>
												<DropdownItem
													onClick={async () => {
														await toggleApiKey({
															keyId: key.id,
														});
														router.refresh();
													}}
												>
													Toggle
													<PlayPauseIcon />
												</DropdownItem>
												<DropdownItem
													onClick={async () => {
														await deleteApiKey({
															keyId: key.id,
														});
														router.refresh();
													}}
												>
													Delete
													<TrashIcon />
												</DropdownItem>
											</DropdownMenu>
										</Dropdown>
									</div>
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</div>
	);
}
