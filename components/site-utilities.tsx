"use client";

import { Moon, Sun } from "lucide-react";
import { useDisplayedPath } from "@/components/displayed-path";
import { CmdKHint } from "@/components/command-palette";
import { useThemeToggle } from "@/hooks/use-theme";

export function SiteUtilities() {
  const { isDark, toggleTheme } = useThemeToggle();
  // the landing page is always dark, so there is nothing to toggle there
  const showToggle = useDisplayedPath().path !== "/";
  const themeLabel = isDark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <aside
      className="utility-island"
      aria-label="Site controls"
    >
      {showToggle && (
        <button
          type="button"
          onClick={toggleTheme}
          className="utility-button group"
          aria-label={themeLabel}
        >
          {isDark ? (
            <Sun className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
          ) : (
            <Moon className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
          )}
          <span className="utility-tooltip">{themeLabel}</span>
        </button>
      )}

      <CmdKHint />
    </aside>
  );
}
