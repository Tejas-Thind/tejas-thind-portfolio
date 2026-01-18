import type React from "react";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme-provider";
import CanvasCursor from "@/components/canvas-cursor";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
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
      className={`${geist.variable} dark`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Google+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&display=swap"
          rel="stylesheet"
        />
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
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <div className="fixed inset-0 z-[-2] bg-background pointer-events-none" />
        <CanvasCursor />
        <ThemeProvider>{children}</ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
