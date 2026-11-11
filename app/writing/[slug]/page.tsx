import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { PageLink } from "@/components/page-link";
import { BackToTop } from "@/components/writing/back-to-top";
import { DIAGRAMS, DIAGRAM_TITLES } from "@/components/writing/diagrams";
import { ExpandableFigure } from "@/components/writing/expandable-figure";
import { ReadTracker } from "@/components/writing/read-tracker";
import { ReadingProgress } from "@/components/writing/reading-progress";
import { POSTS, getPost, readingMinutes } from "@/lib/writing";
import { PERSON_ID, SITE_NAME, absoluteUrl } from "@/lib/site";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  // No `title` on purpose: the tab stays "Tejas Thind" (root layout default).
  // The post title is still used for link previews below.
  return {
    description: post.description,
    authors: post.authors.map((name) => ({ name })),
    alternates: {
      canonical: `/writing/${post.slug}`,
      types: {
        "text/markdown": `/writing/${post.slug}.md`,
        "application/rss+xml": "/writing/feed.xml",
      },
    },
    openGraph: {
      type: "article",
      url: absoluteUrl(`/writing/${post.slug}`),
      siteName: SITE_NAME,
      title: post.title,
      description: post.description,
      authors: post.authors,
      ...(post.date ? { publishedTime: post.date } : {}),
    },
  };
}

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

// Same treatment as the navbar links (colour fade on hover, arrow nudges toward
// its direction), mirrored so the arrow points back.
const linkClass =
  "group inline-flex min-h-10 items-center gap-1.5 rounded-sm text-sm font-normal text-muted-foreground transition-colors duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/40";

function BackArrow() {
  return (
    <span
      aria-hidden="true"
      className="transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-x-0.5"
    >
      ←
    </span>
  );
}

// Type scale follows the rest of the site: 16px body, a serif title the
// same size as the landing heading, small muted metadata. The measure is held
// near 65 characters, with a line height that suits long reading.
export default async function Post({ params }: { params: Promise<Params> }) {
  const post = getPost((await params).slug);
  if (!post) notFound();

  const url = absoluteUrl(`/writing/${post.slug}`);
  // Tejas is a known entity; co-authors are named without inventing profiles.
  const authors = post.authors.map((name) => (name === SITE_NAME ? { "@id": PERSON_ID } : { "@type": "Person", name }));

  return (
    <div className="relative min-h-[100dvh] text-foreground">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "BlogPosting",
              "@id": `${url}#post`,
              mainEntityOfPage: url,
              url,
              headline: post.title,
              description: post.description,
              inLanguage: "en",
              author: authors,
              publisher: { "@id": PERSON_ID },
              isPartOf: { "@id": absoluteUrl("/writing#blog") },
              image: `${url}/opengraph-image`,
              ...(post.date ? { datePublished: post.date, dateModified: post.date } : {}),
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: SITE_NAME, item: absoluteUrl("/") },
                { "@type": "ListItem", position: 2, name: "Writing", item: absoluteUrl("/writing") },
                { "@type": "ListItem", position: 3, name: post.title, item: url },
              ],
            },
          ],
        }}
      />
      <ReadingProgress />
      <main className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-16">
        <article className="max-w-[36rem] pb-20 pt-20 sm:pt-24">
          <PageLink
            href="/writing"
            className={`${linkClass} animate-init animate-blur-in`}
            style={{ animationDelay: "50ms" }}
          >
            <BackArrow />
            Writing
          </PageLink>

          <header className="animate-init animate-blur-in mt-3" style={{ animationDelay: "150ms" }}>
            <h1 className="text-balance font-serif text-3xl font-medium leading-[1.1] tracking-tighter sm:text-4xl">
              {post.title}
            </h1>
            <p className="mt-2.5 text-xs tabular-nums text-muted-foreground">
              By {post.authors.join(" and ")}
              {post.date ? ` · ${formatDate(post.date)}` : ""}
              {` · ${readingMinutes(post)} min read`}
            </p>
          </header>

          <div
            className="animate-init-slide animate-slide-up-fade mt-8"
            style={{ animationDelay: "350ms" }}
          >
            {post.blocks.map((block, i) => {
              if (block.type === "h2") {
                return (
                  <h2
                    key={i}
                    className="mb-2.5 mt-9 font-serif text-xl font-medium leading-snug tracking-[-0.01em] first:mt-0"
                  >
                    {block.text}
                  </h2>
                );
              }
              if (block.type === "figure") {
                const Diagram = DIAGRAMS[block.diagram];
                return (
                  <ExpandableFigure key={i} title={DIAGRAM_TITLES[block.diagram]}>
                    <Diagram />
                  </ExpandableFigure>
                );
              }
              if (block.type === "table") {
                return (
                  <div key={i} className="my-6 overflow-x-auto">
                    <table className="w-full border-collapse text-sm tabular-nums">
                      <thead>
                        <tr className="border-y border-border/60 text-xs text-muted-foreground">
                          {block.columns.map((col, c) => (
                            <th
                              key={col}
                              scope="col"
                              className={`py-2 font-normal ${c === 0 ? "pr-4 text-left" : "px-4 text-right"}`}
                            >
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60 border-b border-border/60">
                        {block.rows.map((row) => (
                          <tr key={row[0]}>
                            {row.map((cell, c) =>
                              c === 0 ? (
                                <th key={c} scope="row" className="py-2.5 pr-4 text-left font-normal text-foreground/90">
                                  {cell}
                                </th>
                              ) : (
                                <td key={c} className="px-4 py-2.5 text-right text-foreground/90">
                                  {cell}
                                </td>
                              ),
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              }
              return (
                <p
                  key={i}
                  className="mb-4 text-base leading-[1.7] text-foreground/90 [text-wrap:pretty]"
                >
                  {block.text}
                </p>
              );
            })}
          </div>

          <ReadTracker slug={post.slug} />

          <footer className="mt-10 flex items-center justify-between border-t border-border/60 pt-3">
            <PageLink href="/writing" className={linkClass}>
              <BackArrow />
              All writing
            </PageLink>
            <BackToTop />
          </footer>
        </article>
      </main>
    </div>
  );
}
