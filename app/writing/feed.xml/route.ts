import { POSTS } from "@/lib/writing";
import { SITE_NAME, absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// RSS 2.0 feed of the writing section, for readers and for agents that
// discover new posts through feeds. Items only carry a pubDate once a post has
// a real publish date.
export function GET() {
  const items = POSTS.map((post) => {
    const url = absoluteUrl(`/writing/${post.slug}`);
    return [
      "    <item>",
      `      <title>${escape(post.title)}</title>`,
      `      <link>${url}</link>`,
      `      <guid isPermaLink="true">${url}</guid>`,
      post.date ? `      <pubDate>${new Date(post.date).toUTCString()}</pubDate>` : null,
      `      <description>${escape(post.description)}</description>`,
      ...post.authors.map((a) => `      <dc:creator>${escape(a)}</dc:creator>`),
      "    </item>",
    ]
      .filter(Boolean)
      .join("\n");
  }).join("\n");

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">',
    "  <channel>",
    `    <title>${escape(SITE_NAME)}: Writing</title>`,
    `    <link>${absoluteUrl("/writing")}</link>`,
    `    <atom:link href="${absoluteUrl("/writing/feed.xml")}" rel="self" type="application/rss+xml" />`,
    "    <description>Essays and notes by Tejas Thind.</description>",
    "    <language>en</language>",
    items,
    "  </channel>",
    "</rss>",
    "",
  ].join("\n");

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
