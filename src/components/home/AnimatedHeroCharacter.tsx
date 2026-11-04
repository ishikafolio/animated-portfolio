"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useSiteExperience } from "@/components/studio/SiteExperience";

/**
 * AnimatedHeroCharacter
 * 
 * Official Cubism rendering loads on the client with the original Pixi fallback.
 */
const Live2DCharacter = dynamic(
  () => import("./Live2DCharacter"),
  {
    ssr: false,
    loading: () => (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-[#890149] border-t-transparent animate-spin" />
      </div>
    ),
  }
);

export function AnimatedHeroCharacter() {
  const { reducedMotion, mood } = useSiteExperience();
  return <div className="w-full h-full" data-character-expression={mood}><Live2DCharacter expression={mood} reducedMotionOverride={reducedMotion} /></div>;
}

export default AnimatedHeroCharacter;
