import type { Metadata } from "next"
import { Inter as FontSans } from "next/font/google"
import { JetBrains_Mono as FontMono } from "next/font/google"

import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"
import { LocaleProvider } from "@/providers/LocaleProvider"

import "./globals.css"
import AuroraBackground from "@/components/background/AuroraBackground"
import IntroOverlay from "@/components/motion/IntroOverlay"
import { Toaster } from "@/components/ui/sonner"

// Define fonts
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: "Tài Đỗ (Kai) | Full-Stack Developer & AI Systems Engineer",
  description: "Portfolio of Tài Đỗ (Kai) — Full-Stack Developer & AI Systems Engineer based in Ho Chi Minh City, Vietnam. Building MCP servers, intelligent AI agent workflows, modern Next.js apps, and native Apple platforms.",
  metadataBase: new URL("https://taido.dev"),
  keywords: [
    "Tài Đỗ", "Kai", "Tai-DT", "Full-Stack Developer", "AI Engineer",
    "Model Context Protocol", "MCP", "Next.js", "React", "Cloudflare",
    "Cloudflare D1", "Go", "Swift", "macOS", "Ho Chi Minh City"
  ],
  authors: [{ name: "Tài Đỗ", url: "https://taido.dev" }],
  creator: "Tài Đỗ (Kai)",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://taido.dev",
    title: "Tài Đỗ (Kai) | Full-Stack Developer & AI Systems Engineer",
    description: "Building intelligent MCP servers, full-stack applications, and native Apple systems. Running on Cloudflare Workers & D1 database.",
    siteName: "taido.dev",
    images: [
      {
        url: "https://avatars.githubusercontent.com/u/112989159?v=4",
        width: 460,
        height: 460,
        alt: "Tài Đỗ (Kai) Portfolio"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Tài Đỗ (Kai) | Full-Stack Developer & AI Systems Engineer",
    description: "Full-Stack Developer & AI Systems Engineer. Explore my open-source projects, MCP tools, and live Cloudflare D1 guestbook on taido.dev.",
    images: ["https://avatars.githubusercontent.com/u/112989159?v=4"],
  },
  robots: {
    index: true,
    follow: true,
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontMono.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <LocaleProvider>
            {/* Opening intro: logo reveal → curtain lift */}
            <IntroOverlay />

            {/* Animated aurora background layer */}
            <AuroraBackground />

            {/* Content layer */}
            <div className="relative z-10">
              {children}
            </div>

            <Toaster richColors position="top-right" />
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
