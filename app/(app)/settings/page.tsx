import { getSocialMediaAccounts } from "@/actions/external-accounts/get-accounts";
import { listApiKeys } from "@/actions/security/list-api-keys";
import { generatePageMeta } from "@/app/seo/generate";
import { APIKeysSettings } from "@/components/settings/settings-api-keys";
import { ExternalAccountsAndConnections } from "@/components/settings/settings-external-accounts";
import { PageHeading } from "@/components/ui/page-heading";

export const metadata = generatePageMeta({
	title: "Settings",
	description: "PLAM Settings",
	url: "/settings",
});

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
	const { data } = await getSocialMediaAccounts();
	const { data: apiKeys } = await listApiKeys();

	const possibleConnections = [
		{
			id: "facebook",
			name: "Facebook & Instagram",
			description:
				"Connect your Facebook & Instagram accounts to allow PLAM to post on your behalf.",
			connected: data?.some((d) => d.platform === "facebook") ?? false,
		},
		{
			id: "google",
			name: "Google & YouTube",
			description:
				"Connect your Google & YouTube accounts to allow PLAM to do manage on your behalf.",
			connected: data?.some((d) => d.platform === "google") ?? false,
		},
		{
			id: "tiktok",
			name: "TikTok",
			description:
				"Connect your TikTok account to allow PLAM to post on your behalf.",
			connected: data?.some((d) => d.platform === "tiktok") ?? false,
			beta: true,
		},
	];

	return (
		<main>
			<PageHeading
				title="Settings"
				description="Manage your account settings"
			/>
			<div className="flex flex-col gap-y-6">
				<ExternalAccountsAndConnections connections={possibleConnections} />
				<APIKeysSettings apiKeys={apiKeys} />
			</div>
		</main>
	);
}
