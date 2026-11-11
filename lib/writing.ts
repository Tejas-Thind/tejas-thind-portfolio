export type Block =
  | { type: "h2"; text: string }
  | { type: "p"; text: string }
  | { type: "figure"; diagram: string }
  | { type: "table"; columns: string[]; rows: string[][] };

export type Post = {
  slug: string;
  title: string;
  authors: string[];
  // Shown on the index and used for the page's meta description.
  description: string;
  // ISO date (YYYY-MM-DD). Left off until there is a publish date to show.
  date?: string;
  blocks: Block[];
};

export const POSTS: Post[] = [];

export const getPost = (slug: string) => POSTS.find((p) => p.slug === slug);

// ~230 words per minute, rounded up, never below one minute
export function readingMinutes(post: Post) {
  const words = post.blocks.reduce(
    (n, b) => (b.type === "p" || b.type === "h2" ? n + b.text.split(/\s+/).length : n),
    0,
  );
  return Math.max(1, Math.ceil(words / 230));
}

// Plain-language descriptions of the diagrams. Used as the SVGs' accessible
// names and as the text stand-in for each figure in the markdown version and
// feed, so a reader (or agent) that can't see the drawing still gets it.
export const FIGURE_DESCRIPTIONS: Record<string, string> = {};

// The whole post as markdown, for agents and the llms.txt links.
export function postToMarkdown(post: Post, url: string) {
  const out: string[] = [
    `# ${post.title}`,
    "",
    `By ${post.authors.join(" and ")}${post.date ? ` · ${post.date}` : ""}`,
    "",
    `Source: ${url}`,
    "",
  ];
  for (const b of post.blocks) {
    if (b.type === "h2") out.push(`## ${b.text}`, "");
    else if (b.type === "p") out.push(b.text, "");
    else if (b.type === "figure") out.push(`*Diagram: ${FIGURE_DESCRIPTIONS[b.diagram]}*`, "");
    else {
      out.push(
        `| ${b.columns.join(" | ")} |`,
        `| ${b.columns.map(() => "---").join(" | ")} |`,
        ...b.rows.map((r) => `| ${r.join(" | ")} |`),
        "",
      );
    }
  }
  return out.join(String.fromCharCode(10));
}
