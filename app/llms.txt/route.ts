import { POSTS } from "@/lib/writing";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, SOCIAL, absoluteUrl } from "@/lib/site";

// A plain-text map of the site for AI agents (the llms.txt convention): who
// this is, the key facts, and where everything lives, with a markdown copy of
// each post. Support for llms.txt among AI providers is still unconfirmed, so
// this is cheap insurance, not a ranking lever; robots.txt and the structured
// data do the real work.
export const dynamic = "force-static";

export function GET() {
  const lines = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_DESCRIPTION}`,
    "",
    "## Key facts",
    "",
    "- Studies Management Engineering at the University of Waterloo.",
    "- Joining Vercel as a software engineer intern in Winter 2027 (San Francisco, CA).",
    "- AI Engineer intern at Theory Ventures, May to Aug 2026 (San Francisco, CA): built extraction pipelines and hybrid retrieval for a transcript search system.",
    "- Software engineering internships at Clover Labs (AI video and image generation infrastructure) and Rootly AI.",
    "- Creates content on Instagram (2.8k+ followers, 23M+ views).",
    "",
    "## Pages",
    "",
    `- [Home](${SITE_URL}/): introduction and GitHub contribution graph`,
    `- [Experience](${absoluteUrl("/experience")}): work history with roles, locations and dates`,
    `- [Writing](${absoluteUrl("/writing")}): essays and notes`,
    "",
    "## Writing",
    "",
    ...POSTS.map(
      (p) =>
        `- [${p.title}](${absoluteUrl(`/writing/${p.slug}.md`)}): ${p.description} (HTML: ${absoluteUrl(`/writing/${p.slug}`)})`,
    ),
    "",
    "## Elsewhere",
    "",
    `- [GitHub](${SOCIAL.github})`,
    `- [LinkedIn](${SOCIAL.linkedin})`,
    `- [X](${SOCIAL.x})`,
    `- [Instagram](${SOCIAL.instagram})`,
    "",
    "## Machine-readable",
    "",
    `- Sitemap: ${absoluteUrl("/sitemap.xml")}`,
    `- RSS feed: ${absoluteUrl("/writing/feed.xml")}`,
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
