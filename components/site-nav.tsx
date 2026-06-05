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
      <div className="absolute inset-0 backdrop-blur-sm" />
      <div className="relative flex items-center justify-center px-6 sm:px-8 lg:px-16 py-5 sm:py-6 text-sm">
        <div className="flex gap-6 sm:gap-8">
          {links.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`font-normal hover-lift transition-opacity duration-200 ${
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
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
