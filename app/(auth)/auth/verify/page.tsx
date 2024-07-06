import { generatePageMeta } from "@/app/seo/generate";

export const metadata = generatePageMeta({
  url: "/auth/verify",
  title: "Verify Login",
  description: "Verify your PLAM account login"
});

export default function PLAMLoginVerification() {
  return (
    <main>
      <h1>Empty</h1>
    </main>
  )
}