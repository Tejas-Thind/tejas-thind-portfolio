"use client";
import { useEffect, useState } from "react";
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
const PALETTE = [
  "var(--scramble-amber)",
  "var(--scramble-coral)",
  "var(--scramble-violet)",
  "var(--scramble-blue)",
  "var(--scramble-green)",
  "var(--scramble-cyan)",
];

const CYCLE_INTERVAL_MS = 60 * 1000;

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

      {/* Cell size stays fixed (matches GitHub's own proportions) so squares
          never balloon on a wide viewport; the leftover horizontal space is
          spent as extra gap between columns (justify-content: space-between)
          instead, so the grid's own left/right edges still land exactly
          under the stats text above. overflow-x-auto is a safety net for
          the narrowest viewports where 53 fixed-width columns don't fit. */}
      <div className="overflow-x-auto [--cell-size:5px] sm:[--cell-size:8px]">
        <div
          className="grid w-full"
          style={{
            gridTemplateColumns: `repeat(${weeks.length}, var(--cell-size))`,
            gridTemplateRows: "repeat(7, var(--cell-size))",
            gridAutoFlow: "column",
            rowGap: "1.5px",
            justifyContent: "space-between",
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
