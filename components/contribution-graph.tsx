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

// Gap is solved as a fixed fraction of cell size (GAP_RATIO), and both are
// solved together from the container's measured width - a continuous
// function of width, not a mobile/desktop breakpoint switch, so the
// gap:cell ratio stays constant (and tight) at every width instead of
// ballooning in between breakpoints. MAX_CELL_PX caps it from looking too
// big on wide screens; past that cap the gap keeps growing instead so the
// grid still lines up exactly under the stats text above.
const GAP_RATIO = 0.25;
const ROWS = 7;
const MIN_CELL_PX = 3;
const MAX_CELL_PX = 10;
const FALLBACK_CELL_PX = 8;
const FALLBACK_GAP_PX = 2;

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
  const [cellPx, setCellPx] = useState(FALLBACK_CELL_PX);
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
    if (!el || columnCount < 2) return;

    const measure = () => {
      const width = el.clientWidth;
      // Solving 53*cell + 52*(GAP_RATIO*cell) = width for cell keeps the
      // gap:cell ratio fixed while still filling the width exactly.
      const rawCell = width / (columnCount + (columnCount - 1) * GAP_RATIO);
      const size = Math.min(MAX_CELL_PX, Math.max(MIN_CELL_PX, rawCell));
      // Once clamped, re-solve the gap alone so the grid still fills the
      // width exactly - the ratio just no longer holds at that extreme.
      const gap = (width - size * columnCount) / (columnCount - 1);
      setCellPx(size);
      setGapPx(Math.max(gap, 0));
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

      {/* Cell size and gap are solved together from the container's
          actually-measured width (via ResizeObserver), keeping gap a fixed
          fraction (GAP_RATIO) of cell size - applied equally to rows and
          columns - so spacing reads consistent at any width instead of
          jumping at a breakpoint, while the grid still lines up exactly
          under the stats text above. overflow-x-auto is a safety net for
          the rare case a container is narrower than MIN_CELL_PX allows. */}
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
