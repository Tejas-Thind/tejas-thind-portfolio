"use client";
import { SiteNav } from "@/components/site-nav";
import { AnimatedLink } from "@/components/animated-link";
import { TextScramble } from "@/components/text-scramble";
import { ContributionGraph } from "@/components/contribution-graph";

export default function Home() {
  return (
    <div className="min-h-[100dvh] text-foreground relative">
      <SiteNav />

      <main className="max-w-[62rem] mx-auto px-6 sm:px-8 lg:px-16">
        <header className="flex min-h-[calc(100dvh-9rem)] items-center pt-16 pb-20 sm:pt-28 sm:pb-20">
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
                Management Engineering + AI @{" "}
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
<<<<<<< HEAD
              <p className="text-base text-foreground leading-relaxed font-normal">
                I built extraction pipelines and hybrid retrieval for transcript search as an AI Engineer Intern at{" "}
                <AnimatedLink href="https://www.theoryvc.com/" target="_blank" rel="noopener noreferrer" className="text-foreground font-semibold">Theory Ventures</AnimatedLink>
                .
              </p>
              <p className="text-base text-foreground leading-relaxed font-normal">
                I&apos;ve also worked on AI video & image generation infrastructure at{" "}
                <AnimatedLink href="https://cloverlabs.ai/" target="_blank" rel="noopener noreferrer" className="text-foreground font-semibold">Clover Labs</AnimatedLink>
                , and shipped product-facing features at{" "}
                <AnimatedLink href="https://rootly.com/" target="_blank" rel="noopener noreferrer" className="text-foreground font-semibold">Rootly AI</AnimatedLink>
                , used by enterprise customers like Nvidia, Figma, LinkedIn & more.
              </p>
              <p className="text-base text-foreground leading-relaxed font-normal">
                I love content creation and sharing my journey on{" "}
                <AnimatedLink href="https://www.instagram.com/tejastnd/" target="_blank" rel="noopener noreferrer" className="text-foreground font-semibold">Instagram</AnimatedLink>
                , growing it to <span className="font-semibold">2.6k+</span> followers and <span className="font-semibold">20M+</span> views.
              </p>
=======
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
                  , growing it to{" "}
                  <span className="font-semibold">2.8k+ followers</span> and{" "}
                  <span className="font-semibold">23M+ views</span>
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

            <div
              className="mt-3 sm:mt-5 animate-init animate-blur-in"
              style={{ animationDelay: "1000ms" }}
            >
              <ContributionGraph />
            </div>
          </div>
        </header>

      </main>

      <div className="fixed bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />
    </div>
  );
}
