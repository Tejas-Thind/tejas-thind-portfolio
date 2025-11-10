"use client"

import { useEffect, useState } from "react"

const navItems = [
  { label: "About Me", id: "about" },
  { label: "Experience", id: "work" },
  { label: "Projects", id: "thoughts" },
  { label: "Get in Touch", id: "connect" },
]

export function Navigation() {
  const [activeSection, setActiveSection] = useState("about")
  const [scrollPosition, setScrollPosition] = useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.2) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: [0.2, 0.5] },
    )

    const sectionIds = ["work", "thoughts", "connect"]
    sectionIds.forEach((id) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    const handleScroll = () => {
      setScrollPosition(window.scrollY)
      if (window.scrollY < 100) {
        setActiveSection("about")
      }
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      observer.disconnect()
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const handleScroll = (id: string) => {
    if (id === "about") {
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }
  }

  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 hidden md:block">
      <nav className="flex gap-2 sm:gap-4 bg-background/80 backdrop-blur-sm border border-border rounded-full px-6 sm:px-8 py-3">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleScroll(item.id)}
            className={`relative px-2 sm:px-3 py-2 text-sm transition-colors duration-300 group cursor-pointer ${
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
