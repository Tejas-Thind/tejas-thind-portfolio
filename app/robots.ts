import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Everything is public and meant to be found, so crawlers are welcome, AI
// search and answer-engine bots included. They are named explicitly so the
// intent is unambiguous and survives a stricter default being added later.
const AI_AGENTS = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "GPTBot",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot",
  "Applebot-Extended",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: "/api/" },
      { userAgent: AI_AGENTS, allow: "/", disallow: "/api/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
