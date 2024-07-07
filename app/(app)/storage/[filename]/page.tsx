import { getItemFromStorage } from "@/actions/media/get-item-from-storage";
import { generatePageMeta } from "@/app/seo/generate";
import { FileComponent } from "@/components/storage/file";
import { PageHeading } from "@/components/ui/page-heading";
import { getMediaType } from "@/utils/media/getMediaType";

export async function generateMetadata({
	params: { filename },
}: {
	readonly params: {
		readonly filename: string;
	};
}) {
	const { data } = await getItemFromStorage({ filename });

	return generatePageMeta({
		title: data?.name ?? decodeURIComponent(filename),
		description: "Storage for your Personal Large Action Model.",
		url: `/storage/${filename}`,
	});
}

export default async function FilePage({
	params: { filename },
}: {
	readonly params: {
		readonly filename: string;
	};
}) {
	const { data } = await getItemFromStorage({ filename });

	return (
		<div>
			<PageHeading
				title={decodeURIComponent(filename)}
				description="This is a file in your storage."
			/>
			<FileComponent fileUrl={data?.signedUrl} filetype={getMediaType(data?.metadata?.mimetype ?? "other")} filename={decodeURIComponent(filename)} />
		</div>
	);
}
