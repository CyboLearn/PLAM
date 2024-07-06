import { generatePageMeta } from "@/app/seo/generate";
import { Heading } from "@/components/ui/heading";

export const metadata = generatePageMeta({
	title: "Terms of Service",
	description: "Personal Large Action Model Terms of Service",
	url: "/terms",
});

export default function TermsOfService() {
	return (
		<main>
			<Heading>
				Terms of Service
			</Heading>
		</main>
	);
}
