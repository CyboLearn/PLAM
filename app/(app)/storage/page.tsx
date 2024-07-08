import { getItemsInStorage } from "@/actions/media/get-items-in-storage";
import { generatePageMeta } from "@/app/seo/generate";
import { FolderView } from "@/components/storage/folder-view";
import { UploadForm } from "@/components/storage/upload";
import { PageHeading } from "@/components/ui/page-heading";

export const metadata = generatePageMeta({
	title: "Storage",
	description: "Storage for your Personal Large Action Model.",
	url: "/storage",
});

export default async function Storage() {
	const { data, userId } = await getItemsInStorage();

	return (
		<main>
			<PageHeading
				title="Storage"
				description="Storage for your Personal Large Action Model."
			>
				<UploadForm />
			</PageHeading>
			<FolderView data={data} userId={userId} />
		</main>
	);
}
