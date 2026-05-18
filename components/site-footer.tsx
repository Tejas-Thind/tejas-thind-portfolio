"use client";

import { useThemeToggle } from "@/hooks/use-theme";
import { CmdKHint } from "@/components/command-palette";


interface SiteFooterProps {
  className?: string;
  animated?: boolean;
  animationDelay?: number;
}

export function SiteFooter({ className = "", animated = false, animationDelay = 0 }: SiteFooterProps) {
  const { isDark, toggleTheme } = useThemeToggle();

  return (
    <footer
      className={`pt-4 pb-2 border-t border-border ${animated ? "animate-init animate-blur-in" : ""} ${className}`}
      style={animated ? { animationDelay: `${animationDelay}ms` } : undefined}
    >
      <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground items-center">
        <a
          href="mailto:t3thind@uwaterloo.ca"
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
        <span className="text-muted-foreground" aria-hidden="true">|</span>
        <span className="text-muted-foreground">Appearance:</span>
        <button
          onClick={toggleTheme}
          className="text-muted-foreground hover:text-foreground hover-lift -ml-2 cursor-pointer"
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? "☀️" : "🌙"}
        </button>
        <span className="text-muted-foreground" aria-hidden="true">|</span>
        <CmdKHint />
      </div>
    </footer>
  );
}
