"use client"
import Link from "next/link"
import { useThemeToggle } from "@/hooks/use-theme"
import { WaterlooLogo, RootlyLogo, BoardyLogo, CloverLogo } from "@/components/logos"
import { AnimatedLink } from "@/components/animated-link"

export default function Home() {
  const { isDark, toggleTheme } = useThemeToggle()

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="absolute inset-0 backdrop-blur-sm bg-background/80" />
        <div className="relative flex items-center justify-center px-6 sm:px-8 py-6 sm:py-8 text-sm md:text-base">
          <div className="flex gap-6 sm:gap-8">
            <Link
              href="/"
              className="text-foreground font-normal transition-transform duration-300 hover:-translate-y-1"
              style={{ textShadow: "0 0 0.6px currentColor, 0 0 0.6px currentColor" }}
            >
              About
            </Link>
            <Link
              href="/experience"
              className="text-foreground font-normal opacity-50 transition-all duration-300 hover:-translate-y-1 hover:opacity-100"
            >
              Experience
            </Link>
            <Link
              href="/projects"
              className="text-foreground font-normal opacity-50 transition-all duration-300 hover:-translate-y-1 hover:opacity-100"
            >
              Projects
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-16">
        <header className="flex items-center py-20 pt-20 sm:pt-24">
          <div className="w-full space-y-6 sm:space-y-8">
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-4xl sm:text-5xl tracking-tight text-foreground font-serif">
                <span className="font-normal italic">Hey, I'm </span>
                <span className="font-semibold italic">Tejas</span>
              </h1>

              <p className="text-base sm:text-base text-foreground leading-relaxed max-w-md">
                Management Engineering @ <WaterlooLogo />
                <AnimatedLink
                  href="https://uwaterloo.ca/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground font-semibold"
                >
                  UWaterloo
                </AnimatedLink>
                .
              </p>
            </div>

            <div className="space-y-3">
              <p className="font-semibold text-foreground">Why I Stand Out:</p>
              <div className="space-y-2 text-base text-foreground max-w-3xl">
                <p className="font-normal">
                  Software Engineer Intern at <CloverLogo />{" "}
                  <AnimatedLink
                    href="https://cloverlabs.ai/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground font-semibold"
                  >
                    Clover Labs
                  </AnimatedLink>
                  , the <span className="font-semibold">fastest</span> growing startup in Canada. On track for{" "}
                  <span className="font-semibold">$50M ARR</span> in 2026, building AI growth agents.
                </p>
                <p className="font-normal">
                  At <RootlyLogo />{" "}
                  <AnimatedLink
                    href="https://rootly.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground font-semibold"
                  >
                    Rootly AI
                  </AnimatedLink>{" "}
                  (YC-backed), shipped <span className="font-semibold">45+ features</span> for
                  <span className="font-semibold"> enterprise customers</span> including Nvidia, Figma, Dropbox,
                  LinkedIn, and Yahoo
                </p>
                <p className="font-normal">
                  Sharing my tech journey online on{" "}
                  <AnimatedLink
                    href="https://www.instagram.com/tejastnd/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground font-semibold"
                  >
                    Instagram
                  </AnimatedLink>
                  , which opens opportunities like becoming a <span className="font-semibold">Growth Fellow</span> and{" "}
                  <span className="font-semibold">Deal Partner</span> at <BoardyLogo />{" "}
                  <AnimatedLink
                    href="https://www.boardy.ai/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground font-semibold"
                  >
                    Boardy
                  </AnimatedLink>
                  , an AI Super Connector
                </p>
                <p className="font-normal">
                  Received <WaterlooLogo />{" "}
                  <AnimatedLink
                    href="https://uwaterloo.ca/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground font-semibold"
                  >
                    UWaterloo's
                  </AnimatedLink>{" "}
                  highest Co-op student <span className="font-semibold">award</span>
                </p>
              </div>
            </div>

            <div>
              <p className="text-base text-foreground leading-relaxed font-normal">
                You can reach out to me at <span className="font-semibold">t3thind[at]uwaterloo[dot]ca</span>
              </p>
            </div>
          </div>
        </header>

        <footer className="pt-4 pb-2 border-t border-border">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground items-center">
            <a
              href="mailto:tejas.st0544@gmail.com"
              className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:-translate-y-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              Email
            </a>
            <a
              href="https://www.linkedin.com/in/tejas-thind/"
              className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:-translate-y-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            <a
              href="https://x.com/tejasthind4"
              className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:-translate-y-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              X (Twitter)
            </a>
            <a
              href="https://www.instagram.com/tejastnd/"
              className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:-translate-y-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
            <a
              href="https://github.com/Tejas-Thind"
              className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:-translate-y-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <span className="text-muted-foreground">|</span>
            <span className="text-muted-foreground">Appearance:</span>
            <button
              onClick={toggleTheme}
              className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:-translate-y-1 -ml-2 cursor-pointer"
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
