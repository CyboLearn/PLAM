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
import { Field, Label } from "@/components/ui/fieldset";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export function UploadButtons({
	onClick,
}: {
	readonly onClick?: () => void;
}) {
	return (
		<Button color="dark/white" onClick={onClick}>
			Upload File
		</Button>
	);
}

type UploadStatus = "idle" | "loading" | "success" | "error";

export function UploadForm() {
	const supabase = createClient();
	const router = useRouter();

	const [isOpen, setIsOpen] = useState(false);
	const [status, setStatus] = useState<UploadStatus>("idle");
	const [file, setFile] = useState<File | null>(null);
	const [inputKey, setInputKey] = useState<number>(0);

	const handleOpen = () => setIsOpen(true);

	const uploadFile = async (file: File) => {
		setStatus("loading");

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

			// upload to user.id/[file.name]
			const { error } = await supabase.storage
				.from("media")
        .upload(`${user.id}/${file.name}`, file);

			if (error) {
				throw error;
			}

			setStatus("success");
			router.refresh();
		} catch (error) {
			setStatus("error");
		}
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.target.files?.[0] || null;
		setFile(selectedFile);
	};

	return (
		<>
			<UploadButtons onClick={handleOpen} />
			<Dialog open={isOpen} onClose={() => setIsOpen(false)}>
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
							setIsOpen(false);
							setInputKey((prevKey) => prevKey + 1);
						}}
						disabled={status === "loading"}
					>
						Cancel
					</Button>
					<Button
						onClick={() => {
							if (file) {
								uploadFile(file);

								setFile(null);
								setIsOpen(false);
								setInputKey((prevKey) => prevKey + 1);
							}
						}}
						disabled={status === "loading"}
					>
						Upload
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
