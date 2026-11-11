"use client";
import { AnimatedLink } from "@/components/animated-link";
import { TextScramble } from "@/components/text-scramble";
import { ContributionGraph } from "@/components/contribution-graph";

export default function Home() {
  return (
    <div className="min-h-[100dvh] text-foreground relative">
      <main className="relative z-10 max-w-[62rem] mx-auto px-6 sm:px-8 lg:px-16">
        {/* Bottom-anchored, not centred: the chart's bottom edge sits 1.5rem
            above the sun. InkMountains publishes the sun's top as --sun-top
            once its canvas is built (SceneBackdrop, in the layout); 51.1dvh is the server-rendered fallback.
            If the content is taller than that, the header just grows downward
            instead of sliding under the nav. */}
        <header className="flex min-h-[calc(var(--sun-top,51.1dvh)-1.5rem)] items-end pt-16">
          <div className="w-full">
            <div
              className="space-y-2.5 animate-init animate-blur-in"
              style={{ animationDelay: "400ms" }}
            >
              <h1 className="text-3xl leading-[1.1] tracking-tighter text-foreground font-serif sm:text-4xl">
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

              <p className="text-base text-foreground leading-relaxed max-w-2xl">
                Joining the engineering team behind Next.js, v0, and the AI SDK as an intern at{" "}
                <AnimatedLink
                  href="https://vercel.com/home"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground font-semibold"
                >
                  Vercel
                </AnimatedLink>
                .
              </p>

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
              className="mt-2.5 space-y-2.5 animate-init animate-blur-in"
              style={{ animationDelay: "600ms" }}
            >
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
                , growing it to <span className="font-semibold">2.8k+</span> followers and <span className="font-semibold">23M+</span> views.
              </p>
            </div>

            <div
              className="mt-4 animate-init animate-blur-in"
              style={{ animationDelay: "1000ms" }}
            >
              <ContributionGraph />
            </div>
          </div>
        </header>

      </main>
    </div>
  );
}
