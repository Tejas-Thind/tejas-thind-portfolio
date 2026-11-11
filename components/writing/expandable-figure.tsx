"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Maximize2, X } from "lucide-react";

// A figure that opens large in a modal. Uses the native <dialog> element, so
// focus is trapped, Esc closes it, and the page behind is inert, with no
// extra libraries. The enlarged copy only mounts while it is open.
export function ExpandableFigure({ title, children }: { title: string; children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <figure className="my-7">
        <button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          onClick={() => setOpen(true)}
          className="block w-full cursor-zoom-in"
        >
          {children}
        </button>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group mx-auto mt-2 flex min-h-10 cursor-pointer items-center gap-1.5 rounded-sm text-xs text-muted-foreground transition-colors duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/40"
        >
          <Maximize2
            className="h-3 w-3 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-110"
            strokeWidth={1.5}
            aria-hidden="true"
          />
          Expand diagram
          <span className="sr-only">: {title}</span>
        </button>
      </figure>

      <dialog
        ref={dialog}
        aria-label={title}
        onClose={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(false);
        }}
        className="m-auto max-h-[92dvh] w-[min(94vw,46rem)] overflow-auto rounded-lg border border-border/70 bg-background p-4 text-foreground backdrop:bg-black/60 backdrop:backdrop-blur-sm open:animate-cmd-in sm:p-6"
      >
        {open && (
          <div className="relative [&_svg]:!max-w-none max-sm:[&_svg]:min-w-[34rem]">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute -right-1 -top-1 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-sm text-muted-foreground transition-colors duration-300 hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/40"
            >
              <X className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
            </button>
            {children}
          </div>
        )}
      </dialog>
    </>
  );
}
