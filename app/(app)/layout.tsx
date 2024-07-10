import { NavigationProvider } from "@/components/navigation/NavigationProvider";
import Triggers from "@/utils/triggers/triggers";

export default function AppLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<Triggers>
			<NavigationProvider>{children}</NavigationProvider>
		</Triggers>
	);
}
