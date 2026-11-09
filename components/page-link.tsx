"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";
import { usePageNavigate } from "@/components/displayed-path";

// An internal link that fades the page out before the route changes (see
// displayed-path.tsx). Modified clicks (new tab, etc.) keep native behaviour.
export function PageLink({ href, onClick, ...rest }: ComponentProps<typeof Link>) {
  const navigate = usePageNavigate();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    navigate(typeof href === "string" ? href : (href.pathname ?? "/"));
  };

  return <Link href={href} onClick={handleClick} {...rest} />;
}
