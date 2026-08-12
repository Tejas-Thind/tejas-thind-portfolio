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
      <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground sm:gap-8">
        <button
          onClick={toggleTheme}
          className="footer-action"
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? "Light mode" : "Dark mode"}
        </button>
        <CmdKHint />
      </div>
    </footer>
  );
}
