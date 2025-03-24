"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import { useTime } from "@/providers/TimeProvider";
import { getExactThemeByHour } from "@/lib/theme-utils";

/**
 * Thành phần này tự động cập nhật theme dựa trên giờ hiện tại
 * và đồng bộ các biến CSS cho shadcn UI
 */
export function ShadcnThemeController() {
  const { currentHour } = useTime();
  const { setTheme } = useTheme();
  
  useEffect(() => {
    // Sử dụng theme chính xác theo giờ
    const exactTheme = getExactThemeByHour(currentHour);
    setTheme(exactTheme);
    
    // Đồng thời cập nhật data-theme attribute
    document.documentElement.setAttribute('data-theme', exactTheme);
    
    // Thêm class tương ứng để kích hoạt CSS variables
    document.documentElement.classList.forEach(className => {
      if (className.startsWith('light-') || 
          className.startsWith('dark-') || 
          className === 'light' || 
          className === 'dark' || 
          className === 'night' || 
          className === 'day' ||
          className === 'dawn' ||
          className === 'morning' ||
          className === 'afternoon' ||
          className === 'evening' ||
          className === 'sunset') {
        document.documentElement.classList.remove(className);
      }
    });
    
    document.documentElement.classList.add(exactTheme);
    
    // Lấy tất cả các biến CSS từ theme mới và áp dụng cho màu sắc shadcn
    const computedStyle = getComputedStyle(document.documentElement);
    
    // Cập nhật CSS variables cho shadcn
    document.documentElement.style.setProperty('--background', `oklch(${computedStyle.getPropertyValue('--color-background')})`);
    document.documentElement.style.setProperty('--foreground', `oklch(${computedStyle.getPropertyValue('--color-foreground')})`);
    document.documentElement.style.setProperty('--card', `oklch(${computedStyle.getPropertyValue('--color-card')})`);
    document.documentElement.style.setProperty('--card-foreground', `oklch(${computedStyle.getPropertyValue('--color-card-foreground')})`);
    document.documentElement.style.setProperty('--popover', `oklch(${computedStyle.getPropertyValue('--color-popover')})`);
    document.documentElement.style.setProperty('--popover-foreground', `oklch(${computedStyle.getPropertyValue('--color-popover-foreground')})`);
    document.documentElement.style.setProperty('--primary', `oklch(${computedStyle.getPropertyValue('--color-primary')})`);
    document.documentElement.style.setProperty('--primary-foreground', `oklch(${computedStyle.getPropertyValue('--color-primary-foreground')})`);
    document.documentElement.style.setProperty('--secondary', `oklch(${computedStyle.getPropertyValue('--color-secondary')})`);
    document.documentElement.style.setProperty('--secondary-foreground', `oklch(${computedStyle.getPropertyValue('--color-secondary-foreground')})`);
    document.documentElement.style.setProperty('--muted', `oklch(${computedStyle.getPropertyValue('--color-muted')})`);
    document.documentElement.style.setProperty('--muted-foreground', `oklch(${computedStyle.getPropertyValue('--color-muted-foreground')})`);
    document.documentElement.style.setProperty('--accent', `oklch(${computedStyle.getPropertyValue('--color-accent')})`);
    document.documentElement.style.setProperty('--accent-foreground', `oklch(${computedStyle.getPropertyValue('--color-accent-foreground')})`);
    document.documentElement.style.setProperty('--destructive', `oklch(${computedStyle.getPropertyValue('--color-destructive')})`);
    document.documentElement.style.setProperty('--destructive-foreground', `oklch(${computedStyle.getPropertyValue('--color-destructive-foreground')})`);
    document.documentElement.style.setProperty('--border', `oklch(${computedStyle.getPropertyValue('--color-border')})`);
    document.documentElement.style.setProperty('--input', `oklch(${computedStyle.getPropertyValue('--color-input')})`);
    document.documentElement.style.setProperty('--ring', `oklch(${computedStyle.getPropertyValue('--color-ring')})`);
    
  }, [currentHour, setTheme]);
  
  return null;
}
