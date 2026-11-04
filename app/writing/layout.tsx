import type { Metadata } from "next";
import { absoluteUrl, SITE_NAME } from "@/lib/site";

const description = "Essays and notes by Tejas Thind.";

// Keeps this page's canonical URL correct (the root default is "/"). The page
// itself is a client component, so its metadata lives here. No title on
// purpose: the tab keeps the site title.
export const metadata: Metadata = {
  description,
  alternates: { canonical: "/writing" },
  openGraph: {
    type: "website",
    url: absoluteUrl("/writing"),
    title: SITE_NAME,
    description,
    siteName: SITE_NAME,
    images: ["/opengraph-image"],
  },
};

export default function WritingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
