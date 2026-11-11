import { NextResponse } from "next/server";

const GITHUB_USERNAME = "Tejas-Thind";

const QUERY = `
  query($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              contributionLevel
            }
          }
        }
      }
    }
  }
`;

type ContributionDay = {
  date: string;
  contributionCount: number;
  contributionLevel:
    | "NONE"
    | "FIRST_QUARTILE"
    | "SECOND_QUARTILE"
    | "THIRD_QUARTILE"
    | "FOURTH_QUARTILE";
};

type GitHubGraphQLResponse = {
  data?: {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: number;
          weeks: { contributionDays: ContributionDay[] }[];
        };
      };
    } | null;
  };
  errors?: { message: string }[];
};

export async function GET() {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    // Dev fallback: no token locally, so return sample data instead of failing,
    // so the contribution graph still renders while developing. Production has
    // GITHUB_TOKEN set and returns real data.
    const levels = [
      "NONE",
      "FIRST_QUARTILE",
      "SECOND_QUARTILE",
      "THIRD_QUARTILE",
      "FOURTH_QUARTILE",
    ] as const;
    const WEEKS = 53;
    const start = new Date();
    start.setDate(start.getDate() - (WEEKS * 7 - 1));
    let total = 0;
    const weeks = Array.from({ length: WEEKS }, (_, w) => ({
      days: Array.from({ length: 7 }, (_, d) => {
        const date = new Date(start);
        date.setDate(start.getDate() + w * 7 + d);
        const r = Math.random();
        const li = r < 0.22 ? 0 : r < 0.5 ? 1 : r < 0.75 ? 2 : r < 0.92 ? 3 : 4;
        const count = li === 0 ? 0 : li * 3 + Math.floor(Math.random() * 6);
        total += count;
        return {
          date: date.toISOString().slice(0, 10),
          count,
          level: levels[li],
        };
      }),
    }));
    return NextResponse.json({ total, weeks });
  }

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: QUERY, variables: { login: GITHUB_USERNAME } }),
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: `GitHub API responded with ${res.status}` },
      { status: 502 },
    );
  }

  const json: GitHubGraphQLResponse = await res.json();

  if (json.errors?.length || !json.data?.user) {
    return NextResponse.json(
      { error: json.errors?.[0]?.message ?? "No contribution data returned." },
      { status: 502 },
    );
  }

  const calendar = json.data.user.contributionsCollection.contributionCalendar;

  return NextResponse.json({
    total: calendar.totalContributions,
    weeks: calendar.weeks.map((week) => ({
      days: week.contributionDays.map((day) => ({
        date: day.date,
        count: day.contributionCount,
        level: day.contributionLevel,
      })),
    })),
  });
}
