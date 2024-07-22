"use client";

// Auth
import AuthProvider, { useAuth } from "@/utils/auth/AuthProvider";

// Themes
import { ThemeProvider, useTheme } from "next-themes";

// Sonner
import { Toaster as Sonner } from "sonner";

// OpenPanel
import { OpenpanelProvider } from "@openpanel/nextjs";

export function Providers({
	children,
}: {
	readonly children: React.ReactNode;
}) {
	return (
		<AuthProvider>
			<OpenPanel />
			<ThemeProvider attribute="class" disableTransitionOnChange enableSystem>
				{children}
				<Toaster />
			</ThemeProvider>
		</AuthProvider>
	);
}

export function Toaster() {
	const { resolvedTheme } = useTheme();

	if (!resolvedTheme) return null;

	return (
		<Sonner richColors theme={resolvedTheme === "dark" ? "dark" : "light"} />
	);
}

export function OpenPanel() {
	const { data } = useAuth();
	const userId = data?.user_id ?? undefined;

	return (
		<OpenpanelProvider
			clientId={process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID!}
			trackScreenViews={true}
			trackAttributes={true}
			trackOutgoingLinks={true}
			url="/api/track"
			profileId={userId}
		/>
	);
}
