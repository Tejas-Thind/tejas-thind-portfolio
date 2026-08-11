"use client";

import { useThemeToggle } from "@/hooks/use-theme";
import { CmdKHint } from "@/components/command-palette";
import { cn } from "@/lib/utils";


interface SiteFooterProps {
  className?: string;
  animated?: boolean;
  animationDelay?: number;
}

export function SiteFooter({ className = "", animated = false, animationDelay = 0 }: SiteFooterProps) {
  const { isDark, toggleTheme } = useThemeToggle();

  return (
    <footer
      className={cn("py-8 border-t border-border", animated && "animate-init animate-blur-in", className)}
      style={animated ? { animationDelay: `${animationDelay}ms` } : undefined}
    >
      <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground items-center">
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
