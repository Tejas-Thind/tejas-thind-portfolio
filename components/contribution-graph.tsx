"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ExternalLink } from "lucide-react";
import { AnimatedLink } from "@/components/animated-link";

// Renders unconditionally on the homepage. Requires GITHUB_TOKEN
// (server-side, see app/api/contributions/route.ts) to actually show data;
// fails silently (renders nothing) if that's missing or GitHub errors.

type Level =
  | "NONE"
  | "FIRST_QUARTILE"
  | "SECOND_QUARTILE"
  | "THIRD_QUARTILE"
  | "FOURTH_QUARTILE";

type Day = { date: string; count: number; level: Level };
type Week = { days: Day[] };
type ContributionData = { total: number; weeks: Week[] };

const LEVEL_OPACITY: Record<Level, number> = {
  NONE: 0.06,
  FIRST_QUARTILE: 0.3,
  SECOND_QUARTILE: 0.5,
  THIRD_QUARTILE: 0.75,
  FOURTH_QUARTILE: 1,
};

// Reuses the site's existing TextScramble palette so the graph's colors
// stay tied to the rest of the site instead of introducing new ones.
// Green is skipped here specifically (unlike TextScramble's palette) since
// it's GitHub's own contribution-graph color and would look like a copy.
const PALETTE = [
  "var(--scramble-amber)",
  "var(--scramble-coral)",
  "var(--scramble-pink)",
  "var(--scramble-violet)",
  "var(--scramble-blue)",
  "var(--scramble-cyan)",
];

const CYCLE_INTERVAL_MS = 60 * 1000;

// Cell size stays small and fixed (by breakpoint); the gap is what's
// solved for from the container's measured width instead, so it comes out
// uniform on both axes (same value for rows and columns) while the grid
// still lines up exactly under the stats text above.
const MOBILE_CELL_PX = 4.5;
const DESKTOP_CELL_PX = 10;
const ROWS = 7;
const MIN_GAP_PX = 1;
const FALLBACK_GAP_PX = 2;
// Switches to the bigger desktop cell only once the container is actually
// wide enough to fit it with at least MIN_GAP_PX of gap - computed from the
// real measured width instead of a viewport breakpoint, so there's no dead
// zone where the viewport says "desktop" but the card itself is too narrow.
const DESKTOP_WIDTH_THRESHOLD = 53 * DESKTOP_CELL_PX + 52 * MIN_GAP_PX;

type Hovered = { x: number; y: number; count: number; date: string };

function formatDate(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ContributionGraph() {
  const [data, setData] = useState<ContributionData | null>(null);
  const [failed, setFailed] = useState(false);
  const [hovered, setHovered] = useState<Hovered | null>(null);
  // Starts at a fixed index so server and client render the same HTML on
  // hydration; the random pick happens after mount instead (see below).
  const [colorIndex, setColorIndex] = useState(0);
  // Same hydration-safety reasoning as colorIndex: starts at a fixed
  // fallback so server/client markup matches, then the real gap - derived
  // from the actually-measured container width - is set post-mount.
  const containerRef = useRef<HTMLDivElement>(null);
  const [cellPx, setCellPx] = useState(DESKTOP_CELL_PX);
  const [gapPx, setGapPx] = useState(FALLBACK_GAP_PX);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/contributions")
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((json: ContributionData) => {
        if (!cancelled) setData(json);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setColorIndex(Math.floor(Math.random() * PALETTE.length));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      setColorIndex((i) => (i + 1) % PALETTE.length);
    }, CYCLE_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  const columnCount = data?.weeks.length ?? 53;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      const width = el.clientWidth;
      const size = width >= DESKTOP_WIDTH_THRESHOLD ? DESKTOP_CELL_PX : MOBILE_CELL_PX;
      const gap = columnCount > 1 ? (width - size * columnCount) / (columnCount - 1) : 0;
      setCellPx(size);
      setGapPx(Math.max(gap, MIN_GAP_PX));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [columnCount]);

  if (failed) return null;

  const activeColor = PALETTE[colorIndex];

  const weeks = data?.weeks ?? Array.from({ length: 53 }, () => ({ days: [] as Day[] }));

  return (
    <div className="rounded-lg border border-border/70 bg-background/35 p-1.5 sm:p-2">
      <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground sm:mb-1.5">
        <span>
          {data ? data.total.toLocaleString() : "..."} contributions in the past year
        </span>
        <AnimatedLink
          href="https://github.com/Tejas-Thind"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground"
        >
          <span className="inline-flex items-center gap-1 whitespace-nowrap">
            @Tejas-Thind
            <ExternalLink className="h-3 w-3" strokeWidth={1.5} aria-hidden="true" />
          </span>
        </AnimatedLink>
      </div>

      {/* Cell size stays small and fixed (4px mobile / 8px desktop); the
          gap is solved for from the container's actually-measured width
          (via ResizeObserver) instead, applied equally to rows and columns,
          so it's always uniform and the grid still lines up exactly under
          the stats text above regardless of viewport width.
          overflow-x-auto is a safety net in case the gap ever gets clamped
          up to MIN_GAP_PX on an unrealistically narrow container. */}
      <div ref={containerRef} className="overflow-x-auto">
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${weeks.length}, ${cellPx}px)`,
            gridTemplateRows: `repeat(${ROWS}, ${cellPx}px)`,
            gridAutoFlow: "column",
            gap: `${gapPx}px`,
          }}
        >
          {weeks.flatMap((week, weekIndex) =>
            Array.from({ length: 7 }, (_, dayIndex) => {
              const day = week.days[dayIndex];
              const opacity = day ? LEVEL_OPACITY[day.level] : 0.06;
              return (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  className="h-full w-full rounded-none"
                  style={{
                    backgroundColor: activeColor,
                    opacity,
                    transition: `background-color 900ms cubic-bezier(0.32, 0.72, 0, 1) ${weekIndex * 10}ms`,
                  }}
                  onMouseEnter={
                    day
                      ? (e) => {
                          const r = e.currentTarget.getBoundingClientRect();
                          const x = Math.max(
                            60,
                            Math.min(window.innerWidth - 60, r.left + r.width / 2),
                          );
                          setHovered({ x, y: r.top, count: day.count, date: day.date });
                        }
                      : undefined
                  }
                  onMouseLeave={day ? () => setHovered(null) : undefined}
                />
              );
            }),
          )}
        </div>
      </div>

      {hovered &&
        createPortal(
          <div
            className="pointer-events-none fixed z-[100] -translate-x-1/2 -translate-y-[calc(100%+8px)] whitespace-nowrap rounded-md border border-border bg-background/95 px-2 py-1.5 text-xs shadow-lg backdrop-blur-md"
            style={{ left: hovered.x, top: hovered.y }}
          >
            <span className="font-medium text-foreground">
              {hovered.count} contribution{hovered.count === 1 ? "" : "s"}
            </span>
            <span className="text-muted-foreground"> on {formatDate(hovered.date)}</span>
          </div>,
          document.body,
        )}
    </div>
  );
}
