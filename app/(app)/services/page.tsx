import { getAvailableServices } from "@/actions/services/get-available-services";
import { generatePageMeta } from "@/app/seo/generate";
import { ServiceViewer } from "@/components/services/service-view";
import { PageHeading } from "@/components/ui/page-heading";

export const metadata = generatePageMeta({
	title: "Tools & Services",
	description: "Tools & Services for your Personal Large Action Model.",
	url: "/services",
});

export default async function ToolsList() {
	const { data, error } = await getAvailableServices();

	if (error) {
		console.error(error);
		return <main>{error}</main>;
	}

	return (
		<main>
			<PageHeading
				title="Tools & Services"
				description="Tools & Services for your Personal Large Action Model."
			/>
			<ServiceViewer services={data} />
		</main>
	);
}
