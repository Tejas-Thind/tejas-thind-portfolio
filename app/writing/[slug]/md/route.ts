import { POSTS, getPost, postToMarkdown } from "@/lib/writing";
import { absoluteUrl } from "@/lib/site";

// Markdown copy of an article, served at /writing/<slug>.md (see the rewrite in
// next.config.mjs) so agents can read it without parsing the page.
export const dynamicParams = false;

export function generateStaticParams() {
  return POSTS.map((post) => ({ slug: post.slug }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const post = getPost((await params).slug);
  if (!post) return new Response("Not found", { status: 404 });
  return new Response(postToMarkdown(post, absoluteUrl(`/writing/${post.slug}`)), {
    headers: { "Content-Type": "text/markdown; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
