"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import { FADE_MS, useDisplayedPath, usePageFade } from "@/components/displayed-path";

// The fade itself. The fade-out is started by navigate() on the click (see
// displayed-path.tsx); this component fades the new page in once the router
// has committed it, and covers navigation that did not start from a click
// (browser back/forward) by hiding the new page instantly first.
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { path, target } = useDisplayedPath();
  const { visible, commit, reveal, hideNow } = usePageFade();
  const ref = useRef<HTMLDivElement>(null);
  const visibleRef = useRef(visible);
  visibleRef.current = visible;

  // Runs before paint, so the new page is never shown at full opacity.
  useLayoutEffect(() => {
    if (pathname === path) return;
    const el = ref.current;
    if (el && visibleRef.current) {
      // back/forward: no click started a fade-out, so cut to transparent
      const prev = el.style.transition;
      el.style.transition = "none";
      el.style.opacity = "0";
      void el.offsetHeight;
      el.style.transition = prev;
      hideNow();
    }
    window.scrollTo(0, 0);
    commit(pathname);
  }, [pathname, path, commit, hideNow]);

  // Fade the committed page in once it has painted at opacity 0.
  useEffect(() => {
    if (pathname !== path || target !== null || visible) return;
    let raf = requestAnimationFrame(() => {
      raf = requestAnimationFrame(reveal);
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname, path, target, visible, reveal]);

  return (
    <div
      ref={ref}
      style={{
        transition: `opacity ${FADE_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        opacity: visible ? 1 : 0,
      }}
    >
      {children}
    </div>
  );
}
