"use client";
import Link from "next/link";
import type React from "react";
import { CmdKHint } from "@/components/command-palette";

import { useRef, useEffect, useState, useCallback } from "react";
import { useThemeToggle } from "@/hooks/use-theme";

export default function Projects() {
  const { isDark, toggleTheme } = useThemeToggle();
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

  const projects = [
    {
      title: "Internly",
      description:
        "Lets students share and explore real internship experiences while analyzing resumes for ATS compatibility, experience alignment, and generating detailed score recovery plans.",
      tech: ["TypeScript", "Next.js", "Supabase", "Tailwind CSS"],
      link: "https://internly.tech",
    },
    {
      title: "AI-Enhanced Incident Management System",
      description:
        "Simulates a real-time incident replay system where each message is analyzed by AI to extract actionable suggestions. Built for Rootly AI (YC S21).",
      tech: ["Ruby", "JavaScript", "HTML", "CSS", "OpenAI API"],
      link: "https://github.com/Tejas-Thind/AI-Enhanced-Incident-Management-System",
    },
    {
      title: "Loan Amount ML Predictor",
      description:
        "Machine learning project to predict loan amounts using Random Forest and XGBoost. Features data preprocessing, feature engineering, and hyperparameter tuning.",
      tech: ["Python", "NumPy", "Pandas", "scikit-learn", "XGBoost"],
      link: "https://github.com/Tejas-Thind/Loan-Amount-ML-Predictor",
    },
    {
      title: "User Management System",
      description:
        "Built with Spring Boot, deployed on AWS EC2 using Docker. Features REST API for managing users, PostgreSQL integration, and containerized deployment.",
      tech: ["Java", "Spring Boot", "Docker", "AWS"],
      link: "https://github.com/Tejas-Thind/User-Management-System",
    },
    {
      title: "FitGenius",
      description:
        "Leverages OpenAI API to create customized workout plans tailored to user needs. Allows users to log workouts, track progress, and work toward fitness goals.",
      tech: ["JavaScript", "HTML", "CSS", "OpenAI API"],
      link: "https://github.com/Tejas-Thind/FitGenius",
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
              className="text-foreground font-normal opacity-50 hover-lift hover:opacity-100"
            >
              Experience
            </Link>
            <Link
              href="/projects"
              className="text-foreground font-normal hover-lift"
              style={{
                textShadow: "0 0 0.6px currentColor, 0 0 0.6px currentColor",
              }}
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
              Projects
            </h2>

            <div className="space-y-4">
              {projects.map((project, index) => (
                <div
                  key={index}
                  className="animate-card-in"
                  style={{ animationDelay: `${200 + index * 75}ms` }}
                >
                  <ProjectCardWithEffect
                    project={project}
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

function ProjectCardWithEffect({
  project,
  mousePos,
  isDark,
}: {
  project: {
    title: string;
    description: string;
    tech: string[];
    link: string;
  };
  mousePos: { x: number; y: number };
  isDark: boolean;
}) {
  const cardRef = useRef<HTMLAnchorElement>(null);
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
      ref={cardRef}
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative block p-6 rounded-lg backdrop-blur-2xl ${isHovering ? "bg-background/70" : "bg-background/40"}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(0)`,
        transition: "transform 0.15s ease-out, background-color 0.2s ease",
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

      {/* Card background */}
      <div className="absolute inset-[1px] rounded-[7px] bg-muted/15" />

      {/* External link icon */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-40 transition-opacity duration-200 pointer-events-none">
        <svg className="w-3.5 h-3.5 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative">
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-foreground">
            {project.title}
          </h3>
        </div>

        <p className="text-muted-foreground leading-relaxed mb-4">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {project.tech.map((tech, techIndex) => (
            <span
              key={techIndex}
              className="text-xs text-muted-foreground border border-border/50 px-2 py-1 rounded-md"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </a>
  );
}
