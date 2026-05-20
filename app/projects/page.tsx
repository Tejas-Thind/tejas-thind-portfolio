"use client";
import type React from "react";
import { useRef, useEffect } from "react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

type Project = {
  title: string;
  description: string;
  tech: string[];
  link: string;
};

const projects: Project[] = [
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
];

export default function Projects() {
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
              Projects
            </h2>

            <div className="space-y-4">
              {projects.map((project, index) => (
                <div
                  key={index}
                  className="animate-card-in"
                  style={{ animationDelay: `${200 + index * 75}ms` }}
                >
                  <ProjectCardWithEffect project={project} />
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

function ProjectCardWithEffect({ project }: { project: Project }) {
  const cardRef = useRef<HTMLAnchorElement>(null);
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
    <a
      ref={cardRef}
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block p-6 rounded-lg backdrop-blur-2xl bg-background/40 hover:bg-background/70"
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

      <div className="relative">
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-1.5">
            {project.title}
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
        </div>

        <p className="text-muted-foreground leading-relaxed mb-4">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {project.tech.map((tech, techIndex) => (
            <span
              key={techIndex}
              className="font-mono text-xs text-muted-foreground/70 bg-muted/40 px-1.5 py-0.5 rounded"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </a>
  );
}
