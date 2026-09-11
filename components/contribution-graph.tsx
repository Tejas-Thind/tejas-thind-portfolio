"use client";
import { useEffect, useState } from "react";
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

export function ContributionGraph() {
  const [data, setData] = useState<ContributionData | null>(null);
  const [failed, setFailed] = useState(false);

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

  if (failed) return null;

  return (
    <div className="rounded-lg border border-border/70 bg-background/35 p-4 sm:p-5">
      <div className="overflow-x-auto">
        <div className="flex gap-[3px]" style={{ minWidth: "max-content" }}>
          {(data?.weeks ?? Array.from({ length: 53 }, () => ({ days: [] }))).map(
            (week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-[3px]">
                {Array.from({ length: 7 }, (_, dayIndex) => {
                  const day = week.days[dayIndex];
                  const opacity = day ? LEVEL_OPACITY[day.level] : 0.06;
                  return (
                    <div
                      key={dayIndex}
                      title={day ? `${day.count} contributions on ${day.date}` : undefined}
                      className="h-[10px] w-[10px] rounded-[2px]"
                      style={{ backgroundColor: `var(--accent-primary)`, opacity }}
                    />
                  );
                })}
              </div>
            ),
          )}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {data ? data.total.toLocaleString() : "..."} contributions in the past year
        </span>
        <AnimatedLink
          href="https://github.com/Tejas-Thind"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground"
        >
          @Tejas-Thind ↗
        </AnimatedLink>
      </div>
    </div>
  );
}
