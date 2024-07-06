import { generatePageMeta } from "@/app/seo/generate";
import { Heading } from "@/components/ui/heading";

export const metadata = generatePageMeta({
	title: "My Profile",
	description: "PLAM Profile",
	url: "/profile",
});

export default function ProfilePage() {
	return (
		<main>
			<Heading>My Profile</Heading>
		</main>
	);
}
