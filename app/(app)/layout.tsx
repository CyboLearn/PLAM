import { NavigationProvider } from "@/components/navigation/NavigationProvider";
import { createClient } from "@/utils/supabase/server";
import Triggers from "@/utils/triggers/triggers";
import { redirect } from "next/navigation";

export default async function AppLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const supabase = createClient();

	const { data: session, error } = await supabase.auth.getUser();

	if (!session?.user || error) {
		redirect("/sign-in");
	}

	return (
		<Triggers>
			<NavigationProvider>{children}</NavigationProvider>
		</Triggers>
	);
}
