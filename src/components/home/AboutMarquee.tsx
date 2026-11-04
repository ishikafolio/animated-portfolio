"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { useSiteExperience } from "@/components/studio/SiteExperience";

const MARQUEE_ITEMS = [
  "UI/UX DESIGN",
  "BRAND IDENTITY",
  "TACTILE PACKAGING",
  "EDITORIAL ART DIRECTION",
  "MOTION PROTOTYPES",
  "ACCESSIBLE SYSTEMS",
  "VISUAL STORYTELLING",
];

export function AboutMarquee() {
  const { reducedMotion } = useSiteExperience();
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = reducedMotion;

    if (prefersReducedMotion || !marqueeRef.current) return;

    const el = marqueeRef.current;
    const tween = gsap.to(el, {
      xPercent: -50,
      ease: "none",
      duration: 24,
      repeat: -1,
    });

    const handleMouseEnter = () => tween.timeScale(0.3);
    const handleMouseLeave = () => tween.timeScale(1);

    el.addEventListener("mouseenter", handleMouseEnter);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      tween.kill();
      gsap.set(el, { clearProps: "transform" });
      el.removeEventListener("mouseenter", handleMouseEnter);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [reducedMotion]);

  return (
    <div
      className="w-full overflow-hidden py-4 sm:py-6 border-y border-[#24121B]/15 bg-[#F3F3E7] select-none"
      aria-label="Design Disciplines Marquee"
    >
      <div
        ref={marqueeRef}
        className="flex items-center gap-8 whitespace-nowrap will-change-transform cursor-default"
        style={{ width: "fit-content" }}
      >
        {/* Render twice for seamless infinite loop */}
        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, idx) => (
          <div key={`${item}-${idx}`} className="flex items-center gap-8">
            <span className="font-display text-xl sm:text-2xl lg:text-3xl uppercase tracking-wider text-[#24121B]/80 hover:text-[#890149] transition-colors">
              {item}
            </span>
            <span className="w-2 h-2 rounded-full bg-[#890149]" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default AboutMarquee;

