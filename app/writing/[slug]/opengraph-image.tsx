import { ImageResponse } from "next/og";
import { POSTS, getPost } from "@/lib/writing";
import { SITE_NAME } from "@/lib/site";

export const alt = "Article by Tejas Thind";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return POSTS.map((post) => ({ slug: post.slug }));
}

// Share card for an article: the title large on a dark card, authors below.
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const post = getPost((await params).slug);
  const title = post?.title ?? SITE_NAME;
  const byline = post ? `By ${post.authors.join(" and ")}` : "";
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#141414",
          color: "#f4f4f4",
        }}
      >
        <div style={{ fontSize: 30, opacity: 0.6 }}>{`${SITE_NAME} · Writing`}</div>
        <div style={{ fontSize: 82, fontWeight: 600, letterSpacing: -2, lineHeight: 1.08 }}>{title}</div>
        <div style={{ fontSize: 34, opacity: 0.7 }}>{byline}</div>
      </div>
    ),
    size,
  );
}
