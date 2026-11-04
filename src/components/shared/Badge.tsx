import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "magenta" | "outline" | "espresso";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  const variantStyles = {
    default: "bg-[#F3F3E7] text-[#24121B] border border-black/10",
    magenta: "bg-[#890149] text-[#F3F3E7] border border-[#890149]",
    outline: "bg-transparent text-[#24121B] border border-[#24121B]/20",
    espresso: "bg-[#24121B] text-[#F3F3E7] border border-[#24121B]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium tracking-wide uppercase transition-colors",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export default Badge;

