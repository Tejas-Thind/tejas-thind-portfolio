import type { ReactNode } from "react";
import { PageLink } from "@/components/page-link";

// One row of the writing list: a full-width, line-separated entry. Hover just
// lightens the whole row evenly. Square-edged, no gradient, no cursor tracking.
export function PostRow({ href, children }: { href: string; children: ReactNode }) {
  return (
    <PageLink
      href={href}
      className="group block px-3 py-4 transition-colors duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-foreground/[0.04] focus-visible:bg-foreground/[0.04] focus-visible:outline-none"
    >
      {children}
    </PageLink>
  );
}
