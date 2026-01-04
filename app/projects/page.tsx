"use client"
import Link from "next/link"
import { useThemeToggle } from "@/hooks/use-theme"

export default function Projects() {
  const { isDark, toggleTheme } = useThemeToggle()

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="absolute inset-0 backdrop-blur-sm bg-background/80" />
        <div className="relative flex items-center justify-center px-6 sm:px-8 py-6 sm:py-8 text-sm md:text-base">
          <div className="flex gap-6 sm:gap-8">
            <Link href="/" className="text-foreground transition-all duration-300 hover:-translate-y-1">
              About
            </Link>
            <Link href="/experience" className="text-foreground transition-all duration-300 hover:-translate-y-1">
              Experience
            </Link>
            <Link
              href="/projects"
              className="text-foreground font-medium transition-transform duration-300 hover:-translate-y-1"
            >
              Projects
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-16">
        <section className="min-h-screen py-32 pt-20 sm:pt-24">
          <div className="space-y-16">
            <h2 className="text-4xl sm:text-5xl font-normal">Projects</h2>

            <div className="grid gap-8 lg:grid-cols-2">
              {[
                {
                  title: "The Future of Web Development",
                  excerpt: "Exploring how AI and automation are reshaping the way we build for the web.",
                  date: "Dec 2024",
                  readTime: "5 min",
                },
                {
                  title: "Design Systems at Scale",
                  excerpt: "Lessons learned from building and maintaining design systems across multiple products.",
                  date: "Nov 2024",
                  readTime: "8 min",
                },
                {
                  title: "Performance-First Development",
                  excerpt: "Why performance should be a first-class citizen in your development workflow.",
                  date: "Oct 2024",
                  readTime: "6 min",
                },
                {
                  title: "The Art of Code Review",
                  excerpt: "Building better software through thoughtful and constructive code reviews.",
                  date: "Sep 2024",
                  readTime: "4 min",
                },
              ].map((post, index) => (
                <article
                  key={index}
                  className="group p-8 border border-border rounded-lg hover:border-foreground/50 transition-all duration-500 hover:shadow-lg cursor-pointer"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs text-foreground font-mono">
                      <span>{post.date}</span>
                      <span>{post.readTime}</span>
                    </div>

                    <h3 className="text-xl font-medium text-foreground group-hover:font-semibold transition-all duration-300">
                      {post.title}
                    </h3>

                    <p className="text-foreground leading-relaxed">{post.excerpt}</p>

                    <div className="flex items-center gap-2 text-sm text-foreground group-hover:font-medium transition-all duration-300">
                      <span>Read more</span>
                      <svg
                        className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <footer className="py-16 border-t border-border">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-foreground items-center">
            <a
              href="mailto:tejas.st0544@gmail.com"
              className="text-foreground hover:text-foreground transition-all duration-300 hover:-translate-y-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              Email
            </a>
            <a
              href="https://www.linkedin.com/in/tejas-thind/"
              className="text-foreground hover:text-foreground transition-all duration-300 hover:-translate-y-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            <a
              href="https://x.com/tejasthind4"
              className="text-foreground hover:text-foreground transition-all duration-300 hover:-translate-y-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              X (Twitter)
            </a>
            <a
              href="https://www.instagram.com/tejastnd/"
              className="text-foreground hover:text-foreground transition-all duration-300 hover:-translate-y-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
            <a
              href="https://github.com/Tejas-Thind"
              className="text-foreground hover:text-foreground transition-all duration-300 hover:-translate-y-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <span className="text-foreground">|</span>
            <span className="text-foreground">Appearance:</span>
            <button
              onClick={toggleTheme}
              className="text-foreground hover:text-foreground transition-all duration-300 hover:-translate-y-1 -ml-2"
              aria-label="Toggle theme"
            >
              {isDark ? "☀️" : "🌙"}
            </button>
          </div>
        </footer>
      </main>
    </div>
  )
}
