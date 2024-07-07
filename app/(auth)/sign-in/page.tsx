import { generatePageMeta } from "@/app/seo/generate";
import AuthLoginPage from "@/components/auth/auth-login";

export const metadata = generatePageMeta({
	url: "/sign-in",
	title: "Login",
	description: "Login to your PLAM account.",
});

export default function PLAMLogin() {
	return <AuthLoginPage />;
}
