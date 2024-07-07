import { generatePageMeta } from "@/app/seo/generate";
import AuthVerifyPage from "@/components/auth/auth-verify";
import { Suspense } from "react";

export const metadata = generatePageMeta({
  url: "/sign-in/verify",
  title: "Verify Login",
  description: "Verify your PLAM account login"
});

export default function PLAMLoginVerification() {
  return (
    <Suspense>
      <AuthVerifyPage />
    </Suspense>
  )
}