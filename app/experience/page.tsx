"use client";
import type React from "react";
import { useRef, useEffect } from "react";
import Image from "next/image";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

type Job = {
  company: string;
  logo: string;
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
    logo: "/images/theory-ventures-logo.jpg",
    role: "Engineer Intern",
    location: "San Francisco, CA",
    date: "Summer 2026",
    description: "Data infrastructure for deep, thesis-driven investing.",
    current: true,
    url: "https://www.theoryvc.com/",
  },
  {
    company: "Stan",
    logo: "/images/stanwithme_logo.jpg",
    role: "Growth Fellow",
    location: "Toronto, ON",
    date: "Winter 2026",
    description:
      "Driving growth for Stanley, Stan Store's AI-powered LinkedIn content and growth assistant, while building my own brand.",
    current: false,
    url: "https://www.stan.store",
  },
  {
    company: "Clover Labs",
    logo: "/images/design-mode/clover_logo.jpg",
    role: "Software Engineer Intern",
    location: "Toronto, ON",
    date: "Winter 2026",
    description: "Infrastructure for AI video and image generation.",
    current: false,
    url: "https://www.cloverlabs.ai/",
  },
  {
    company: "Boardy",
    logo: "/images/design-mode/boardy_logo.jpeg",
    role: "Deal Partner & Growth Fellow",
    location: "Toronto, ON",
    date: "2025-2026",
    description:
      "Connecting high-potential founders raising capital to the world's first AI-led venture fund while driving growth initiatives.",
    current: false,
    url: "https://www.boardy.ai/",
  },
  {
    company: "Rootly AI",
    suffix: "(YC S21)",
    logo: "/images/rootlyhq-logo.jpg",
    role: "Software Engineer Intern",
    location: "Toronto, ON",
    date: "Fall 2025",
    description:
      "Shipped 45+ features used by Nvidia, Figma, Dropbox, LinkedIn, and Yahoo.",
    current: false,
    url: "https://rootly.com/",
  },
  {
    company: "General Dynamic Land Systems - Canada",
    logo: "/images/general-dynamics-logo.png",
    role: "Software Developer Intern",
    location: "London, ON",
    date: "Winter 2025",
    description:
      "Worked on defense systems engineering projects, contributing to software development and testing for mission-critical applications.",
    current: false,
    url: "https://www.gdls.com/",
  },
  {
    company: "WAT.ai",
    logo: "/images/wat.jpg",
    role: "Machine Learning Developer",
    location: "Waterloo, ON",
    date: "Winter 2025",
    description:
      "Helped develop an AI-driven system to predict geological formations ahead of oil drills in real time.",
    current: false,
    url: "https://watai.ca/",
  },
];

export default function Experience() {
  return (
    <div className="min-h-[100dvh] text-foreground relative">
      <SiteNav />

      <main className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-16">
        <section className="py-32 pt-20 sm:pt-28">
          <div className="space-y-12">
            <h2
              className="text-4xl sm:text-5xl font-semibold italic font-serif animate-init animate-blur-in"
              style={{ animationDelay: "100ms" }}
            >
              Experience
            </h2>

            <div className="space-y-4">
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
  const glowRef = useRef<HTMLDivElement>(null);
  const cursorBorderRef = useRef<HTMLDivElement>(null);
  const isHoveringRef = useRef(false);

  useEffect(() => {
    let rafId: number;
    const onMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (!cardRef.current || !glowRef.current || isHoveringRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const dist = Math.sqrt(
          (e.clientX - (rect.left + rect.width / 2)) ** 2 +
          (e.clientY - (rect.top + rect.height / 2)) ** 2
        );
        const proximity = Math.max(0, 1 - dist / 400);
        glowRef.current.style.opacity = proximity > 0.1 ? String(proximity * 0.5) : "0";
      });
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const handleMouseEnter = () => {
    isHoveringRef.current = true;
    if (glowRef.current) glowRef.current.style.opacity = "0";
    if (cursorBorderRef.current) cursorBorderRef.current.style.opacity = "1";
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current || !cursorBorderRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const tiltX = ((rect.height / 2 - y) / (rect.height / 2)) * 4;
    const tiltY = ((x - rect.width / 2) / (rect.width / 2)) * 4;
    cardRef.current.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(0)`;
    cursorBorderRef.current.style.background = `radial-gradient(200px circle at ${x}px ${y}px, var(--card-cursor-glow), transparent 70%)`;
  };

  const handleMouseLeave = () => {
    isHoveringRef.current = false;
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
        className="group relative p-6 rounded-lg backdrop-blur-2xl bg-background/40 hover:bg-background/70 cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ transition: "transform 0.15s ease-out, background-color 0.2s ease", transformStyle: "preserve-3d" }}
      >
        {/* Base border */}
        <div className="absolute inset-0 rounded-lg border border-border/70" />

        {/* Proximity glow */}
        <div
          ref={glowRef}
          className="absolute inset-0 rounded-lg pointer-events-none"
          style={{ opacity: 0, boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.3)", transition: "opacity 0.2s ease-out" }}
        />

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

        <div className="relative flex flex-col sm:flex-row sm:items-start gap-4">
          <div className="flex-shrink-0">
            <Image
              src={job.logo || "/placeholder.svg"}
              alt={`${job.company} logo`}
              width={48}
              height={48}
              className="w-12 h-12 rounded-lg object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4 mb-2">
              <div>
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-1.5">
                  {job.company}
                  {job.suffix && (
                    <span className="font-normal text-muted-foreground ml-2">
                      {job.suffix}
                    </span>
                  )}
                  <svg
                    className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity duration-200 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                </h3>
                <p className="text-foreground/70">{job.role}</p>
              </div>
              <div className="text-sm text-muted-foreground sm:text-right flex-shrink-0">
                <p>{job.location}</p>
                <p>{job.date}</p>
                {job.current && (
                  <p className="flex items-center sm:justify-end gap-1.5 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80 animate-pulse" />
                    <span className="text-emerald-400/80 text-xs">Now</span>
                  </p>
                )}
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {job.description}
            </p>
          </div>
        </div>
      </div>
    </a>
  );
}
