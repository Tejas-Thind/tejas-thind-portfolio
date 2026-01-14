import Link from "next/link";
import type { ReactNode } from "react";

interface AnimatedLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  target?: string;
  rel?: string;
}

export function AnimatedLink({
  href,
  children,
  className = "",
  target,
  rel,
}: AnimatedLinkProps) {
  return (
    <Link
      href={href}
      target={target}
      rel={rel}
      className={`animated-link ${className}`}
    >
      {children}
      <span className="underline-bar" />
    </Link>
  );
}
