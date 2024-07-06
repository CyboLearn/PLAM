import { generatePageMeta } from "@/app/seo/generate";
import { Heading } from "@/components/ui/heading";

export const metadata = generatePageMeta({
	title: "Settings",
	description: "PLAM Settings",
	url: "/settings",
});

export default function SettingsPage() {
	return (
		<main>
			<Heading>Settings</Heading>
		</main>
	);
}
