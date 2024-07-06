import { generatePageMeta } from "@/app/seo/generate";
import { Heading } from "@/components/ui/heading";

export const metadata = generatePageMeta({
	title: "Tools",
	description: "Tools for your Personal Large Action Model.",
	url: "/tools",
});

export default function ToolsList() {
	return (
		<main>
			<Heading>Tools</Heading>
		</main>
	);
}
