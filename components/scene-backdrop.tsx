"use client";

import { useEffect, useState } from "react";
import { FADE_MS, useDisplayedPath } from "@/components/displayed-path";
import { InkMountains } from "@/components/ink-mountains";

// The landing-page scene lives in the layout, outside the page fade, so that
// leaving and returning to "/" cross-fades it instead of tearing it down and
// rebuilding the canvas (a ~0.5s synchronous build that stalled the fade-in).
// It mounts the first time the landing page is shown and is kept afterwards.
// Its opacity follows the pending navigation target, so it fades in step with
// the page content from the moment of the click.
export function SceneBackdrop() {
  const { path, target } = useDisplayedPath();
  const [mounted, setMounted] = useState(path === "/");

  useEffect(() => {
    if (path === "/") setMounted(true);
  }, [path]);

  if (!mounted) return null;
  const show = (target ?? path) === "/";

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      style={{ opacity: show ? 1 : 0, transition: `opacity ${FADE_MS}ms cubic-bezier(0.4, 0, 0.2, 1)` }}
      aria-hidden="true"
    >
      <InkMountains seed={7} active={show} className="absolute inset-0" />
    </div>
  );
}
