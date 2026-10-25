"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";

// Subtle cross-fade on route change: hold the current page, fade it out, swap in
// the new one, then fade it in. Avoids the snappy instant swap.
const FADE_MS = 380;

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [displayed, setDisplayed] = useState<ReactNode>(children);
  const [visible, setVisible] = useState(true);
  const prevPath = useRef(pathname);

  useEffect(() => {
    if (pathname !== prevPath.current) setVisible(false); // begin fade-out
  }, [pathname]);

  return (
    <div
      style={{
        transition: `opacity ${FADE_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        opacity: visible ? 1 : 0,
        willChange: "opacity",
      }}
      onTransitionEnd={(e) => {
        if (e.propertyName !== "opacity" || visible) return;
        // fade-out finished: swap to the new page, then fade it back in
        prevPath.current = pathname;
        setDisplayed(children);
        requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
      }}
    >
      {displayed}
    </div>
  );
}
