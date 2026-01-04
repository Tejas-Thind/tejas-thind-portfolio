"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import { WaterlooLogo, RootlyLogo, BoardyLogo, CloverLogo } from "@/components/logos"
import { AnimatedLink } from "@/components/animated-link"

export default function Home() {
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
            <Link href="/" className="text-foreground transition-transform duration-300 hover:-translate-y-1">
              About
            </Link>
            <Link
              href="/experience"
              className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:-translate-y-1"
            >
              Experience
            </Link>
            <Link
              href="/projects"
              className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:-translate-y-1"
            >
              Projects
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-16">
        <header className="flex items-center py-32 pt-20 sm:pt-24">
          <div className="w-full space-y-12 sm:space-y-16">
            <div className="space-y-6 sm:space-y-8">
              <h1 className="text-4xl sm:text-5xl font-light tracking-tight text-muted-foreground">
                Hey, I'm <span className="text-foreground">Tejas</span>
              </h1>

              <p className="text-base sm:text-base text-muted-foreground leading-relaxed max-w-md">
                Management Engineering @{" "}
                <AnimatedLink
                  href="https://uwaterloo.ca/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground"
                >
                  UWaterloo
                </AnimatedLink>
                .
              </p>
            </div>

            <div className="space-y-6">
              <p className="font-semibold text-foreground">Why I Stand Out:</p>
              <div className="space-y-3 text-base text-muted-foreground max-w-3xl">
                <p>
                  Software Engineer Intern at <CloverLogo />{" "}
                  <AnimatedLink
                    href="https://cloverlabs.ai/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground"
                  >
                    Clover Labs
                  </AnimatedLink>
                  , the <span className="text-foreground">fastest</span> growing startup in Canada, building AI growth
                  agents that turn distribution into a system
                </p>
                <p>
                  At <RootlyLogo />{" "}
                  <AnimatedLink
                    href="https://rootly.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground"
                  >
                    Rootly AI
                  </AnimatedLink>{" "}
                  (YC-backed), shipped
                  <span className="text-foreground"> production code</span> in week one and now building
                  <span className="text-foreground"> enterprise tools</span> with senior devs
                </p>
                <p>
                  Sharing my tech journey online on{" "}
                  <AnimatedLink
                    href="https://www.instagram.com/tejastnd/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground"
                  >
                    Instagram
                  </AnimatedLink>
                  , which opens opportunities like becoming a <span className="text-foreground">Growth Fellow</span> and{" "}
                  <span className="text-foreground">Deal Partner</span> at <BoardyLogo />{" "}
                  <AnimatedLink
                    href="https://www.boardy.ai/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground"
                  >
                    Boardy
                  </AnimatedLink>
                  , an AI Super Connector
                </p>
                <p>
                  Received <WaterlooLogo />{" "}
                  <AnimatedLink
                    href="https://uwaterloo.ca/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground"
                  >
                    UWaterloo's
                  </AnimatedLink>{" "}
                  highest Co-op student
                  <span className="text-foreground"> award</span>
                </p>
              </div>
            </div>

            <div className="space-y-6 pt-12">
              <p className="text-lg text-muted-foreground leading-relaxed">
                You can reach out to me at <span className="text-foreground">t3thind[at]uwaterloo[dot]ca</span>
              </p>
            </div>
          </div>
        </header>

        <footer className="py-12 sm:py-16 border-t border-border">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground items-center">
            <a
              href="mailto:tejas.st0544@gmail.com"
              className="hover:text-foreground transition-all duration-300 hover:-translate-y-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              Email
            </a>
            <a
              href="https://www.linkedin.com/in/tejas-thind/"
              className="hover:text-foreground transition-all duration-300 hover:-translate-y-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            <a
              href="https://x.com/tejasthind4"
              className="hover:text-foreground transition-all duration-300 hover:-translate-y-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              X (Twitter)
            </a>
            <a
              href="https://www.instagram.com/tejastnd/"
              className="hover:text-foreground transition-all duration-300 hover:-translate-y-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
            <a
              href="https://github.com/Tejas-Thind"
              className="hover:text-foreground transition-all duration-300 hover:-translate-y-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <button
              onClick={toggleTheme}
              className="ml-auto text-muted-foreground hover:text-foreground transition-all duration-300 hover:-translate-y-1"
              aria-label="Toggle theme"
            >
              {isDark ? "☀️" : "🌙"}
            </button>
          </div>
        </footer>
      </main>

      <div className="fixed bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none"></div>
    </div>
  )
}
