"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteNav() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "About" },
    { href: "/experience", label: "Experience" },
    { href: "/projects", label: "Projects" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 animate-init animate-blur-in" style={{ animationDelay: "100ms" }}>
      <div className="absolute inset-0 backdrop-blur-sm bg-background/80" />
      <div className="relative flex items-center justify-center px-6 sm:px-8 py-6 sm:py-8 text-sm md:text-base">
        <div className="flex gap-6 sm:gap-8">
          {links.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`text-foreground font-normal hover-lift transition-opacity duration-200 ${
                  isActive ? "opacity-100" : "opacity-50 hover:opacity-100"
                }`}
                style={
                  isActive
                    ? { textShadow: "0 0 0.6px currentColor, 0 0 0.6px currentColor" }
                    : undefined
                }
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
