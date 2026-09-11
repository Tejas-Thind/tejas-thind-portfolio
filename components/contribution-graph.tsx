"use client";
import { useEffect, useState } from "react";
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

export function ContributionGraph() {
  const [data, setData] = useState<ContributionData | null>(null);
  const [failed, setFailed] = useState(false);
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

  return (
    <div className="rounded-lg border border-border/70 bg-background/35 p-2 sm:p-4">
      <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground sm:mb-3">
        <span>
          {data ? data.total.toLocaleString() : "..."} contributions in the past year
        </span>
        <AnimatedLink
          href="https://github.com/Tejas-Thind"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-muted-foreground"
        >
          @Tejas-Thind
          <ExternalLink className="h-3 w-3" strokeWidth={1.5} aria-hidden="true" />
        </AnimatedLink>
      </div>

      <div className="overflow-x-auto">
        {/* w-full + justify-between with min-width:max-content: when the grid's
            natural width fits the card, gaps stretch so the last column lands
            flush with the right edge (matches the left edge exactly). When it
            doesn't fit (mobile), min-width wins and this scrolls instead of
            squishing. */}
        <div
          className="flex w-full justify-between gap-[1px] sm:gap-[2px]"
          style={{ minWidth: "max-content" }}
        >
          {(data?.weeks ?? Array.from({ length: 53 }, () => ({ days: [] }))).map(
            (week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-[1px] sm:gap-[2px]">
                {Array.from({ length: 7 }, (_, dayIndex) => {
                  const day = week.days[dayIndex];
                  const opacity = day ? LEVEL_OPACITY[day.level] : 0.06;
                  return (
                    <div
                      key={dayIndex}
                      title={day ? `${day.count} contributions on ${day.date}` : undefined}
                      className="h-[6px] w-[6px] rounded-[3px] sm:h-[8px] sm:w-[8px]"
                      style={{
                        backgroundColor: activeColor,
                        opacity,
                        transition: `background-color 900ms cubic-bezier(0.32, 0.72, 0, 1) ${weekIndex * 10}ms`,
                      }}
                    />
                  );
                })}
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
