"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Item = {
  group: string;
  label: string;
  action: "nav" | "open" | "copy";
  href?: string;
  value?: string;
};

const ITEMS: Item[] = [
  { group: "Navigate", label: "About", action: "nav", href: "/" },
  { group: "Navigate", label: "Experience", action: "nav", href: "/experience" },
  { group: "Navigate", label: "Projects", action: "nav", href: "/projects" },
  { group: "Contact", label: "Email", action: "open", href: "mailto:tejas.st0544@gmail.com" },
  { group: "Contact", label: "LinkedIn", action: "open", href: "https://www.linkedin.com/in/tejas-thind/" },
  { group: "Contact", label: "GitHub", action: "open", href: "https://github.com/Tejas-Thind" },
  { group: "Contact", label: "X (Twitter)", action: "open", href: "https://x.com/tejasthind4" },
  { group: "Contact", label: "Instagram", action: "open", href: "https://www.instagram.com/tejastnd/" },
  { group: "Copy", label: "Copy Email", action: "copy", value: "t3thind@uwaterloo.ca" },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const filtered = ITEMS.filter(
    (item) =>
      item.label.toLowerCase().includes(query.toLowerCase()) ||
      item.group.toLowerCase().includes(query.toLowerCase())
  );

  const groups = Array.from(new Set(filtered.map((i) => i.group)));

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setSelected(0);
  }, []);

  const execute = useCallback(
    (item: Item) => {
      close();
      if (item.action === "nav" && item.href) router.push(item.href);
      else if (item.action === "open" && item.href)
        window.open(item.href, "_blank", "noopener noreferrer");
      else if (item.action === "copy" && item.value)
        navigator.clipboard.writeText(item.value);
    },
    [close, router]
  );

  // Global keyboard shortcut + open-palette event
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
        if (!open) setQuery("");
      }
      if (e.key === "Escape") close();
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-palette", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-palette", onOpen);
    };
  }, [close, open]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 10);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Reset selection when query changes
  useEffect(() => setSelected(0), [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((s) => Math.min(s + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((s) => Math.max(s - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[selected]) execute(filtered[selected]);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center pt-[18vh] px-4"
      onClick={close}
    >
      <div className="absolute inset-0 bg-background/50 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-md rounded-xl border border-border bg-background/90 backdrop-blur-xl shadow-2xl overflow-hidden animate-cmd-in"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 border-b border-border">
          <svg
            className="w-4 h-4 text-muted-foreground flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command..."
            className="flex-1 bg-transparent py-4 text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
        </div>

        {/* Results */}
        <div className="py-1.5 max-h-72 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="px-4 py-8 text-sm text-muted-foreground text-center">
              No results.
            </p>
          ) : (
            groups.map((group) => (
              <div key={group}>
                <p className="px-4 pt-3 pb-1 text-xs text-muted-foreground/50 uppercase tracking-widest">
                  {group}
                </p>
                {filtered
                  .filter((i) => i.group === group)
                  .map((item) => {
                    const idx = filtered.indexOf(item);
                    return (
                      <button
                        key={item.label}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                          idx === selected
                            ? "bg-muted/60 text-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                        }`}
                        onClick={() => execute(item)}
                        onMouseEnter={() => setSelected(idx)}
                      >
                        {item.label}
                      </button>
                    );
                  })}
              </div>
            ))
          )}
        </div>

        {/* Footer hints */}
        <div className="px-4 py-2.5 border-t border-border flex gap-4 text-xs text-muted-foreground/50">
          <span>↑↓ navigate</span>
          <span>↵ select</span>
          <span>esc close</span>
          <span className="ml-auto">⌘/Ctrl K</span>
        </div>
      </div>
    </div>
  );
}

export function CmdKHint() {
  return (
    <button
      onClick={() => window.dispatchEvent(new Event("open-palette"))}
      className="text-muted-foreground hover:text-foreground hover-lift cursor-pointer text-xs border border-border/50 rounded px-1.5 py-0.5"
    >
      ⌘/Ctrl K
    </button>
  );
}
