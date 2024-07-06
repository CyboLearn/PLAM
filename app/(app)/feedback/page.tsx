import { generatePageMeta } from "@/app/seo/generate";
import { Heading } from "@/components/ui/heading";

export const metadata = generatePageMeta({
	title: "Feedback",
	description: "Give PLAM feedback!",
	url: "/feedback",
});

export default function FeedbackPage() {
	return (
		<main>
			<Heading>Feedback</Heading>
		</main>
	);
}
