import { NavigationProvider } from "@/components/navigation/NavigationProvider";

export default function AppLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<NavigationProvider>
			{children}
		</NavigationProvider>
	);
}
