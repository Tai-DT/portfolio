import React from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}

export function SectionHeading({
  title,
  subtitle,
  className,
  titleClassName,
  subtitleClassName,
}: SectionHeadingProps) {
  return (
    <div className={cn("space-y-2 text-center mb-12", className)}>
      <h2 
        className={cn(
          "text-3xl md:text-4xl font-bold bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent",
          titleClassName
        )}
      >
        {title}
      </h2>
      
      {subtitle && (
        <p 
          className={cn(
            "text-muted-foreground text-lg max-w-3xl mx-auto",
            subtitleClassName
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
