"use client"

import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes"
import { createContext, useContext } from "react"

// Create a context for theme-related values that any component can access
export const ThemeContext = createContext({
  currentTheme: "",
  primaryColor: "",
  accentColor: ""
})

export function useThemeContext() {
  return useContext(ThemeContext)
}

export function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  // Simply use NextThemesProvider but with our enhanced configuration
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem={true}
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}
