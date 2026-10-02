import type { Metadata } from "next"
import { Inter as FontSans } from "next/font/google"
import { JetBrains_Mono as FontMono } from "next/font/google"

import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"
import { TimeProvider } from "@/providers/TimeProvider"
import { WeatherProvider } from "@/providers/WeatherProvider"

import "./globals.css"
import { getCurrentHourTheme } from "@/lib/theme-utils"
import DynamicBackground from "@/components/background/DynamicBackground"
import { ShadcnThemeController } from "@/components/ui/shadcn-theme-controller";
import WeatherWidget from "@/components/weather/WeatherWidget"
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
      <head>
        <style>{`
          body::before {
            content: "";
            position: fixed;
            inset: 0;
            background: linear-gradient(to bottom, #0A1128, #1e3c72);
            z-index: -1;
            transition: opacity 0.3s ease;
          }
          .mounted body::before {
            opacity: 0;
          }
        `}</style>
        <script dangerouslySetInnerHTML={{
          __html: `
            setTimeout(function() {
              document.documentElement.classList.add('mounted');
            }, 300);
          `
        }} />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontMono.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme={getCurrentHourTheme()}
          enableSystem={false}
          disableTransitionOnChange
        >
          <TimeProvider>
            <WeatherProvider>
              {/* Background layer */}
              <ShadcnThemeController />
              <DynamicBackground />
              
              {/* Content layer */}
              <div className="relative z-10">
                {children}
              </div>
              
              {/* UI overlay layer */}
              <WeatherWidget />
              <Toaster richColors position="top-right" />
            </WeatherProvider>
          </TimeProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
