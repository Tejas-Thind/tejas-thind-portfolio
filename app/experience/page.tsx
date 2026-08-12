"use client";
import type React from "react";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

type Job = {
  company: string;
  role: string;
  location: string;
  date: string;
  description: string;
  current: boolean;
  suffix?: string;
  url: string;
};

const experiences: Job[] = [
  {
    company: "Theory Ventures",
    role: "AI Engineer Intern",
    location: "San Francisco, CA",
    date: "May 2026 - Present",
    description:
      "Building data infrastructure and intelligence systems for thesis-driven investing.",
    current: true,
    url: "https://www.theoryvc.com/",
  },
  {
    company: "Stan",
    role: "Growth Fellow",
    location: "Toronto, ON",
    date: "Winter 2026",
    description:
      "Built growth for Stanley, Stan Store's AI-powered LinkedIn assistant, while growing my own brand.",
    current: false,
    url: "https://www.stan.store",
  },
  {
    company: "Clover Labs",
    role: "Software Engineer Intern",
    location: "Toronto, ON",
    date: "Winter 2026",
    description: "Infrastructure for AI video and image generation.",
    current: false,
    url: "https://www.cloverlabs.ai/",
  },
  {
    company: "Boardy",
    role: "Scout & Growth Fellow",
    location: "Toronto, ON",
    date: "2025-2026",
    description:
      "Connected high-potential founders with the world's first AI-led venture fund while driving growth.",
    current: false,
    url: "https://www.boardy.ai/",
  },
  {
    company: "Rootly AI",
    suffix: "(YC S21)",
    role: "Software Engineer Intern",
    location: "Toronto, ON",
    date: "Fall 2025",
    description:
      "Shipped product-facing features. Rootly serves NVIDIA, LinkedIn, Figma, Okta, and more.",
    current: false,
    url: "https://rootly.com/",
  },
  {
    company: "General Dynamic Land Systems - Canada",
    role: "Software Developer Intern",
    location: "London, ON",
    date: "Winter 2025",
    description:
      "Automated cross-department workflows for defense systems engineering projects.",
    current: false,
    url: "https://www.gdls.com/",
  },
];

export default function Experience() {
  return (
    <div className="min-h-[100dvh] text-foreground relative">
      <SiteNav />

      <main className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-16">
        <section className="py-20 pt-20 sm:pt-24">
          <div className="space-y-8">
            <h1
              className="text-3xl sm:text-4xl font-medium italic font-serif animate-init animate-blur-in"
              style={{ animationDelay: "100ms" }}
            >
              Experience
            </h1>

            <div className="space-y-2.5">
              {experiences.map((job, index) => (
                <div
                  key={index}
                  className="animate-card-in"
                  style={{ animationDelay: `${200 + index * 75}ms` }}
                >
                  <CardWithEffect job={job} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <SiteFooter />
      </main>
    </div>
  );
}

function CardWithEffect({ job }: { job: Job }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const cursorBorderRef = useRef<HTMLDivElement>(null);

  const allowsCardMotion = () =>
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const handleMouseEnter = () => {
    if (!allowsCardMotion()) return;
    if (cursorBorderRef.current) cursorBorderRef.current.style.opacity = "1";
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (
      !allowsCardMotion() ||
      !cardRef.current ||
      !cursorBorderRef.current
    ) {
      return;
    }
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const tiltX = ((rect.height / 2 - y) / (rect.height / 2)) * 4;
    const tiltY = ((x - rect.width / 2) / (rect.width / 2)) * 4;
    cardRef.current.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(0)`;
    cursorBorderRef.current.style.background = `radial-gradient(200px circle at ${x}px ${y}px, var(--card-cursor-glow), transparent 70%)`;
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)";
    }
    if (cursorBorderRef.current) {
      cursorBorderRef.current.style.opacity = "0";
    }
  };

  return (
    <a href={job.url} target="_blank" rel="noopener noreferrer" className="block">
      <div
        ref={cardRef}
        className="group relative cursor-pointer rounded-lg bg-background/35 p-4 hover:bg-background/65"
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transition:
            "transform 180ms cubic-bezier(0.32, 0.72, 0, 1), background-color 300ms cubic-bezier(0.32, 0.72, 0, 1)",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Base border */}
        <div className="absolute inset-0 rounded-lg border border-border/70" />

        {/* Cursor-following border highlight */}
        <div
          ref={cursorBorderRef}
          className="absolute inset-0 rounded-lg pointer-events-none"
          style={{
            opacity: 0,
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "xor",
            WebkitMaskComposite: "xor",
            padding: "1.5px",
            transition: "opacity 0.1s ease-out",
          }}
        />

        <div className="absolute inset-[1px] rounded-[7px] bg-muted/15" />

        <div className="relative">
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start sm:gap-6">
            <div className="min-w-0">
              <div className="flex items-baseline gap-2">
                <h3 className="truncate text-lg font-semibold tracking-[-0.015em] text-foreground">
                  {job.company}
                </h3>
                {job.suffix && (
                  <span className="shrink-0 text-sm font-normal text-muted-foreground">
                    {job.suffix}
                  </span>
                )}
                <ArrowUpRight
                  className="h-3.5 w-3.5 shrink-0 -translate-x-0.5 text-muted-foreground opacity-0 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0 group-hover:opacity-50"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </div>
              <p className="mt-0.5 text-sm text-foreground/65">{job.role}</p>
            </div>

            <div className="flex flex-wrap items-center gap-x-2 text-xs tabular-nums text-muted-foreground sm:block sm:text-right">
              <p className="text-foreground/65">{job.date}</p>
              <span className="sm:hidden" aria-hidden="true">/</span>
              <p>{job.location}</p>
              {job.current && (
                <p className="current-status mt-1 flex items-center gap-1.5 sm:justify-end">
                  <span className="current-status-dot h-1.5 w-1.5 rounded-full motion-safe:animate-pulse" />
                  <span>
                    Current
                  </span>
                </p>
              )}
            </div>
          </div>

          <p className="mt-2.5 text-base leading-[1.5] text-muted-foreground">
            {job.description}
          </p>
        </div>
      </div>
    </a>
  );
}
