"use client"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function Experience() {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
  }, [isDark])

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="absolute inset-0 backdrop-blur-sm bg-background/80" />
        <div className="relative flex items-center justify-center px-6 sm:px-8 py-6 sm:py-8 text-sm md:text-base">
          <div className="flex gap-6 sm:gap-8">
            <Link href="/" className="text-foreground transition-all duration-300 hover:-translate-y-1">
              About
            </Link>
            <Link
              href="/experience"
              className="text-foreground font-medium transition-transform duration-300 hover:-translate-y-1"
            >
              Experience
            </Link>
            <Link href="/projects" className="text-foreground transition-all duration-300 hover:-translate-y-1">
              Projects
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-16">
        <section className="min-h-screen py-32 pt-20 sm:pt-24">
          <div className="space-y-16">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <h2 className="text-4xl sm:text-5xl font-light">Experience</h2>
            </div>

            <div className="space-y-12">
              {[
                {
                  year: "2023",
                  role: "Senior Frontend Engineer",
                  company: "Vercel",
                  description: "Leading frontend architecture for developer tools and AI-powered features.",
                  tech: ["React", "TypeScript", "Next.js"],
                },
                {
                  year: "2022",
                  role: "Frontend Engineer",
                  company: "Linear",
                  description: "Built performant interfaces for project management and team collaboration.",
                  tech: ["React", "GraphQL", "Framer Motion"],
                },
                {
                  year: "2021",
                  role: "Full Stack Developer",
                  company: "Stripe",
                  description: "Developed payment infrastructure and merchant-facing dashboard features.",
                  tech: ["Ruby", "React", "PostgreSQL"],
                },
                {
                  year: "2019",
                  role: "Software Engineer",
                  company: "Airbnb",
                  description: "Created booking flow optimizations and host management tools.",
                  tech: ["React", "Node.js", "MySQL"],
                },
              ].map((job, index) => (
                <div
                  key={index}
                  className="group grid lg:grid-cols-12 gap-8 py-8 border-b border-border/50 hover:border-border transition-colors duration-500"
                >
                  <div className="lg:col-span-2">
                    <div className="text-2xl font-normal text-foreground group-hover:font-medium transition-all duration-500">
                      {job.year}
                    </div>
                  </div>

                  <div className="lg:col-span-6 space-y-3">
                    <div>
                      <h3 className="text-xl font-medium text-foreground">{job.role}</h3>
                      <div className="text-foreground">{job.company}</div>
                    </div>
                    <p className="text-foreground leading-relaxed max-w-lg">{job.description}</p>
                  </div>

                  <div className="lg:col-span-4 flex flex-wrap gap-2 lg:justify-end mt-2 lg:mt-0">
                    {job.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 text-xs text-foreground rounded group-hover:border-foreground/50 transition-colors duration-500"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
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
