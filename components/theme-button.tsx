"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import Clock from "./clock/Clock"
import { useTime } from "@/providers/TimeProvider"
import { getHourBasedTheme } from "@/lib/theme-utils"

export function ModeToggle({ className }: { className?: string }) {
  const { currentHour, updateHour } = useTime()
  const [isMounted, setIsMounted] = useState(false)
  
  // Set mounted state after hydration
  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  // Create a container with consistent positioning and higher z-index
  return (
    <div 
      className={`flex items-center justify-center ${className || ''}`}
      style={{ 
        position: 'relative', 
        zIndex: 100,
        pointerEvents: 'auto' // Ensure clicks register
      }}
    >
      {!isMounted ? (
        // Loading placeholder with same dimensions as Clock
        <div className="h-12 w-36 flex items-center justify-center bg-muted/60 backdrop-blur-sm rounded-full border border-border">
          <div className="animate-pulse text-muted-foreground text-sm">...</div>
        </div>
      ) : (
        // Actual clock with consistent positioning
        <div 
          className="cursor-pointer"
          onClick={(e) => {
            // Ensure event doesn't propagate
            e.stopPropagation();
          }}
        >
          <Clock 
            currentHour={currentHour} 
            onHourChange={(hour) => {
              updateHour(hour);
              // Sử dụng tên hàm mới getHourBasedTheme thay vì getCurrentHourTheme
              const theme = getHourBasedTheme(hour);
              document.documentElement.setAttribute('data-theme', theme);
            }}
          />
        </div>
      )}
    </div>
  )
}
