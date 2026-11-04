import React from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  number?: string;
  category?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  className?: string;
  light?: boolean;
}

export function SectionHeading({
  number,
  category,
  title,
  subtitle,
  align = "left",
  className,
  light = false,
}: SectionHeadingProps) {
  const alignClass = {
    left: "text-left items-start",
    center: "text-center items-center mx-auto",
    right: "text-right items-end ml-auto",
  }[align];

  return (
    <div className={cn("flex flex-col mb-12 sm:mb-16", alignClass, className)}>
      <div className="flex items-center gap-3 mb-3">
        {number && (
          <span
            className={cn(
              "font-mono text-xs sm:text-sm font-semibold tracking-widest px-2.5 py-0.5 rounded-full",
              light
                ? "bg-white/10 text-[#F3F3E7]"
                : "bg-[#890149]/10 text-[#890149]"
            )}
          >
            {number}
          </span>
        )}
        {category && (
          <span
            className={cn(
              "text-xs sm:text-sm uppercase tracking-widest font-semibold",
              light ? "text-[#F3F3E7]/70" : "text-[#24121B]/70"
            )}
          >
            {category}
          </span>
        )}
      </div>

      <h2
        className={cn(
          "font-display text-4xl sm:text-6xl md:text-7xl uppercase tracking-tight leading-[0.95]",
          light ? "text-[#F3F3E7]" : "text-[#24121B]"
        )}
      >
        {title}
      </h2>

      {subtitle && (
        <p
          className={cn(
            "mt-4 text-base sm:text-lg max-w-2xl font-light leading-relaxed",
            light ? "text-[#F3F3E7]/80" : "text-[#24121B]/80"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default SectionHeading;

