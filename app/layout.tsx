import type React from "react";
import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { Instrument_Sans, Newsreader } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme-provider";
import { JsonLd } from "@/components/json-ld";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, WEBSITE_ID, personNode } from "@/lib/site";
import CanvasCursor from "@/components/canvas-cursor";
import { CommandPalette } from "@/components/command-palette";
import { PageTransition } from "@/components/page-transition";
import { SiteNav } from "@/components/site-nav";
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
  metadataBase: new URL(SITE_URL),
  // The tab keeps the site title on every page. Pages set their own description
  // and canonical URL, not a title.
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "Tejas Thind",
    "Software Engineer",
    "University of Waterloo",
    "Management Engineering",
    "AI Engineer",
    "Theory Ventures",
    "Portfolio",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  // The share image comes from app/opengraph-image.tsx.
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    creator: "@tejasthind4",
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
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": [
              personNode,
              {
                "@type": "WebSite",
                "@id": WEBSITE_ID,
                url: SITE_URL,
                name: SITE_NAME,
                description: SITE_DESCRIPTION,
                inLanguage: "en",
                publisher: { "@id": personNode["@id"] },
              },
            ],
          }}
        />
        <div className="fixed inset-0 z-[-2] bg-background pointer-events-none" />
        <CanvasCursor />
        <ThemeProvider>
          <CommandPalette />
          <SiteNav />
          <PageTransition>{children}</PageTransition>
          <SiteUtilities />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
