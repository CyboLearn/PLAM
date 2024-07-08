import { getAvailableServices } from "@/actions/services/get-available-services";
import { generatePageMeta } from "@/app/seo/generate";
import { ServiceViewer } from "@/components/services/service-viewer";
import { PageHeading } from "@/components/ui/page-heading";

export const metadata = generatePageMeta({
	title: "Services",
	description: "Services for your Personal Large Action Model.",
	url: "/services",
});

export default async function Services() {
	const {
		data: { services, enabledServices },
		error,
	} = await getAvailableServices();

	if (error) {
		console.error(error);
		return <main>{error}</main>;
	}

	return (
		<main>
			<PageHeading
				title="Services"
				description="Services for your Personal Large Action Model."
			/>
			<ServiceViewer services={services} enabledServices={enabledServices} />
		</main>
	);
}
