"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import { useTime } from "@/providers/TimeProvider";
import { getExactThemeByHour } from "@/lib/theme-utils";

// Syncs the hourly theme (light-Nam / dark-Npm classes in globals.css)
// with next-themes and the document root.
export function ShadcnThemeController() {
  const { currentHour } = useTime();
  const { setTheme } = useTheme();

  useEffect(() => {
    const exactTheme = getExactThemeByHour(currentHour);
    setTheme(exactTheme);
    document.documentElement.setAttribute('data-theme', exactTheme);
    const root = document.documentElement.classList;
    for (const cls of [...root]) {
      if (/^(light|dark)(-|$)/.test(cls) && cls !== exactTheme) root.remove(cls);
    }
    root.add(exactTheme);
  }, [currentHour, setTheme]);

  return null;
}
