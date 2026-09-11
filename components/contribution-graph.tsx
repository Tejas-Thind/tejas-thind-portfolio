"use client";
import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { AnimatedLink } from "@/components/animated-link";

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
  const [colorIndex, setColorIndex] = useState(() =>
    Math.floor(Math.random() * PALETTE.length),
  );

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
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      setColorIndex((i) => (i + 1) % PALETTE.length);
    }, CYCLE_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  if (failed) return null;

  const activeColor = PALETTE[colorIndex];

  return (
    <div className="rounded-lg border border-border/70 bg-background/35 p-3 sm:p-5">
      <div className="overflow-x-auto">
        <div className="flex gap-[2px] sm:gap-[3px]" style={{ minWidth: "max-content" }}>
          {(data?.weeks ?? Array.from({ length: 53 }, () => ({ days: [] }))).map(
            (week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-[2px] sm:gap-[3px]">
                {Array.from({ length: 7 }, (_, dayIndex) => {
                  const day = week.days[dayIndex];
                  const opacity = day ? LEVEL_OPACITY[day.level] : 0.06;
                  return (
                    <div
                      key={dayIndex}
                      title={day ? `${day.count} contributions on ${day.date}` : undefined}
                      className="h-[8px] w-[8px] rounded-[2px] sm:h-[10px] sm:w-[10px]"
                      style={{
                        backgroundColor: activeColor,
                        opacity,
                        transition: "background-color 900ms cubic-bezier(0.32, 0.72, 0, 1)",
                        transitionDelay: `${weekIndex * 10}ms`,
                      }}
                    />
                  );
                })}
              </div>
            ),
          )}
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground sm:mt-3">
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
    </div>
  );
}
