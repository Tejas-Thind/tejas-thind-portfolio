import Link from "next/link"
import type { ReactNode } from "react"

interface AnimatedLinkProps {
  href: string
  children: ReactNode
  className?: string
  target?: string
  rel?: string
}

export function AnimatedLink({ href, children, className = "", target, rel }: AnimatedLinkProps) {
  return (
    <Link href={href} target={target} rel={rel} className={`relative group ${className}`}>
      {children}
      <span className="absolute bottom-0 left-0 h-px bg-foreground transition-all duration-500 ease-out w-0 group-hover:w-full" />
    </Link>
  )
}
