import React from "react";
import { cn } from "@/lib/utils";

interface HairlineDividerProps {
  className?: string;
  light?: boolean;
}

export function HairlineDivider({ className, light = false }: HairlineDividerProps) {
  return (
    <hr
      className={cn(
        "border-0 border-t w-full",
        light ? "border-white/15" : "border-[#24121B]/15",
        className
      )}
    />
  );
}

export default HairlineDivider;

