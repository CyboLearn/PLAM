"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
	Dialog,
	DialogActions,
	DialogBody,
	DialogDescription,
	DialogTitle,
} from "@/components/ui/dialog";
import { Description, Field, Label } from "@/components/ui/fieldset";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export function UploadButtons({
	deleteOnClick,
	uploadOnClick,
	createOnClick,
}: {
	readonly deleteOnClick?: () => void;
	readonly uploadOnClick?: () => void;
	readonly createOnClick?: () => void;
}) {
	return (
		<>
			{uploadOnClick && <Button onClick={uploadOnClick}>Upload File</Button>}
			{createOnClick && <Button onClick={createOnClick}>Create Folder</Button>}
			{deleteOnClick && (
				<Button color="red" onClick={deleteOnClick}>
					Delete Folder
				</Button>
			)}
		</>
	);
}

type UploadStatus = "idle" | "loading" | "success" | "error";

/**
 * Upload form for a user to upload files and create folders in their storage space.
 *
 * @param folder - The folder inside of the user's storage space to upload to.
 * @returns JSX.Element
 */
export function UploadForm({
	folder,
	isPreview = true,
}: {
	readonly folder?: string;
	readonly isPreview?: boolean;
}) {
	const supabase = createClient();
	const router = useRouter();

	// File Upload
	const [isFileUploadOpen, setIsFileUploadOpen] = useState(false);
	const [fileUploadStatus, setFileUploadStatus] =
		useState<UploadStatus>("idle");
	const [file, setFile] = useState<File | null>(null);
	const [inputKey, setInputKey] = useState<number>(0);

	// Create Folder
	const [isFolderCreateOpen, setIsFolderCreateOpen] = useState(false);
	const [folderName, setFolderName] = useState<string>("");
	const [folderCreateStatus, setFolderCreateStatus] =
		useState<UploadStatus>("idle");

	// Delete Folder
	const [isFolderDeleteOpen, setIsFolderDeleteOpen] = useState(false);
	const [folderDeleteStatus, setFolderDeleteStatus] =
		useState<UploadStatus>("idle");

	const previousFolder = folder ? folder.split("/").slice(0, -1).join("/") : "";

	const handleFileUploadOpen = () => setIsFileUploadOpen(true);

	const uploadFile = async (file: File) => {
		setFileUploadStatus("loading");

		try {
			const {
				data: { user },
				error: userError,
			} = await supabase.auth.getUser();

			if (userError) {
				throw userError;
			}

			if (!user) {
				throw new Error("User not found.");
			}

			const location = folder ? `${user.id}/${folder}` : user.id;

			// upload to user.id/[file.name]
			const { error } = await supabase.storage
				.from("media")
				.upload(`${location}/${file.name}`, file);

			if (error) {
				throw error;
			}

			setFileUploadStatus("success");

			router.refresh();
		} catch (error) {
			setFileUploadStatus("error");
		}
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.target.files?.[0] || null;
		setFile(selectedFile);
	};

	const createFolder = async (folderName: string) => {
		setFolderCreateStatus("loading");

		try {
			// upload an empty file called `ignore.plam` to user.id/[folderName]/ignore.plam
			const {
				data: { user },
				error: userError,
			} = await supabase.auth.getUser();

			if (userError) {
				throw userError;
			}

			if (!user) {
				throw new Error("User not found.");
			}

			const location = folder ? `${user.id}/${folder}` : user.id;

			const { error } = await supabase.storage
				.from("media")
				.upload(`${location}/${folderName}/ignore.plam`, new File([], ""));

			if (error) {
				throw error;
			}

			setFolderCreateStatus("success");
		} catch {
			setFolderCreateStatus("error");
		}
	};

	const handleFolderCreateOpen = () => setIsFolderCreateOpen(true);

	const deleteFolderButton = () => {
		setIsFolderDeleteOpen(true);
	};

	const deleteFolder = async () => {
		setFolderDeleteStatus("loading");

		try {
			// delete all files in the folder
			const {
				data: { user },
				error: userError,
			} = await supabase.auth.getUser();

			if (userError) {
				throw userError;
			}

			if (!user) {
				throw new Error("User not found.");
			}

			const location = folder ? `${user.id}/${folder}` : user.id;

			const { data, error } = await supabase.storage
				.from("media")
				.list(location);

			if (error) {
				throw error;
			}

			const files = data || [];

			for (const file of files) {
				await supabase.storage
					.from("media")
					.remove([`${location}/${file.name}`]);
			}

			setFolderDeleteStatus("success");

			router.push(`/storage/${previousFolder}`);
		} catch {
			setFolderDeleteStatus("error");
		}
	};

	return (
		<>
			<UploadButtons
				uploadOnClick={!isPreview ? handleFileUploadOpen : undefined}
				createOnClick={!isPreview ? handleFolderCreateOpen : undefined}
				deleteOnClick={!isPreview ? deleteFolderButton : undefined}
			/>
			<Dialog
				open={isFileUploadOpen}
				onClose={() => setIsFileUploadOpen(false)}
			>
				<DialogTitle>Upload File</DialogTitle>
				<DialogDescription>
					Upload a file to your Personal Large Action Model.
				</DialogDescription>
				<DialogBody>
					<Field>
						<Label>File</Label>
						<Input
							key={inputKey}
							name="file"
							placeholder="Select a file"
							type="file"
							onChange={handleFileChange}
						/>
					</Field>
				</DialogBody>
				<DialogActions>
					<Button
						plain
						onClick={() => {
							setFile(null);
							setIsFileUploadOpen(false);
							setInputKey((prevKey) => prevKey + 1);
						}}
						disabled={fileUploadStatus === "loading"}
					>
						Cancel
					</Button>
					<Button
						onClick={async () => {
							if (file) {
								await uploadFile(file);

								setFile(null);
								setIsFileUploadOpen(false);
								setInputKey((prevKey) => prevKey + 1);
							}
						}}
						disabled={fileUploadStatus === "loading"}
					>
						Upload
					</Button>
				</DialogActions>
			</Dialog>
			<Dialog
				open={isFolderCreateOpen}
				onClose={() => setIsFolderCreateOpen(false)}
			>
				<DialogTitle>Create Folder</DialogTitle>
				<DialogDescription>
					Create a new folder in your storage space for PLAM.
				</DialogDescription>
				<DialogBody>
					<Field>
						<Label>
							Folder Name
							<Description>Enter a name for your new folder.</Description>
						</Label>
						<Input
							value={folderName}
							placeholder="Folder Name"
							onChange={(e) => setFolderName(e.target.value)}
						/>
					</Field>
				</DialogBody>
				<DialogActions>
					<Button
						plain
						onClick={() => {
							setFolderName("");
							setIsFolderCreateOpen(false);
						}}
						disabled={folderCreateStatus === "loading"}
					>
						Cancel
					</Button>
					<Button
						onClick={async () => {
							if (folderName) {
								await createFolder(folderName);

								setFolderName("");
								setIsFolderCreateOpen(false);
							}
						}}
						disabled={folderCreateStatus === "loading"}
					>
						Create Folder
					</Button>
				</DialogActions>
			</Dialog>
			<Dialog
				open={isFolderDeleteOpen}
				onClose={() => setIsFolderDeleteOpen(false)}
			>
				<DialogTitle>Delete Folder</DialogTitle>
				<DialogDescription>
					Permanentaly delete this folder and all of its contents.
				</DialogDescription>
				<DialogActions>
					<Button
						plain
						onClick={() => {
							setIsFolderDeleteOpen(false);
						}}
						disabled={folderDeleteStatus === "loading"}
					>
						Cancel
					</Button>
					<Button
						onClick={async () => {
							await deleteFolder();
							setIsFolderDeleteOpen(false);
						}}
						color="red"
						disabled={folderDeleteStatus === "loading"}
					>
						Delete Folder
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
