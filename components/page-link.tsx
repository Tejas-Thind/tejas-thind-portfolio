"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";
import { usePathname } from "next/navigation";
import { usePageNavigate } from "@/components/displayed-path";

// An internal link that fades the page out before the route changes (see
// displayed-path.tsx). Modified clicks (new tab, etc.) keep native behaviour.
export function PageLink({ href, onClick, ...rest }: ComponentProps<typeof Link>) {
  const navigate = usePageNavigate();
  const pathname = usePathname();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    // Only plain internal paths fade. External links, hash-only or query-only
    // links on the same page, and URL objects keep Next's native behaviour.
    if (typeof href !== "string" || /^([a-z][a-z0-9+.-]*:|\/\/)/i.test(href)) return;
    const dest = href.split(/[?#]/)[0] || pathname;
    if (dest === pathname) return;
    e.preventDefault();
    navigate(href);
  };

  return <Link href={href} onClick={handleClick} {...rest} />;
}
