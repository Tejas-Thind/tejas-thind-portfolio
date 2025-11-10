"use client"

import { useEffect, useState } from "react"

const navItems = [
  { label: "Work Experience", id: "work" },
  { label: "Projects", id: "thoughts" },
  { label: "Get in Touch", id: "connect" },
]

export function Navigation() {
  const [activeSection, setActiveSection] = useState("")

  useEffect(() => {
    // Track which section is in view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.3, rootMargin: "0px 0px -20% 0px" },
    )

    navItems.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  const handleScroll = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 hidden md:block">
      <nav className="flex gap-2 sm:gap-4 bg-background/80 backdrop-blur-sm border border-border rounded-full px-6 sm:px-8 py-3">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleScroll(item.id)}
            className={`relative px-2 sm:px-3 py-2 text-sm transition-colors duration-300 group ${
              activeSection === item.id ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {item.label}
            <span
              className={`absolute bottom-1 left-0 h-px bg-foreground transition-all duration-500 ease-out ${
                activeSection === item.id ? "w-full" : "w-0 group-hover:w-full"
              }`}
            />
          </button>
        ))}
      </nav>
    </div>
  )
}
