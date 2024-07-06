import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./app/**/*.{ts,tsx,mdx}",
		"./components/**/*.{ts,tsx,mdx}",
		"./actions/**/*.{ts,tsx,mdx}",
	],
	theme: {
		extend: {
			animation: {
				"caret-blink": "caret-blink 1.2s ease-out infinite",
			},
			boxShadow: {
				glow: "0 0 4px rgb(0 0 0 / 0.1)",
			},
			maxWidth: {
				lg: "33rem",
				"2xl": "40rem",
				"3xl": "50rem",
				"5xl": "66rem",
			},
			opacity: {
				1: "0.01",
				2.5: "0.025",
				7.5: "0.075",
				15: "0.15",
			},
			fontFamily: {
				sans: "var(--font-inter)",
				display: "var(--font-mona-sans)",
				gambetta: "var(--font-gambetta)",
			},
			keyframes: {
				"caret-blink": {
					"0%,70%,100%": { opacity: "1" },
					"20%,50%": { opacity: "0" },
				},
			},
		},
	},
	plugins: [
		require("@tailwindcss/forms"),
		require("@tailwindcss/typography"),
		require("@headlessui/tailwindcss"),
	],
};
export default config;
