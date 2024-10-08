"use client";

import { FileError } from "@/components/storage/file-error";
import { FilePreview } from "@/components/storage/file-preview";
import { Code, Text } from "@/components/ui/text";
import type { MediaType } from "@/utils/media/getMediaType";
import { Button } from "@/components/ui/button";
import { postShortVideo } from "@/actions/external-accounts/social-media/post-short-video";

export function FileComponent({
	fileUrl = "",
	filetype = "image",
	filename = "",
	fileId = "",
}: {
	readonly fileUrl: string | undefined;
	readonly filetype?: MediaType;
	readonly filename?: string;
	readonly fileId?: string;
}) {
	const showVideoActions = false;

	if (!fileUrl) {
		return <FileError error={new Error("File not found.")} />;
	}

	return (
		<main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
			<div className="flex flex-col gap-y-1 justify-center items-center w-full">
				<FilePreview fileUrl={fileUrl} filetype={filetype} />
				<Text>{filename}</Text>
			</div>
			<div className="flex flex-col gap-4">
				<Text>This is a preview of the file you selected.</Text>
				{filetype === "video" && showVideoActions && (
					<div className="flex flex-row gap-4">
						<Button
							disabled
							color="red"
							onClick={async () => {
								await postShortVideo({
									platforms: ["youtube"],
									video: filename,
									metadata: {
										title: "My video title",
										description: "My video description - #Shorts",
									},
								});
							}}
						>
							Post to YouTube
						</Button>
						<Button
							disabled
							color="pink"
							onClick={async () => {
								await postShortVideo({
									platforms: ["instagram"],
									video: filename,
									metadata: {
										title: "My video title",
										description: "My video description",
									},
								});
							}}
						>
							Post to Instagram
						</Button>
						<Button
							disabled
							color="blue"
							onClick={async () => {
								await postShortVideo({
									platforms: ["facebook"],
									video: filename,
									metadata: {
										title: "My video title",
										description: "My video description",
									},
								});
							}}
						>
							Post to Facebook
						</Button>
					</div>
				)}
				<Code>{fileId ? `File ID: ${fileId}` : "File ID not found"}</Code>
			</div>
		</main>
	);
}
