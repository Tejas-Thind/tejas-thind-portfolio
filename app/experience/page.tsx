"use client";
import Link from "next/link";
import type React from "react";
import { CmdKHint } from "@/components/command-palette";

import { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useThemeToggle } from "@/hooks/use-theme";

export default function Experience() {
  const { isDark, toggleTheme } = useThemeToggle();
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    requestAnimationFrame(() => {
      setMousePos({ x: e.clientX, y: e.clientY });
    });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  const experiences = [
    {
      company: "Theory Ventures",
      logo: "/images/theory-ventures-logo.jpg",
      role: "Data Science Engineer Intern",
      location: "San Francisco, CA",
      date: "Summer 2026",
      description:
        "Incoming Summer 2026.",
      current: false,
      url: "https://www.theoryvc.com/",
    },
    {
      company: "Clover Labs",
      logo: "/images/design-mode/clover_logo.jpg",
      role: "Software Engineer Intern",
      location: "Toronto, ON",
      date: "Winter 2026",
      description:
        "Neo-backed AI growth agents. Building Echos, an AI-powered social video automation platform.",
      current: true,
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
      current: true,
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
      role: "Engineering Intern",
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

  return (
    <div className="min-h-screen text-foreground relative">
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="absolute inset-0 backdrop-blur-sm bg-background/80" />
        <div className="relative flex items-center justify-center px-6 sm:px-8 py-6 sm:py-8 text-sm md:text-base">
          <div className="flex gap-6 sm:gap-8">
            <Link
              href="/"
              className="text-foreground font-normal opacity-50 hover-lift hover:opacity-100"
            >
              About
            </Link>
            <Link
              href="/experience"
              className="text-foreground font-normal hover-lift"
              style={{
                textShadow: "0 0 0.6px currentColor, 0 0 0.6px currentColor",
              }}
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
        <section className="min-h-screen py-32 pt-20 sm:pt-24">
          <div className="space-y-12">
            <h2
              className="text-4xl sm:text-5xl font-semibold italic font-serif animate-init animate-blur-in"
              style={{ animationDelay: "100ms" }}
            >
              Experience
            </h2>

            <div ref={containerRef} className="space-y-4">
              {experiences.map((job, index) => (
                <div
                  key={index}
                  className="animate-card-in"
                  style={{ animationDelay: `${200 + index * 75}ms` }}
                >
                  <CardWithEffect
                    job={job}
                    mousePos={mousePos}
                    isDark={isDark}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="py-16 border-t border-border">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground items-center">
            <a
              href="mailto:tejas.st0544@gmail.com"
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
    </div>
  );
}

function CardWithEffect({
  job,
  mousePos,
  isDark,
}: {
  job: {
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
  mousePos: { x: number; y: number };
  isDark: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [localMouse, setLocalMouse] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // Calculate proximity-based border glow
  const getProximityGlow = () => {
    if (!cardRef.current) return 0;
    const rect = cardRef.current.getBoundingClientRect();
    const cardCenterX = rect.left + rect.width / 2;
    const cardCenterY = rect.top + rect.height / 2;
    const distance = Math.sqrt(
      Math.pow(mousePos.x - cardCenterX, 2) +
        Math.pow(mousePos.y - cardCenterY, 2)
    );
    const maxDistance = 400;
    return Math.max(0, 1 - distance / maxDistance);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setLocalMouse({ x, y });

    // Smooth 3D tilt calculation
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const tiltX = ((centerY - y) / centerY) * 4;
    const tiltY = ((x - centerX) / centerX) * 4;
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setTilt({ x: 0, y: 0 });
  };

  const proximityGlow = getProximityGlow();
  const glowColor = isDark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.9)";
  const softGlowColor = isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.4)";

  return (
    <a
      href={job.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      <div
        ref={cardRef}
        className="group relative p-6 rounded-lg bg-background/40 backdrop-blur-2xl cursor-pointer"
        onMouseEnter={() => setIsHovering(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(0)`,
          transition: "transform 0.15s ease-out",
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        {/* Base border - always visible */}
        <div className="absolute inset-0 rounded-lg border border-border/70" />

        {/* Proximity glow for nearby cards */}
        {!isHovering && proximityGlow > 0.1 && (
          <div
            className="absolute inset-0 rounded-lg pointer-events-none"
            style={{
              opacity: proximityGlow * 0.5,
              boxShadow: `inset 0 0 0 1px ${softGlowColor}`,
              transition: "opacity 0.2s ease-out",
            }}
          />
        )}

        {/* Cursor-following border highlight - only on hover */}
        {isHovering && (
          <div
            className="absolute inset-0 rounded-lg pointer-events-none"
            style={{
              background: `radial-gradient(200px circle at ${localMouse.x}px ${localMouse.y}px, ${glowColor}, transparent 70%)`,
              mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              maskComposite: "xor",
              WebkitMaskComposite: "xor",
              padding: "1.5px",
              transition: "opacity 0.1s ease-out",
            }}
          />
        )}

        <div className="absolute inset-[1px] rounded-[7px] bg-muted/15" />

        {/* Content */}
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
                <h3 className="text-lg font-semibold text-foreground">
                  {job.company}
                  {job.suffix && (
                    <span className="font-normal text-muted-foreground ml-2">
                      {job.suffix}
                    </span>
                  )}
                </h3>
                <p className="text-foreground">{job.role}</p>
              </div>
              <div className="text-sm text-muted-foreground sm:text-right flex-shrink-0">
                <p>{job.location}</p>
                <p>{job.date}</p>
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
