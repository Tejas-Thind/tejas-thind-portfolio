"use client";

// Same treatment as the other text links: colour fade, arrow nudging toward
// its direction.
export function BackToTop() {
  return (
    <button
      type="button"
      onClick={() => {
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
      }}
      className="group inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-sm text-sm font-normal text-muted-foreground transition-colors duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/40"
    >
      Back to top
      <span
        aria-hidden="true"
        className="transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-y-0.5"
      >
        ↑
      </span>
    </button>
  );
}
