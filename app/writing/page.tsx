import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { PostRow } from "@/components/writing/post-row";
import { POSTS, readingMinutes } from "@/lib/writing";
import { PERSON_ID, SITE_NAME, absoluteUrl } from "@/lib/site";

// No title here on purpose: the tab keeps the site title, "Tejas Thind", set in the root layout.
const description = "Essays and notes by Tejas Thind.";

export const metadata: Metadata = {
  description,
  alternates: { canonical: "/writing", types: { "application/rss+xml": "/writing/feed.xml" } },
  openGraph: {
    type: "website",
    url: absoluteUrl("/writing"),
    title: SITE_NAME,
    description,
    siteName: SITE_NAME,
    images: ["/opengraph-image"],
  },
};

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", { month: "short", year: "numeric" });

// A plain list: hairline-separated rows, small type, metadata to the right.
// Hover lighting lives in PostRow.
export default function Writing() {
  return (
    <div className="relative min-h-[100dvh] text-foreground">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Blog",
          "@id": absoluteUrl("/writing#blog"),
          url: absoluteUrl("/writing"),
          name: `${SITE_NAME}: Writing`,
          description,
          author: { "@id": PERSON_ID },
          blogPost: POSTS.map((post) => ({
            "@type": "BlogPosting",
            headline: post.title,
            url: absoluteUrl(`/writing/${post.slug}`),
            ...(post.date ? { datePublished: post.date } : {}),
          })),
        }}
      />
      <main className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-16">
        <section className="pb-20 pt-20 sm:pt-24">
          <h1
            className="animate-init animate-blur-in font-serif text-3xl font-medium leading-[1.1] tracking-tighter sm:text-4xl"
            style={{ animationDelay: "100ms" }}
          >
            Writing
          </h1>

          {POSTS.length === 0 ? (
            <p
              className="animate-init animate-blur-in mt-6 text-sm text-muted-foreground"
              style={{ animationDelay: "250ms" }}
            >
              Writing is fun but kinda hard. First post coming soon.
            </p>
          ) : (
          <ul
            className="animate-init animate-blur-in -mx-3 mt-6 divide-y divide-border/60 border-y border-border/60"
            style={{ animationDelay: "250ms" }}
          >
            {POSTS.map((post) => {
              const meta = [
                post.date ? formatDate(post.date) : null,
                `${readingMinutes(post)} min read`,
              ].filter(Boolean);
              return (
                <li key={post.slug}>
                  <PostRow href={`/writing/${post.slug}`}>
                    <div className="grid gap-1.5 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-6">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h2 className="font-serif text-lg font-medium leading-snug tracking-[-0.01em]">
                            {post.title}
                          </h2>
                          <ArrowUpRight
                            className="h-3.5 w-3.5 shrink-0 -translate-x-0.5 -translate-y-px text-muted-foreground opacity-0 transition-[opacity,translate] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0 group-hover:opacity-50"
                            strokeWidth={1.5}
                            aria-hidden="true"
                          />
                        </div>
                        <p className="mt-1 text-sm leading-relaxed text-foreground/65">
                          {post.description}
                        </p>
                      </div>
                      <p className="text-xs tabular-nums text-muted-foreground sm:text-right">
                        {meta.join(" · ")}
                      </p>
                    </div>
                  </PostRow>
                </li>
              );
            })}
          </ul>
          )}
        </section>
      </main>
    </div>
  );
}
