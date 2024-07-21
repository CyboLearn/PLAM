import { generatePageMeta } from "@/app/seo/generate";
import { PageHeading } from "@/components/ui/page-heading";

export const metadata = generatePageMeta({
	title: "API Key Details",
	description: "View details, permissions, and the usage of an API key.",
	url: "/settings/keys",
});

export default async function ViewKeyDetails() {
	return (
		<div>
			<PageHeading
				title="View API Key Details"
				description="View details, permissions, and the usage of an API key."
			/>
		</div>
	);
}
