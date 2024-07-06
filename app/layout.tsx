import clsx from "clsx";
import { Providers } from "./providers";

// Styles
import "@/styles/globals.css";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { generatePageMeta } from "./seo/generate";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const monaSans = localFont({
  src: "../fonts/Mona-Sans.var.woff2",
  display: "swap",
  variable: "--font-mona-sans",
  weight: "200 900",
});

const gambetta = localFont({
  src: "../fonts/Gambetta.woff",
  display: "swap",
  variable: "--font-gambetta",
  weight: "200 900",
});

export const metadata = generatePageMeta();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={clsx(
        "h-full antialiased",
        "bg-white lg:bg-zinc-100 dark:bg-zinc-900 dark:lg:bg-zinc-950",
        inter.variable,
        monaSans.variable,
        gambetta.variable
      )}
      suppressHydrationWarning
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
