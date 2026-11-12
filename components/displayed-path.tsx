"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";

export const FADE_MS = 320;
// If a navigation never commits (offline, error), bring the page back.
const GIVE_UP_MS = 4000;

// Page-transition state, shared by everything that has to move in step with
// the fade.
//
// Next renders the new route the instant it commits, so the old page cannot
// be held on screen while it fades. Instead the fade-out starts on the click
// (navigate), the router is only told to go once the page is fully
// transparent, and the new page fades in after it lands.
//
//   path    the page the user is looking at; changes while the page is at
//           opacity 0 (theme lock, nav links and theme toggle follow it)
//   target  where a pending navigation is headed, so things that fade with
//           the page (the landing scene) can start moving on click
//   visible whether the page content should currently be shown
type Value = {
  path: string;
  target: string | null;
  visible: boolean;
  navigate: (href: string) => void;
  // PageTransition reports that the router has committed `pathname`
  commit: (pathname: string) => void;
  reveal: () => void;
  hideNow: () => void;
};

const Ctx = createContext<Value | null>(null);

export function DisplayedPathProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [path, setPath] = useState(pathname);
  const [target, setTarget] = useState<string | null>(null);
  const [visible, setVisible] = useState(true);

  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;
  const targetRef = useRef<string | null>(null);
  const timers = useRef<number[]>([]);
  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };
  useEffect(() => clearTimers, []);

  const navigate = useCallback(
    (href: string) => {
      const dest = href.split(/[?#]/)[0] || "/";
      if (dest === pathnameRef.current) {
        // heading back to the page we are on: drop any pending navigation
        if (targetRef.current !== null) {
          clearTimers();
          targetRef.current = null;
          setTarget(null);
          setVisible(true);
        }
        return;
      }
      clearTimers();
      targetRef.current = dest;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setTarget(dest);
      setVisible(false);
      timers.current.push(
        window.setTimeout(() => router.push(href, { scroll: false }), reduced ? 0 : FADE_MS),
        window.setTimeout(() => {
          if (pathnameRef.current !== dest) {
            targetRef.current = null;
            setTarget(null);
            setVisible(true);
          }
        }, GIVE_UP_MS),
      );
    },
    [router],
  );

  const commit = useCallback((next: string) => {
    setPath(next);
    // A newer click may already be heading somewhere else; keep its timers.
    if (targetRef.current !== null && targetRef.current !== next) return;
    clearTimers();
    targetRef.current = null;
    setTarget(null);
  }, []);
  const reveal = useCallback(() => setVisible(true), []);
  const hideNow = useCallback(() => setVisible(false), []);

  const value = useMemo(
    () => ({ path, target, visible, navigate, commit, reveal, hideNow }),
    [path, target, visible, navigate, commit, reveal, hideNow],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

function useCtx() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("must be used inside DisplayedPathProvider");
  return ctx;
}

export const useDisplayedPath = () => {
  const { path, target } = useCtx();
  return { path, target };
};
export const usePageNavigate = () => useCtx().navigate;
export const usePageFade = () => {
  const { visible, commit, reveal, hideNow } = useCtx();
  return { visible, commit, reveal, hideNow };
};
