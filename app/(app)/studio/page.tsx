import { generatePageMeta } from "@/app/seo/generate";
import { ManageProjects } from "@/components/studio/studio-create-project";
import { PageHeading } from "@/components/ui/page-heading";

export const metadata = generatePageMeta({
	title: "Studio",
	description:
		"Dream, create and publish content with your Personal Large Action Model.",
	url: "/studio",
});

export default async function Studio() {
	return (
		<main>
			<PageHeading
				title="Studio"
				description="Dream, create and publish content with your Personal Large Action Model."
			>
				<ManageProjects />
			</PageHeading>
		</main>
	);
}
