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

type UploadStatus = "idle" | "loading" | "success" | "error";

export function ManageProjectButtons({
	createProjectButton,
	publishProjectButton,
}: {
	readonly createProjectButton?: () => void;
	readonly publishProjectButton?: () => void;
}) {
	return (
		<>
			{createProjectButton && (
				<Button color="dark/white" onClick={createProjectButton}>
					Create Project
				</Button>
			)}
			{publishProjectButton && (
				<Button disabled onClick={publishProjectButton}>
					Publish Project
				</Button>
			)}
		</>
	);
}

export function ManageProjects() {
	const supabase = createClient();
	const router = useRouter();

	const [projectName, setProjectName] = useState("");
	const [createProjectDialogOpen, setCreateProjectDialogOpen] = useState(false);
	const [projectCreationStatus, setProjectCreationStatus] =
		useState<UploadStatus>("idle");

	const handleCreateProjectDialogOpen = () => setCreateProjectDialogOpen(true);

	const createProject = async (project: string) => {
		setProjectCreationStatus("loading");

		try {
			// create a project in the storage directory: {user.id}/projects/{projectName}
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

			const location = project ? `${user.id}/Projects/${project}` : user.id;

			const { error } = await supabase.storage
				.from("media")
				.upload(`${location}/ignore.plam`, new File([], ""));

			if (error) {
				throw new Error("Project already exists.");
			}

			setProjectCreationStatus("success");
			router.refresh();
		} catch {
			setProjectCreationStatus("error");
		}
	};

	return (
		<>
			<ManageProjectButtons
				createProjectButton={handleCreateProjectDialogOpen}
			/>
			<Dialog
				open={createProjectDialogOpen}
				onClose={() => setCreateProjectDialogOpen(false)}
			>
				<DialogTitle>Create Project</DialogTitle>
				<DialogDescription>Create a new PLAM Studio project.</DialogDescription>
				<DialogBody>
					<Field>
						<Label>Project Name</Label>
						<Input
							placeholder="Enter project name"
							value={projectName}
							onChange={(e) => setProjectName(e.target.value)}
						/>
					</Field>
				</DialogBody>
				<DialogActions>
					<Button
						plain
						onClick={() => {
							setProjectName("");
							setCreateProjectDialogOpen(false);
						}}
						disabled={projectCreationStatus === "loading"}
					>
						Cancel
					</Button>
					<Button
						onClick={async () => {
							await createProject(projectName);
							setProjectName("");
							setCreateProjectDialogOpen(false);
						}}
						disabled={projectCreationStatus === "loading"}
					>
						Create Project
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
