import type { Metadata } from "next";
import { absoluteUrl, SITE_NAME } from "@/lib/site";

const description =
  "Tejas Thind's work experience: software engineer intern at Vercel (Winter 2027), AI Engineer intern at Theory Ventures, software engineering at Clover Labs and Rootly AI, and earlier roles.";

// The page itself is a client component, so its metadata lives here. No title
// on purpose: the tab keeps the site title.
export const metadata: Metadata = {
  description,
  alternates: { canonical: "/experience", types: { "application/rss+xml": "/writing/feed.xml" } },
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
