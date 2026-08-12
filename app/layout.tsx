import type React from "react";
import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { Instrument_Sans, Newsreader } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme-provider";
import CanvasCursor from "@/components/canvas-cursor";
import { CommandPalette } from "@/components/command-palette";
import { PageTransition } from "@/components/page-transition";
import { SiteUtilities } from "@/components/site-utilities";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tejasthind.com"),
  title: {
    default: "Tejas Thind",
    template: "%s | Tejas Thind",
  },
  description:
    "Engineering + AI student at University of Waterloo. Previous 3x SWE intern.",
  keywords: [
    "Tejas Thind",
    "Software Engineer",
    "University of Waterloo",
    "Management Engineering",
    "Full Stack Developer",
    "Portfolio",
  ],
  authors: [{ name: "Tejas Thind" }],
  creator: "Tejas Thind",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://tejasthind.com",
    title: "Tejas Thind",
    description:
      "Engineering + AI student at University of Waterloo. Previous 3x SWE intern.",
    siteName: "Tejas Thind Portfolio",
    images: [
      {
        url: "/icon.png",
        width: 256,
        height: 256,
        alt: "Tejas Thind",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Tejas Thind",
    description:
      "Engineering + AI student at University of Waterloo. Previous 3x SWE intern.",
    creator: "@tejasthind4",
    images: ["/icon.png"],
  },
  icons: {
    icon: [
      { url: "/icon.png", sizes: "256x256", type: "image/png" },
    ],
    apple: [
      { url: "/icon.png", sizes: "256x256", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${instrumentSans.variable} ${GeistMono.variable} ${newsreader.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('portfolio-theme');
                  if (theme === 'light') {
                    document.documentElement.classList.remove('dark');
                  } else {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
              console.log('%c Tejas Thind ', 'font-family:Georgia,serif; font-style:italic; font-weight:600; font-size:2rem; color:#fff; background:#111; padding:8px 14px; border-radius:6px;');
              console.log('%c Management Engineering @ UWaterloo', 'font-size:0.8rem; color:#666; padding:2px 0;');
              console.log('%c t3thind@uwaterloo.ca', 'font-size:0.8rem; color:#666; font-family:monospace;');
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <div className="fixed inset-0 z-[-2] bg-background pointer-events-none" />
        <CanvasCursor />
        <ThemeProvider>
          <CommandPalette />
          <PageTransition>{children}</PageTransition>
          <SiteUtilities />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
