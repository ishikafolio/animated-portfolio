"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ArrowDown, ArrowUpRight, Sparkles } from "lucide-react";
import AnimatedHeroCharacter from "./AnimatedHeroCharacter";

export function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const characterWrapperRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const bgTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // 0–0.4s: Background subtle architectural layer reveal
      if (bgTextRef.current) {
        tl.fromTo(
          bgTextRef.current,
          { opacity: 0, scale: 0.96 },
          { opacity: 0.05, scale: 1, duration: 1.2, ease: "power2.out" },
          0
        );
      }

      // 0.2–0.9s: Staggered Cubao Headline lines reveal
      if (headlineRef.current) {
        const lines = headlineRef.current.querySelectorAll(".headline-line");
        tl.fromTo(
          lines,
          { opacity: 0, y: 40, skewY: 2 },
          { opacity: 1, y: 0, skewY: 0, duration: 0.85, stagger: 0.12 },
          0.2
        );
      }

      // 0.4–1.2s: Character reveal with smooth vertical rise and slight overshoot
      if (characterWrapperRef.current) {
        tl.fromTo(
          characterWrapperRef.current,
          { opacity: 0, y: 50, scale: 0.94 },
          { opacity: 1, y: 0, scale: 1, duration: 1.05, ease: "back.out(1.15)" },
          0.35
        );
      }

      // 0.7–1.4s: Eyebrow, Descriptor bio, and CTAs fade & slide up
      if (detailsRef.current) {
        const items = detailsRef.current.querySelectorAll(".hero-detail-item");
        tl.fromTo(
          items,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.65, stagger: 0.08 },
          0.65
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[720px] lg:min-h-[86vh] flex flex-col justify-between pt-28 sm:pt-32 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#F3F3E7]"
      aria-label="Ishika Shrivastav Hero Stage"
    >
      {/* Sliced Architectural Background Watermark Layer */}
      <div
        ref={bgTextRef}
        className="absolute inset-0 pointer-events-none select-none flex items-center justify-center overflow-hidden opacity-0 z-0"
        aria-hidden="true"
      >
        <div className="flex flex-col items-center">
          <span className="font-display text-[22vw] uppercase text-[#890149] leading-[0.8] whitespace-nowrap tracking-tight">
            ISHIKA
          </span>
          <span className="font-display text-[14vw] uppercase text-[#24121B] leading-[0.8] whitespace-nowrap tracking-widest opacity-40">
            DIRECTION
          </span>
        </div>
      </div>

      {/* Top Editorial Eyebrow & Status Row */}
      <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-10 relative">
        <div className="flex items-center gap-2.5">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#890149] animate-pulse" />
          <span className="font-mono text-xs uppercase tracking-widest text-[#24121B]/80 font-semibold">
            ISHIKA SHRIVASTAV / INDEPENDENT DESIGNER
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#890149]/10 text-[#890149] text-xs font-medium tracking-wide">
            <Sparkles className="w-3 h-3" />
            <span>Open for creative opportunities</span>
          </span>
          <span className="hidden sm:inline-block text-xs font-mono text-[#24121B]/40">
            2026 EDITION
          </span>
        </div>
      </div>

      {/* Main Asymmetric Stage: Typography Choreography (Left) + 2.5D Anime Character (Right-Center) */}
      <div className="max-w-7xl mx-auto w-full my-auto py-6 sm:py-8 z-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column (55% width): Large Choreographed Editorial Typography */}
          <div className="lg:col-span-7 flex flex-col justify-center order-2 lg:order-1">
            <div className="mb-3">
              <span className="font-mono text-xs uppercase tracking-widest text-[#890149] font-semibold bg-[#890149]/10 px-3 py-1 rounded-full">
                Creative Direction & Product Design
              </span>
            </div>

            <h1
              ref={headlineRef}
              className="font-display text-5xl sm:text-7xl lg:text-[5.5rem] xl:text-[6.2rem] uppercase tracking-tight leading-[0.9] text-[#24121B] select-none mb-6"
            >
              <span className="headline-line block text-[#890149]">
                I DESIGN
              </span>
              <span className="headline-line block text-[#24121B]">
                WITH FEELING.
              </span>
            </h1>

            <div ref={detailsRef} className="space-y-6">
              <p className="hero-detail-item text-base sm:text-lg text-[#24121B]/85 font-light leading-relaxed max-w-xl">
                Bridging bold editorial character, human-first product systems, and tactile packaging craft with intentional restraint and warmth.
              </p>

              <div className="hero-detail-item flex flex-wrap items-center gap-4">
                <Link
                  href="#work"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#890149] text-[#F3F3E7] text-xs sm:text-sm font-semibold uppercase tracking-wider hover:bg-[#6B0139] transition-all shadow-md active:scale-95 focus-visible:outline-[#890149]"
                >
                  <span>Explore Selected Work</span>
                  <ArrowDown className="w-4 h-4" />
                </Link>

                <Link
                  href="#contact"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#24121B] text-[#F3F3E7] text-xs sm:text-sm font-semibold uppercase tracking-wider hover:bg-black transition-all shadow-sm active:scale-95 focus-visible:outline-[#890149]"
                >
                  <span>Start a Conversation</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Verified Details Pill Strip */}
              <div className="hero-detail-item pt-2 flex flex-wrap items-center gap-3 text-xs font-mono text-[#24121B]/60">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#890149]" />
                  <span>UI/UX Design</span>
                </span>
                <span>·</span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#890149]" />
                  <span>Brand Identity</span>
                </span>
                <span>·</span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#890149]" />
                  <span>Packaging Systems</span>
                </span>
              </div>
            </div>
          </div>

          {/* Right Column (45% width): Staged 2.5D Anime Character (68–76vh height) */}
          <div
            ref={characterWrapperRef}
            className="lg:col-span-5 flex items-center justify-center order-1 lg:order-2 relative"
          >
            <div className="relative w-72 sm:w-80 md:w-96 lg:w-[420px] xl:w-[460px] aspect-[1024/1536] max-h-[68vh] lg:max-h-[76vh]">
              <AnimatedHeroCharacter />
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Hairline Grid Accents */}
      <div className="max-w-7xl mx-auto w-full z-10 pt-4 border-t border-[#24121B]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#24121B]/50">
        <div className="flex items-center gap-4">
          <span>PORTFOLIO 2026</span>
          <span>·</span>
          <span>BASED IN INDIA</span>
          <span>·</span>
          <span>GLOBAL REACH</span>
        </div>
        <div className="flex items-center gap-2">
          <span>SCROLL DOWN FOR CINEMATIC INTROS</span>
          <ArrowDown className="w-3.5 h-3.5 text-[#890149] animate-bounce" />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
