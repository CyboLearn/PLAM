"use client";

import Image from "next/image";
import { FileError } from "./file-error";
import type { MediaType } from "@/utils/media/getMediaType";
import { Strong, Text } from "../ui/text";

export function FilePreview({
	fileUrl = "",
	filetype = "image",
}: {
	readonly fileUrl: string | undefined;
	readonly filetype?: MediaType;
}) {
	if (!fileUrl) {
		return <FileError error={new Error("File not found.")} />;
	}

	switch (filetype) {
		case "image":
			return (
				<Image
					src={fileUrl}
					alt="File preview"
					width={500}
					height={500}
					unoptimized
					className="rounded-lg w-full"
				/>
			);
		case "video":
			return (
				// biome-ignore lint/a11y/useMediaCaption:
				<video // NOSONAR
					controls
					className="rounded-lg w-full"
				>
					<source src={fileUrl} type="video/mp4" />
					Your browser does not support the video tag.
				</video>
			);
		case "audio":
			return (
				// biome-ignore lint/a11y/useMediaCaption:
				<audio // NOSONAR
					controls
					className="rounded-lg w-full"
				>
					<source src={fileUrl} type="audio/mpeg" />
					Your browser does not support the audio tag.
				</audio>
			);
		default:
			return (
				<div className="w-full flex justify-center items-center aspect-square border border-zinc-950/10 dark:border-white/10 rounded-lg">
					<Text>
						<Strong>File type not supported.</Strong>
					</Text>
				</div>
			);
	}
}
