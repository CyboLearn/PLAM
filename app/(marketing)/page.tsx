import { generatePageMeta } from "@/app/seo/generate";

export const metadata = generatePageMeta({
  url: "/",
  title: "Do anything you want.",
  description: "A Personal Large Action Model (PLAM) to assist you in whatever you want to do."
});

export default function Homepage() {
  return (
    <main>
      <div>
        <h1>PLAM’s Homepage</h1>
      </div>
    </main>
  );
}
