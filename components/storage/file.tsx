"use client";

import { FileError } from "@/components/storage/file-error";
import { FilePreview } from "@/components/storage/file-preview";
import { Text } from "@/components/ui/text";
import type { MediaType } from "@/utils/media/getMediaType";

export function FileComponent({
	fileUrl = "",
	filetype = "image",
	filename = "",
}: {
	readonly fileUrl: string | undefined;
	readonly filetype?: MediaType;
	readonly filename?: string;
}) {
	if (!fileUrl) {
		return <FileError error={new Error("File not found.")} />;
	}

	return (
		<main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
			<div className="flex flex-col gap-y-1 justify-center items-center w-fit">
				<FilePreview
					fileUrl={fileUrl}
					filetype={filetype}
				/>
				<Text>{filename}</Text>
			</div>
			<div>
				<Text>
					This is a preview of the file you selected. You can download it by
					clicking the download button below.
				</Text>
			</div>
		</main>
	);
}
