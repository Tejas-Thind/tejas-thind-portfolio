"use client"

import { useState } from "react"

import { useEffect } from "react"

const navItems = [
  { label: "About Me", id: "intro" },
  { label: "Experience", id: "work" },
  { label: "Projects", id: "thoughts" },
  { label: "Get in Touch", id: "connect" },
]

export function Navigation() {
  const [activeSection, setActiveSection] = useState("intro")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            setActiveSection(entry.target.id)
          }
        })
      },
      {
        threshold: [0.3, 0.5, 0.7],
        rootMargin: "-20% 0px -35% 0px",
      },
    )

    // Observe all sections
    const sectionIds = ["intro", "work", "thoughts", "connect"]
    sectionIds.forEach((id) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => {
      observer.disconnect()
    }
  }, [])

  const handleNavClick = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 hidden md:block">
      {/* Blurred background spanning full width */}
      <div className="absolute inset-0 backdrop-blur-sm bg-background/80" />
      {/* Navigation content centered */}
      <nav className="relative flex gap-6 justify-center px-8 py-6 pt-8">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.id)}
            className={`relative px-2 py-2 text-sm transition-colors duration-300 group cursor-pointer ${
              activeSection === item.id ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {item.label}
            <span
              className={`absolute bottom-0 left-0 h-px bg-foreground transition-all duration-500 ease-out ${
                activeSection === item.id ? "w-full" : "w-0 group-hover:w-full"
              }`}
            />
          </button>
        ))}
      </nav>
    </div>
  )
}
