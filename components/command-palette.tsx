"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

type Item = {
  group: string;
  label: string;
  action: "nav" | "open" | "copy";
  href?: string;
  value?: string;
};

const ITEMS: Item[] = [
  { group: "Navigate", label: "About", action: "nav", href: "/" },
  {
    group: "Navigate",
    label: "Experience",
    action: "nav",
    href: "/experience",
  },
  {
    group: "Contact",
    label: "Email",
    action: "open",
    href: "mailto:t3thind@uwaterloo.ca",
  },
  {
    group: "Contact",
    label: "LinkedIn",
    action: "open",
    href: "https://www.linkedin.com/in/tejas-thind/",
  },
  {
    group: "Contact",
    label: "GitHub",
    action: "open",
    href: "https://github.com/Tejas-Thind",
  },
  {
    group: "Contact",
    label: "X",
    action: "open",
    href: "https://x.com/tejasthind4",
  },
  {
    group: "Contact",
    label: "Instagram",
    action: "open",
    href: "https://www.instagram.com/tejastnd/",
  },
  {
    group: "Copy",
    label: "Copy Email",
    action: "copy",
    value: "t3thind@uwaterloo.ca",
  },
];

function usePlatformShortcut() {
  const [shortcut, setShortcut] = useState("⌘K");

  useEffect(() => {
    const navigatorWithClientHints = navigator as Navigator & {
      userAgentData?: { platform?: string };
    };
    const platform =
      navigatorWithClientHints.userAgentData?.platform ||
      navigator.platform ||
      navigator.userAgent;
    const isApple = /Mac|iPhone|iPad|iPod/i.test(platform);
    setShortcut(isApple ? "⌘K" : "Ctrl K");
  }, []);

  return shortcut;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const shortcut = usePlatformShortcut();
  const router = useRouter();

  const filtered = ITEMS.filter(
    (item) =>
      item.label.toLowerCase().includes(query.toLowerCase()) ||
      item.group.toLowerCase().includes(query.toLowerCase()),
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
      else if (item.action === "open" && item.href) {
        if (item.href.startsWith("mailto:")) window.location.href = item.href;
        else window.open(item.href, "_blank", "noopener noreferrer");
      } else if (item.action === "copy" && item.value)
        navigator.clipboard.writeText(item.value);
    },
    [close, router],
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
      previousFocusRef.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
      const t = setTimeout(() => inputRef.current?.focus(), 10);
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        clearTimeout(t);
        document.body.style.overflow = previousOverflow;
        previousFocusRef.current?.focus();
      };
    }
  }, [open]);

  // Reset selection when query changes
  useEffect(() => setSelected(0), [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Tab") {
      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        'input, button, [href], [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    } else if (e.key === "ArrowDown") {
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
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="command-palette-title"
        className="relative w-full max-w-md rounded-xl border border-border bg-background/90 backdrop-blur-xl shadow-2xl overflow-hidden animate-cmd-in"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <h2 id="command-palette-title" className="sr-only">
          Command palette
        </h2>
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 border-b border-border">
          <Search
            className="h-4 w-4 flex-shrink-0 text-muted-foreground"
            strokeWidth={1.5}
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command..."
            aria-label="Search commands"
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
          <span className="command-shortcut-hint ml-auto">{shortcut}</span>
        </div>
      </div>
    </div>
  );
}

export function CmdKHint() {
  const shortcut = usePlatformShortcut();

  return (
    <button
      onClick={() => window.dispatchEvent(new Event("open-palette"))}
      aria-label="Open command palette"
      className="utility-button utility-command-button group"
    >
      <Search className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
      <kbd className="command-shortcut-hint utility-keycap font-mono">
        {shortcut}
      </kbd>
      <span className="utility-tooltip">Command menu</span>
    </button>
  );
}
