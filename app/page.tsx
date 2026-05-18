"use client";
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
import { SiteFooter } from "@/components/site-footer";
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
      <main className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-16">
        <header className="flex items-center py-20 pt-20 sm:pt-24">
          <div className="w-full space-y-6 sm:space-y-8">
            <div
              className="space-y-3 sm:space-y-4 animate-init animate-blur-in"
              style={{ animationDelay: `${getDelay(400)}ms` }}
            >
              <h1 className="text-4xl sm:text-5xl tracking-tight text-foreground font-serif">
                <span className="font-normal italic">Hey, I&apos;m </span>
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
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Why I Stand Out</p>
              <div className="space-y-3 text-base text-foreground max-w-3xl">
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
                  , getting an insider&apos;s view into how a top-tier VC firm
                  operates.
                </p>
                <p className="font-normal">
                  Software Engineer Intern at <CloverLogo />{" "}
                  <AnimatedLink
                    href="https://cloverlabs.ai/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground font-semibold"
                  >
                    Clover Labs
                  </AnimatedLink>{" "}
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
                  <span className="font-semibold">Growth Fellow</span> at{" "}
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

        <SiteFooter animated animationDelay={getDelay(1000)} />
      </main>

      <div className="fixed bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />
    </div>
  );
}
