import { generatePageMeta } from "@/app/seo/generate";

export const metadata = generatePageMeta({
  url: "/auth",
  title: "Login",
  description: "Login to your PLAM account."
});

export default function PLAMLogin() {
  return (
    <main>
      <h1>Empty</h1>
    </main>
  )
}