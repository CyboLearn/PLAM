import { getItemFromStorage } from "@/actions/media/get-item-from-storage";
import { generatePageMeta } from "@/app/seo/generate";
import { FileComponent } from "@/components/storage/file";
import { PageHeading } from "@/components/ui/page-heading";
import { getMediaType } from "@/utils/media/getMediaType";
import { FolderView } from "@/components/storage/folder-view";
import {
	getItemsInStorage,
	type StorageItem,
} from "@/actions/media/get-items-in-storage";
import { UploadForm } from "@/components/storage/upload";
import { FileError } from "@/components/storage/file-error";
import { PageBreadcrumbs } from "@/components/ui/page-breadcrumbs";

export async function generateMetadata({
	params: { filename },
}: {
	readonly params: {
		readonly filename: string[];
	};
}) {
	const { data, type } = await getItemFromStorage({ filename: filename });
	let folderName = null;

	if (type === "folder") {
		const { error } = await getItemsInStorage(filename.join("/"));

		if (!error) folderName = filename.join("/");
	}

	return generatePageMeta({
		title: folderName ?? data?.name,
		description: "Storage for your Personal Large Action Model.",
		url: `/storage/${filename}`,
	});
}

export default async function FilePage({
	params: { filename },
}: {
	readonly params: {
		readonly filename: string[];
	};
}) {
	const { data, type, error } = await getItemFromStorage({
		filename: filename,
	});

	let folder = {
		data: null as null | StorageItem[],
		userId: null as null | string,
		folder: "",
	};

	if (type === "folder") {
		const { data, userId } = await getItemsInStorage(filename.join("/"));

		folder = { data, userId, folder: filename.join("/") };
	}

	if (error) {
		return <FileError error={error.message} />;
	}

	return (
		<div>
			<PageHeading
				title={
					<PageBreadcrumbs
						items={[
							{
								name: "My Space",
								href: "/storage",
							},
							...filename.slice(0, -1).map((name, index) => ({
								name: decodeURIComponent(name),
								href: `/storage/${filename.slice(0, index + 1).join("/")}`,
							})),
						]}
						// the last index of the filename array is the current file/folder
						current={decodeURIComponent(filename[filename.length - 1])}
					/>
				}
				description={
					type === "file"
						? "This is a file in your storage."
						: "This is a folder in your storage."
				}
			>
				<UploadForm folder={filename.join("/")} isPreview={type === "file"} />
			</PageHeading>
			{type === "file" && (
				<FileComponent
					fileUrl={data?.signedUrl}
					filetype={getMediaType(data?.metadata?.mimetype ?? "other")}
					filename={decodeURIComponent(filename.join("/"))}
				/>
			)}
			{type === "folder" && (
				<FolderView
					data={folder?.data}
					folder={folder?.folder}
					userId={folder?.userId}
				/>
			)}
		</div>
	);
}
