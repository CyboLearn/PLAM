"use client";

// Auth
import AuthProvider from "@/utils/auth/AuthProvider";

// Themes
import { ThemeProvider, useTheme } from "next-themes";

// Sonner
import { Toaster as Sonner } from "sonner";

export function Providers({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <AuthProvider>
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