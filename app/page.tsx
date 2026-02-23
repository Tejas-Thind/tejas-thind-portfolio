"use client";
import Link from "next/link";
import { useThemeToggle } from "@/hooks/use-theme";
import {
  WaterlooLogo,
  RootlyLogo,
  BoardyLogo,
  CloverLogo,
  TheoryLogo,
} from "@/components/logos";
import { AnimatedLink } from "@/components/animated-link";
import { CmdKHint } from "@/components/command-palette";
import { CountUp } from "@/components/count-up";
import { TextScramble } from "@/components/text-scramble";
import { useEffect, useState } from "react";

export default function Home() {
  const { isDark, toggleTheme } = useThemeToggle();
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    const hasVisited = sessionStorage.getItem("hasVisited");
    if (hasVisited) {
      setIsFirstLoad(false);
    } else {
      sessionStorage.setItem("hasVisited", "true");
    }
  }, []);

  const getDelay = (baseDelay: number) => {
    return isFirstLoad ? baseDelay + 800 : baseDelay; // Add 800ms extra delay on first load
  };

  return (
    <div className="min-h-screen text-foreground relative">
      <nav
        className="fixed top-0 left-0 right-0 z-50 animate-init animate-blur-in"
        style={{ animationDelay: `${getDelay(200)}ms` }}
      >
        <div className="absolute inset-0 backdrop-blur-sm bg-background/80" />
        <div className="relative flex items-center justify-center px-6 sm:px-8 py-6 sm:py-8 text-sm md:text-base">
          <div className="flex gap-6 sm:gap-8">
            <Link
              href="/"
              className="text-foreground font-normal hover-lift"
              style={{
                textShadow: "0 0 0.6px currentColor, 0 0 0.6px currentColor",
              }}
            >
              About
            </Link>
            <Link
              href="/experience"
              className="text-foreground font-normal opacity-50 hover-lift hover:opacity-100"
            >
              Experience
            </Link>
            <Link
              href="/projects"
              className="text-foreground font-normal opacity-50 hover-lift hover:opacity-100"
            >
              Projects
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-16">
        <header className="flex items-center py-20 pt-20 sm:pt-24">
          <div className="w-full space-y-6 sm:space-y-8">
            <div
              className="space-y-3 sm:space-y-4 animate-init animate-blur-in"
              style={{ animationDelay: `${getDelay(400)}ms` }}
            >
              <h1 className="text-4xl sm:text-5xl tracking-tight text-foreground font-serif">
                <span className="font-normal italic">Hey, I'm </span>
                <span className="font-semibold italic">
                  <TextScramble
                    text="Tejas"
                    delay={getDelay(400)}
                    duration={1000}
                  />
                </span>
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

            <div
              className="space-y-3 animate-init animate-blur-in"
              style={{ animationDelay: `${getDelay(600)}ms` }}
            >
              <p className="font-semibold text-foreground">Why I Stand Out:</p>
              <div className="space-y-2 text-base text-foreground max-w-3xl">
                <p className="font-normal">
                  Incoming at <TheoryLogo />{" "}
                  <AnimatedLink
                    href="https://www.theoryvc.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground font-semibold"
                  >
                    Theory Ventures
                  </AnimatedLink>{" "}
                  as a{" "}
                  <span className="font-semibold">
                    Data Science Engineer Intern
                  </span>
                  , getting an insider's view into how a top-tier VC firm
                  operates.
                </p>
                <p className="font-normal">
                  Current Software Engineer Intern at <CloverLogo />{" "}
                  <AnimatedLink
                    href="https://cloverlabs.ai/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground font-semibold"
                  >
                    Clover Labs
                  </AnimatedLink>
                  (Neo-backed), building{" "}
                  <span className="font-semibold">Echos</span>, an AI-powered
                  platform for social video automation.
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
                  (YC-backed), shipped{" "}
                  <span className="font-semibold">
                    <CountUp to={45} suffix="+" /> features
                  </span>{" "}
                  used by Nvidia, Figma, Dropbox, LinkedIn, and Yahoo
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
                  , which opens opportunities like becoming a{" "}
                  <span className="font-semibold">Growth Fellow</span> and{" "}
                  <span className="font-semibold">Deal Partner</span> at{" "}
                  <BoardyLogo />{" "}
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
              </div>
            </div>

            <div
              className="animate-init animate-blur-in"
              style={{ animationDelay: `${getDelay(800)}ms` }}
            >
              <p className="text-base text-foreground leading-relaxed font-normal">
                You can reach out to me at{" "}
                <span className="font-semibold">
                  t3thind[at]uwaterloo[dot]ca
                </span>
              </p>
            </div>
          </div>
        </header>

        <footer
          className="pt-4 pb-2 border-t border-border animate-init animate-blur-in"
          style={{ animationDelay: `${getDelay(1000)}ms` }}
        >
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground items-center">
            <a
              href="mailto:t3thind@uwaterloo.ca"
              className="text-muted-foreground hover:text-foreground hover-lift"
              target="_blank"
              rel="noopener noreferrer"
            >
              Email
            </a>
            <a
              href="https://www.linkedin.com/in/tejas-thind/"
              className="text-muted-foreground hover:text-foreground hover-lift"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            <a
              href="https://x.com/tejasthind4"
              className="text-muted-foreground hover:text-foreground hover-lift"
              target="_blank"
              rel="noopener noreferrer"
            >
              X (Twitter)
            </a>
            <a
              href="https://www.instagram.com/tejastnd/"
              className="text-muted-foreground hover:text-foreground hover-lift"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
            <a
              href="https://github.com/Tejas-Thind"
              className="text-muted-foreground hover:text-foreground hover-lift"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <span className="text-muted-foreground">|</span>
            <span className="text-muted-foreground">Appearance:</span>
            <button
              onClick={toggleTheme}
              className="text-muted-foreground hover:text-foreground hover-lift -ml-2 cursor-pointer"
              aria-label="Toggle theme"
            >
              {isDark ? "☀️" : "🌙"}
            </button>
            <span className="text-muted-foreground">|</span>
            <CmdKHint />
          </div>
        </footer>
      </main>

      <div className="fixed bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none"></div>
    </div>
  );
}
