import { generatePageMeta } from "@/app/seo/generate";
import { Heading } from "@/components/ui/heading";

export const metadata = generatePageMeta({
	title: "Privacy Policy",
	description: "Personal Large Action Model Privacy Policy",
	url: "/privacy",
});

export default function PrivacyPolicy() {
	return (
		<main>
			<Heading>Privacy Policy</Heading>
		</main>
	);
}
