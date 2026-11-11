import type { MetadataRoute } from "next";
import { POSTS } from "@/lib/writing";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://tejasthind.com",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: "https://tejasthind.com/experience",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://tejasthind.com/writing",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...POSTS.map((post) => ({
      url: `https://tejasthind.com/writing/${post.slug}`,
      lastModified: post.date ? new Date(post.date) : new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}
