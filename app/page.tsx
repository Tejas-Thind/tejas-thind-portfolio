"use client";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import {
  WaterlooLogo,
  RootlyLogo,
  CloverLogo,
  TheoryLogo,
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

      <main className="max-w-[62rem] mx-auto px-6 sm:px-8 lg:px-16">
        <header className="flex items-center py-20 pt-20 sm:pt-28">
          <div className="w-full space-y-8 sm:space-y-10">
            <div
              className="space-y-3 sm:space-y-4 animate-init animate-blur-in"
              style={{ animationDelay: `${getDelay(400)}ms` }}
            >
              <h1 className="text-4xl sm:text-5xl tracking-tighter text-foreground font-serif leading-none">
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
                Management Engineering + AI @ <WaterlooLogo />
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
              <p className="text-base text-foreground leading-relaxed font-normal">
                Currently, I&apos;m an AI Engineer Intern at <TheoryLogo />{" "}
                <AnimatedLink href="https://www.theoryvc.com/" target="_blank" rel="noopener noreferrer" className="text-foreground font-semibold">Theory Ventures</AnimatedLink>
                , building the intelligence layer for thesis-driven investing. I also worked on AI video & image generation infrastructure at <CloverLogo />{" "}
                <AnimatedLink href="https://cloverlabs.ai/" target="_blank" rel="noopener noreferrer" className="text-foreground font-semibold">Clover Labs</AnimatedLink>
                , and shipped product-facing features at <RootlyLogo />{" "}
                <AnimatedLink href="https://rootly.com/" target="_blank" rel="noopener noreferrer" className="text-foreground font-semibold">Rootly AI</AnimatedLink>
                , used by enterprise customers like Nvidia, Figma, LinkedIn & more.
              </p>
              <p className="text-base text-foreground leading-relaxed font-normal">
                I love content creation and sharing my journey, both the wins and losses, on{" "}
                <AnimatedLink href="https://www.instagram.com/tejastnd/" target="_blank" rel="noopener noreferrer" className="text-foreground font-semibold">Instagram</AnimatedLink>
                .
              </p>
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
