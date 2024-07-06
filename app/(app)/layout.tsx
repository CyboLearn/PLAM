import { NavigationProvider } from "@/components/navigation/NavigationProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <NavigationProvider>{children}</NavigationProvider>;
}
