"use client"
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes"
import { useDisplayedPath } from "@/components/displayed-path"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // The landing page is a night-sky scene with no light variant, so it is
  // always dark. forcedTheme leaves the saved preference untouched, and every
  // other page keeps following it. Keyed to the page actually on screen, not
  // the router's pathname, so the theme only changes while the fade has the
  // page fully transparent.
  const { path } = useDisplayedPath()
  const forcedTheme = path === "/" ? "dark" : undefined

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      storageKey="portfolio-theme"
      forcedTheme={forcedTheme}
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}
