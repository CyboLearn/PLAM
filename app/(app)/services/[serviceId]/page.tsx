import { getServiceById } from "@/actions/services/get-service-by-id";
import { generatePageMeta } from "@/app/seo/generate";
import { PageHeading } from "@/components/ui/page-heading";

export async function generateMetadata({
	params: { serviceId },
}: {
	readonly params: {
		readonly serviceId: string;
	};
}) {
	const { data } = await getServiceById({ serviceIdOrSlug: serviceId });

	return generatePageMeta({
		title: data?.service_name,
		description: "A service for your Personal Large Action Model.",
		url: `/services/${data?.service_slug}`,
	});
}

export default async function ServicePage({
	params: { serviceId },
}: {
	readonly params: {
		readonly serviceId: string;
	};
}) {
	const { data, error } = await getServiceById({ serviceIdOrSlug: serviceId });

	if (error) {
		console.error(error);
		return (
			<main>
				<PageHeading title="Service" description="A PLAM Service." />
			</main>
		);
	}

	return (
		<main>
			<PageHeading title={data?.service_name} description={data?.description ?? "A PLAM Service."} />
			<pre>{JSON.stringify(data, null, 2)}</pre>
		</main>
	);
}
