"use client";

import { useEffect, useRef } from "react";
import { track } from "@vercel/analytics";

const MIN_DWELL_MS = 15_000;

// Sends one "post_read_to_end" event per visit when the reader reaches the end
// of a post after spending at least MIN_DWELL_MS on it, so jumping straight to
// the bottom doesn't count as reading. It renders a zero-height sentinel; put
// it right after the last paragraph. Page views themselves are already
// recorded by <Analytics /> in the root layout.
export function ReadTracker({ slug }: { slug: string }) {
  const sentinel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const start = performance.now();
    let sent = false;
    let timer = 0;
    let atEnd = false;

    const fire = () => {
      if (sent) return;
      sent = true;
      track("post_read_to_end", { slug });
      observer.disconnect();
    };

    const observer = new IntersectionObserver(([entry]) => {
      atEnd = entry.isIntersecting;
      window.clearTimeout(timer);
      if (!atEnd) return;
      const wait = Math.max(0, MIN_DWELL_MS - (performance.now() - start));
      timer = window.setTimeout(() => atEnd && fire(), wait);
    });
    observer.observe(el);

    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, [slug]);

  return <div ref={sentinel} aria-hidden="true" className="h-px" />;
}
