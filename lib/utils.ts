import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function to get CSS variable values
export function getCssVar(name: string): string {
  if (typeof window !== 'undefined') {
    // Get the CSS variable value from the document root
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(`--${name}`)
      .trim();
    
    return value;
  }
  
  // Default return for SSR
  return '';
}

// Check if the current theme is in dark mode
export function isDarkTheme(): boolean {
  if (typeof window !== 'undefined') {
    return document.documentElement.classList.contains('night') || 
           document.documentElement.classList.contains('dark') ||
           document.documentElement.classList.contains('evening') ||
           document.documentElement.classList.contains('dark-7pm') ||
           document.documentElement.classList.contains('dark-8pm') ||
           document.documentElement.classList.contains('dark-9pm') ||
           document.documentElement.classList.contains('dark-10pm') ||
           document.documentElement.classList.contains('dark-11pm') ||
           document.documentElement.classList.contains('dark-1am') ||
           document.documentElement.classList.contains('dark-2am') ||
           document.documentElement.classList.contains('dark-3am') ||
           document.documentElement.classList.contains('dark-4am') ||
           document.documentElement.classList.contains('dark-5am');
  }
  
  return false;
}
