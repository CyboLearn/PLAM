"use client";

import type { StorageItem } from "@/actions/media/get-items-in-storage";
import { Strong, Text, TextLink } from "@/components/ui/text";
import {
	Dropdown,
	DropdownButton,
	DropdownItem,
	DropdownMenu,
} from "@/components/ui/dropdown";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
	Dialog,
	DialogActions,
	DialogBody,
	DialogDescription,
	DialogTitle,
} from "@/components/ui/dialog";
import { Field, Label } from "@/components/ui/fieldset";
import { Button } from "@/components/ui/button";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { Link } from "@/components/ui/link";

export function FolderView({
	data,
	userId,
	folder = "",
}: {
	readonly data: StorageItem[] | null;
	readonly userId: string | null;
	readonly folder?: string;
}) {
	const [renameFileDialog, setRenameFileDialog] = useState(false);
	const [fileToRename, setFileToRename] = useState<string>("");
	const [newFileName, setNewFileName] = useState<string>("");
	const supabase = createClient();
	const router = useRouter();

	const folderData = data?.filter((item) => !item.name.endsWith(".plam"));

	const deleteItem = async (fileName: string) => {
		// delete item
		const { error } = await supabase.storage
			.from("media")
			.remove([`${userId}/${folder}/${fileName}`]);

		if (error) {
			console.error(error);
		}

		// refresh items
		router.refresh();
	};

	const downloadItem = async (fileName: string) => {
		// download item
		const { data, error } = await supabase.storage
			.from("media")
			.download(`${userId}/${folder}/${fileName}`);

		if (error) {
			console.error(error);
			return;
		}

		// Create a URL for the blob
		const url = window.URL.createObjectURL(data);

		// Create a link element
		const a = document.createElement("a");
		a.style.display = "none";
		a.href = url;
		a.download = fileName;

		// Append the link to the body
		document.body.appendChild(a);

		// Programmatically click the link to trigger the download
		a.click();

		// Remove the link from the document
		document.body.removeChild(a);

		// Revoke the URL
		window.URL.revokeObjectURL(url);
	};

	const renameFile = async (fileName: string, newFileName: string) => {
		// rename item
		const { error } = await supabase.storage
			.from("media")
			.move(
				`${userId}/${decodeURIComponent(folder)}/${fileName}`,
				`${userId}/${decodeURIComponent(folder)}/${newFileName}`,
			);

		if (error) {
			console.error(error);
		}

		// refresh items
		router.refresh();
	};

	return (
		<>
			<Dialog open={renameFileDialog} onClose={setRenameFileDialog}>
				<DialogTitle>
					Rename <Strong>{fileToRename}</Strong>
				</DialogTitle>
				<DialogDescription>Enter a new name for the file.</DialogDescription>
				<DialogBody>
					<Field>
						<Label>New Filename</Label>
						<Input
							name="filename"
							placeholder="My file"
							value={newFileName}
							onChange={(e) => setNewFileName(e.target.value)}
						/>
					</Field>
				</DialogBody>
				<DialogActions>
					<Button plain onClick={() => setRenameFileDialog(false)}>
						Cancel
					</Button>
					<Button
						color="amber"
						onClick={() => {
							renameFile(fileToRename, newFileName);
							setRenameFileDialog(false);
						}}
					>
						Rename
					</Button>
				</DialogActions>
			</Dialog>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
				{folderData?.map((item) => {
					if (!item?.metadata?.mimetype) {
						return (
							// folder
							<Link
								key={item.name}
								href={`/storage/${folder}/${item?.name}`}
								className="p-4 rounded-lg border border-zinc-950/10 dark:border-white/10 flex flex-row items-center"
							>
								<Text className="!text-sm">
									<Strong>{item?.name}</Strong>
								</Text>
								<ChevronRightIcon className="!size-5 ml-auto" />
							</Link>
						);
					}

					return (
						<div
							key={item.id}
							className="p-4 rounded-lg border border-zinc-950/10 dark:border-white/10 flex flex-row"
						>
							<div className="flex flex-col">
								<Text className="!text-sm">
									<TextLink href={`/storage/${folder}/${item.name}`}>
										<Strong>{item.name}</Strong>
									</TextLink>
								</Text>
								<Text className="!text-xs">{item.metadata.mimetype}</Text>
							</div>
							<div className="flex flex-col ml-auto">
								<Dropdown>
									<DropdownButton outline>
										Options
										<ChevronDownIcon />
									</DropdownButton>
									<DropdownMenu>
										<DropdownItem
											onClick={() => {
												setFileToRename(item.name);
												setNewFileName(item.name);
												setRenameFileDialog(true);
											}}
										>
											Rename
										</DropdownItem>
										<DropdownItem onClick={() => downloadItem(item.name)}>
											Download
										</DropdownItem>
										<DropdownItem onClick={() => deleteItem(item.name)}>
											Delete
										</DropdownItem>
									</DropdownMenu>
								</Dropdown>
							</div>
						</div>
					);
				})}
				{folderData?.length === 0 && (
					<div className="p-4 rounded-lg text-center border-zinc-950/10 dark:border-white/10 col-span-full">
						<Text className="!text-sm">No items found.</Text>
					</div>
				)}
			</div>
		</>
	);
}
