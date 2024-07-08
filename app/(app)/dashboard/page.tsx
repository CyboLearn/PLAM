import { generatePageMeta } from "@/app/seo/generate";
import { PageHeading } from "@/components/ui/page-heading";

export const metadata = generatePageMeta({
	title: "Dashboard",
	description: "PLAM Dashboard",
	url: "/dashboard",
});

export default function DashboardPage() {
	return (
		<main>
			<PageHeading
        title="Dashboard"
        description="Dashboard for your Personal Large Action Model"
      />
		</main>
	);
}
