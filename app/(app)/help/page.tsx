import { generatePageMeta } from "@/app/seo/generate";
import { Heading } from "@/components/ui/heading";

export const metadata = generatePageMeta({
	title: "Help",
	description: "Get help with PLAM.",
	url: "/help",
});

export default function HelpPage() {
	return (
		<main>
			<Heading>Help</Heading>
		</main>
	);
}
