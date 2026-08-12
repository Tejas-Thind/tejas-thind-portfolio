"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Github, Linkedin, Mail } from "lucide-react";

function XIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.451-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  );
}

export function SiteNav() {
  const pathname = usePathname();
  const onExperiencePage = pathname.startsWith("/experience");
  const destination = onExperiencePage
    ? { href: "/", label: "About" }
    : { href: "/experience", label: "Experience" };

  const socialLinkClass =
    "flex h-10 w-10 items-center justify-center rounded-sm text-muted-foreground transition-colors duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/40";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 animate-init animate-blur-in" style={{ animationDelay: "100ms" }}>
      <div className="site-nav-surface absolute inset-x-0 -bottom-4 top-0" />
      <div className="relative mx-auto flex w-full max-w-[62rem] items-center justify-end px-6 py-4 text-sm sm:px-8 sm:py-5 lg:px-16">
        <div className="flex items-center gap-0.5">
          <a
            href="mailto:t3thind@uwaterloo.ca"
            aria-label="Email Tejas"
            title="Email"
            className={socialLinkClass}
          >
            <Mail className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
          </a>
          <a
            href="https://github.com/Tejas-Thind"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Tejas on GitHub"
            title="GitHub"
            className={socialLinkClass}
          >
            <Github className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
          </a>
          <a
            href="https://www.linkedin.com/in/tejas-thind/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Tejas on LinkedIn"
            title="LinkedIn"
            className={socialLinkClass}
          >
            <Linkedin className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
          </a>
          <a
            href="https://x.com/tejasthind4"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Tejas on X"
            title="X"
            className={socialLinkClass}
          >
            <XIcon />
          </a>
        </div>

        <span
          className="mx-2.5 h-4 w-px bg-border/70"
          aria-hidden="true"
        />

        <Link
          href={destination.href}
          className="group inline-flex min-h-10 items-center gap-1.5 rounded-sm font-normal text-muted-foreground transition-colors duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/40"
        >
          {destination.label}
          <span className="transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5">
            →
          </span>
        </Link>
      </div>
    </nav>
  );
}
