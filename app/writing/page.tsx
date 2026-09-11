"use client";
import { Hammer } from "lucide-react";
import { SiteNav } from "@/components/site-nav";

export default function Writing() {
  return (
    <div className="min-h-[100dvh] text-foreground relative">
      <SiteNav />

      <main className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-16">
        <section className="py-20 pt-20 sm:pt-24">
          <div className="space-y-8">
            <h1
              className="text-3xl sm:text-4xl font-medium italic font-serif animate-init animate-blur-in"
              style={{ animationDelay: "100ms" }}
            >
              Writing
            </h1>

            <div
              className="flex flex-col items-center justify-center gap-4 rounded-lg border border-border/70 bg-background/35 py-24 text-center animate-init animate-blur-in"
              style={{ animationDelay: "250ms" }}
            >
              <Hammer
                className="h-7 w-7 text-muted-foreground motion-safe:animate-bounce"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <p className="text-lg font-medium">Under construction</p>
              <p className="max-w-sm text-sm text-muted-foreground">
                Writing is fun but kinda hard. First post coming soon.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
