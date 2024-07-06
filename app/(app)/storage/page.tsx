import { generatePageMeta } from "@/app/seo/generate";
import { Heading } from "@/components/ui/heading";

export const metadata = generatePageMeta({
	title: "Storage",
	description: "Storage for your Personal Large Action Model.",
	url: "/storage",
});

export default function Storage() {
	return (
		<main>
			<Heading>Storage</Heading>
		</main>
	);
}
