"use client";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import {
  WaterlooLogo,
  RootlyLogo,
  BoardyLogo,
  CloverLogo,
  TheoryLogo,
  StanLogo,
  PolarityLogo,
} from "@/components/logos";
import { AnimatedLink } from "@/components/animated-link";
import { CmdKHint } from "@/components/command-palette";
import { CountUp } from "@/components/count-up";
import { TextScramble } from "@/components/text-scramble";
import { useEffect, useState } from "react";

export default function Home() {
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
    return isFirstLoad ? baseDelay + 800 : baseDelay;
  };

  return (
    <div className="min-h-[100dvh] text-foreground relative">
      <SiteNav />

      <main className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-16">
        <header className="flex items-center py-20 pt-20 sm:pt-28">
          <div className="w-full space-y-8 sm:space-y-10">
            <div
              className="space-y-3 sm:space-y-4 animate-init animate-blur-in"
              style={{ animationDelay: `${getDelay(400)}ms` }}
            >
              <h1 className="text-5xl sm:text-6xl tracking-tighter text-foreground font-serif leading-none">
                <span className="font-normal italic">Hey, I&apos;m </span>
                <span className="font-semibold italic">
                  <TextScramble
                    text="Tejas"
                    delay={getDelay(400)}
                    duration={1000}
                  />
                </span>
              </h1>

              <p className="text-base text-foreground leading-relaxed max-w-md">
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
              className="space-y-4 animate-init animate-blur-in"
              style={{ animationDelay: `${getDelay(600)}ms` }}
            >
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Why I Stand Out</p>

              <div className="divide-y divide-border/40">
                <div className="flex gap-5 py-4 first:pt-0">
                  <span className="font-mono text-xs text-muted-foreground/40 pt-[0.3rem] w-5 flex-shrink-0 select-none tabular-nums">01</span>
                  <p className="text-base text-foreground leading-relaxed font-normal">
                    Engineering Intern at <TheoryLogo />{" "}
                    <AnimatedLink
                      href="https://www.theoryvc.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground font-semibold"
                    >
                      Theory Ventures
                    </AnimatedLink>
                    , building data infrastructure for deep, thesis-driven investing.
                  </p>
                </div>

                <div className="flex gap-5 py-4">
                  <span className="font-mono text-xs text-muted-foreground/40 pt-[0.3rem] w-5 flex-shrink-0 select-none tabular-nums">02</span>
                  <p className="text-base text-foreground leading-relaxed font-normal">
                    SWE Intern at <CloverLogo />{" "}
                    <AnimatedLink
                      href="https://cloverlabs.ai/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground font-semibold"
                    >
                      Clover Labs
                    </AnimatedLink>
                    , building infrastructure for AI video and image generation.
                  </p>
                </div>

                <div className="flex gap-5 py-4">
                  <span className="font-mono text-xs text-muted-foreground/40 pt-[0.3rem] w-5 flex-shrink-0 select-none tabular-nums">03</span>
                  <p className="text-base text-foreground leading-relaxed font-normal">
                    At <RootlyLogo />{" "}
                    <AnimatedLink
                      href="https://rootly.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground font-semibold"
                    >
                      Rootly AI
                    </AnimatedLink>{" "}
                    (YC S21), shipped{" "}
                    <span className="font-semibold">
                      <CountUp to={45} suffix="+" /> features
                    </span>{" "}
                    used by Nvidia, Figma, Dropbox, LinkedIn & Yahoo
                  </p>
                </div>

                <div className="flex gap-5 py-4 last:pb-0">
                  <span className="font-mono text-xs text-muted-foreground/40 pt-[0.3rem] w-5 flex-shrink-0 select-none tabular-nums">04</span>
                  <p className="text-base text-foreground leading-relaxed font-normal">
                    Sharing my journey on{" "}
                    <AnimatedLink
                      href="https://www.instagram.com/tejastnd/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground font-semibold"
                    >
                      Instagram
                    </AnimatedLink>
                    {" "}opened doors to do <span className="font-semibold">Growth</span> at{" "}
                    <BoardyLogo />{" "}
                    <AnimatedLink
                      href="https://www.boardy.ai/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground font-semibold"
                    >
                      Boardy
                    </AnimatedLink>
                    ,{" "}
                    <StanLogo />{" "}
                    <AnimatedLink
                      href="https://www.stan.store"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground font-semibold"
                    >
                      Stan
                    </AnimatedLink>
                    , and{" "}
                    <PolarityLogo />{" "}
                    <AnimatedLink
                      href="https://www.polarity.so"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground font-semibold"
                    >
                      Polarity
                    </AnimatedLink>
                  </p>
                </div>
              </div>
            </div>

            <div
              className="animate-init animate-blur-in"
              style={{ animationDelay: `${getDelay(800)}ms` }}
            >
              <p className="text-base text-foreground leading-relaxed font-normal">
                You can reach out to me at{" "}
                <a
                  href="mailto:t3thind@uwaterloo.ca"
                  className="font-semibold hover:opacity-60 transition-opacity duration-200"
                >
                  t3thind[at]uwaterloo[dot]ca
                </a>
              </p>
            </div>
          </div>
        </header>

        <SiteFooter
          animated
          animationDelay={getDelay(1000)}
          className="pt-4 pb-6"
        />
      </main>

      <div className="fixed bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />
    </div>
  );
}
