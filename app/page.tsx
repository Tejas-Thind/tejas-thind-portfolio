"use client";
import { SiteNav } from "@/components/site-nav";
import {
  WaterlooLogo,
  RootlyLogo,
  CloverLogo,
  TheoryLogo,
} from "@/components/logos";
import { AnimatedLink } from "@/components/animated-link";
import { TextScramble } from "@/components/text-scramble";

export default function Home() {
  return (
    <div className="min-h-[100dvh] text-foreground relative">
      <SiteNav />

      <main className="max-w-[62rem] mx-auto px-6 sm:px-8 lg:px-16">
        <header className="flex min-h-[calc(100dvh-9rem)] items-center py-20 pt-24 sm:pt-28">
          <div className="w-full">
            <div
              className="space-y-4 sm:space-y-5 animate-init animate-blur-in"
              style={{ animationDelay: "400ms" }}
            >
              <h1 className="pb-1 text-3xl leading-[1.1] tracking-tighter text-foreground font-serif sm:text-4xl">
                <span className="font-normal italic">
                  <TextScramble
                    text="Hey, I'm Tejas"
                    delay={0}
                    duration={1000}
                    loopInterval={8000}
                    emphasisStart={9}
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
              className="mt-2 space-y-2 sm:mt-3 sm:space-y-3 animate-init animate-blur-in"
              style={{ animationDelay: "600ms" }}
            >
              <p className="text-base text-foreground leading-relaxed font-normal">
                Currently, I&apos;m an AI Engineer Intern at <TheoryLogo />{" "}
                <AnimatedLink href="https://www.theoryvc.com/" target="_blank" rel="noopener noreferrer" className="text-foreground font-semibold">Theory Ventures</AnimatedLink>
                , building the intelligence layer for thesis-driven investing.
              </p>
              <p className="text-base text-foreground leading-relaxed font-normal">
                I&apos;ve worked on AI video & image generation infrastructure at <CloverLogo />{" "}
                <AnimatedLink href="https://cloverlabs.ai/" target="_blank" rel="noopener noreferrer" className="text-foreground font-semibold">Clover Labs</AnimatedLink>
                , and shipped product-facing features at{" "}
                <span className="inline-flex items-center gap-0.5 whitespace-nowrap align-[-0.18em]">
                  <RootlyLogo />
                  <AnimatedLink href="https://rootly.com/" target="_blank" rel="noopener noreferrer" className="text-foreground font-semibold">Rootly AI</AnimatedLink>
                </span>
                , used by enterprise customers like Nvidia, Figma, LinkedIn & more.
              </p>
              <p className="text-base text-foreground leading-relaxed font-normal">
                I love content creation and sharing my journey on{" "}
                <AnimatedLink href="https://www.instagram.com/tejastnd/" target="_blank" rel="noopener noreferrer" className="text-foreground font-semibold">Instagram</AnimatedLink>
                , growing it to <span className="font-semibold">2.6k+</span> followers and <span className="font-semibold">20M+</span> views.
              </p>
            </div>

            <div
              className="mt-2 sm:mt-3 animate-init animate-blur-in"
              style={{ animationDelay: "800ms" }}
            >
              <p className="text-base text-foreground leading-relaxed font-normal lg:whitespace-nowrap">
                Reach out, I&apos;m always curious to hear interesting opinions and new ideas at{" "}
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

      </main>

      <div className="fixed bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />
    </div>
  );
}
