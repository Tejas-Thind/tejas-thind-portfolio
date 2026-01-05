"use client"
import Link from "next/link"
import type React from "react"

import Image from "next/image"
import { useThemeToggle } from "@/hooks/use-theme"

export default function Experience() {
  const { isDark, toggleTheme } = useThemeToggle()

  const experiences = [
    {
      company: "Clover Labs",
      logo: "/images/design-mode/clover_logo.jpg",
      role: "Software Engineer Intern",
      location: "Toronto, ON",
      date: "Winter 2026",
      description:
        "Building AI growth agents and internal systems that power large scale experimentation, automation, and distribution at the fastest growing startup in Canada.",
      current: true,
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
    },
    {
      company: "Rootly AI",
      suffix: "(YC S21)",
      logo: "/images/rootlyhq-logo.jpg",
      role: "Software Engineer Intern",
      location: "Toronto, ON",
      date: "Fall 2025",
      description:
        "Shipped 45+ features for enterprise customers including Nvidia, Figma, Dropbox, LinkedIn, and Yahoo.",
      current: false,
    },
    {
      company: "Industry 4.0 Design Team",
      logo: "/images/industry4team-logo.jpg",
      role: "VP of Software",
      location: "Waterloo, ON",
      date: "2024-2025",
      description:
        "Helped develop an internal AI-powered tool to support design teams at the University of Waterloo, also led the development and continuous improvement of our website.",
      current: false,
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
    },
  ]

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    card.style.setProperty("--mouse-x", `${x}px`)
    card.style.setProperty("--mouse-y", `${y}px`)
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="absolute inset-0 backdrop-blur-sm bg-background/80" />
        <div className="relative flex items-center justify-center px-6 sm:px-8 py-6 sm:py-8 text-sm md:text-base">
          <div className="flex gap-6 sm:gap-8">
            <Link
              href="/"
              className="text-foreground font-normal opacity-50 transition-all duration-300 hover:-translate-y-1 hover:opacity-100"
            >
              About
            </Link>
            <Link
              href="/experience"
              className="text-foreground font-normal transition-transform duration-300 hover:-translate-y-1"
              style={{ textShadow: "0 0 0.6px currentColor, 0 0 0.6px currentColor" }}
            >
              Experience
            </Link>
            <Link
              href="/projects"
              className="text-foreground font-normal opacity-50 transition-all duration-300 hover:-translate-y-1 hover:opacity-100"
            >
              Projects
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-16">
        <section className="min-h-screen py-32 pt-20 sm:pt-24">
          <div className="space-y-12">
            <h2 className="text-4xl sm:text-5xl font-normal">Experience</h2>

            <div className="space-y-4">
              {experiences.map((job, index) => (
                <div
                  key={index}
                  onMouseMove={handleMouseMove}
                  className="group relative p-6 rounded-lg border border-border/50 bg-background hover:border-border hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  {/* Shine effect overlay */}
                  <div
                    className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.03)"}, transparent 40%)`,
                    }}
                  />

                  <div className="relative flex flex-col sm:flex-row sm:items-start gap-4">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                      <Image
                        src={job.logo || "/placeholder.svg"}
                        alt={`${job.company} logo`}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4 mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">
                            {job.company}
                            {job.suffix && <span className="font-normal text-muted-foreground ml-2">{job.suffix}</span>}
                          </h3>
                          <p className="text-foreground">{job.role}</p>
                        </div>
                        <div className="text-sm text-muted-foreground sm:text-right flex-shrink-0">
                          <p>{job.location}</p>
                          <p>{job.date}</p>
                        </div>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">{job.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="py-16 border-t border-border">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground items-center">
            <a
              href="mailto:tejas.st0544@gmail.com"
              className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:-translate-y-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              Email
            </a>
            <a
              href="https://www.linkedin.com/in/tejas-thind/"
              className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:-translate-y-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            <a
              href="https://x.com/tejasthind4"
              className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:-translate-y-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              X (Twitter)
            </a>
            <a
              href="https://www.instagram.com/tejastnd/"
              className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:-translate-y-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
            <a
              href="https://github.com/Tejas-Thind"
              className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:-translate-y-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <span className="text-muted-foreground">|</span>
            <span className="text-muted-foreground">Appearance:</span>
            <button
              onClick={toggleTheme}
              className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:-translate-y-1 -ml-2 cursor-pointer"
              aria-label="Toggle theme"
            >
              {isDark ? "☀️" : "🌙"}
            </button>
          </div>
        </footer>
      </main>
    </div>
  )
}
