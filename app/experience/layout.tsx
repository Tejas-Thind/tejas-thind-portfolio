import type { Metadata } from "next";
import { absoluteUrl, SITE_NAME } from "@/lib/site";

const description =
  "Tejas Thind's work experience: AI Engineer intern at Theory Ventures, software engineering at Clover Labs and Rootly AI, and earlier roles.";

// The page itself is a client component, so its metadata lives here. No title
// on purpose: the tab keeps the site title.
export const metadata: Metadata = {
  description,
  alternates: { canonical: "/experience" },
  openGraph: {
    type: "website",
    url: absoluteUrl("/experience"),
    title: SITE_NAME,
    description,
    siteName: SITE_NAME,
  },
};

export default function ExperienceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
