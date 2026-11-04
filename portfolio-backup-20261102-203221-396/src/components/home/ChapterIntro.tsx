"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles, ArrowDown, ChevronRight, Layers, Smartphone, Box, Calendar } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export type ChapterType = "logo" | "uiux" | "packaging" | "experience";

interface ChapterIntroProps {
  id: string;
  chapterNumber: string;
  category: string;
  title: string;
  subtitle: string;
  type: ChapterType;
  targetId: string;
}

export function ChapterIntro({
  id,
  chapterNumber,
  category,
  title,
  subtitle,
  type,
  targetId,
}: ChapterIntroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isMobile = window.innerWidth < 1024;

    if (prefersReducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // Desktop: Pinned interactive scrub timeline (~130vh total scroll distance)
      if (!isMobile) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "+=130%",
            pin: true,
            scrub: 1.2,
            anticipatePin: 1,
          },
        });

        // Stage 1 (0–35%): Elements assemble & scale in
        if (visualRef.current) {
          const kineticItems = visualRef.current.querySelectorAll(".kinetic-element");
          tl.fromTo(
            kineticItems,
            { scale: 0.7, opacity: 0, y: 50 },
            { scale: 1, opacity: 1, y: 0, stagger: 0.08, ease: "power2.out" },
            0
          );
        }

        // Stage 2 (35–70%): Title locks into place with punchy scale
        if (titleRef.current) {
          tl.fromTo(
            titleRef.current,
            { scale: 0.9, y: 30, opacity: 0 },
            { scale: 1, y: 0, opacity: 1, ease: "power3.out" },
            0.3
          );
        }

        // Stage 3 (70–100%): Mask expansion / reveal toward project content
        if (maskRef.current) {
          tl.to(
            maskRef.current,
            {
              scaleY: 0,
              transformOrigin: "bottom center",
              ease: "power2.inOut",
            },
            0.7
          );
        }
      } else {
        // Mobile: Elegant scroll-triggered entrance without heavy pinning
        const mobileEl = containerRef.current?.querySelector(".mobile-container");
        if (mobileEl) {
          gsap.from(mobileEl, {
            opacity: 0,
            y: 40,
            duration: 0.85,
            ease: "power2.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 80%",
              once: true,
            },
          });
        }
      }
    }, containerRef);

    return () => ctx.revert();
  }, [type]);

  const handleSkip = () => {
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      ref={containerRef}
      id={id}
      className={`relative w-full min-h-[90vh] lg:min-h-screen flex flex-col justify-between overflow-hidden select-none ${
        type === "logo"
          ? "bg-[#1C0D15] text-[#F3F3E7]"
          : type === "uiux"
          ? "bg-[#1E1B2E] text-[#F3F3E7]"
          : type === "packaging"
          ? "bg-[#16221A] text-[#F3F3E7]"
          : "bg-[#24121B] text-[#F3F3E7]"
      }`}
      aria-label={`Chapter Introduction: ${title}`}
    >
      {/* Background Graphic Grid / Vector Motif */}
      <div className="absolute inset-0 pointer-events-none opacity-15 overflow-hidden">
        {type === "logo" && (
          <div className="w-full h-full bg-[radial-gradient(#890149_1.5px,transparent_1.5px)] [background-size:32px_32px]" />
        )}
        {type === "uiux" && (
          <div className="w-full h-full bg-[linear-gradient(to_right,#890149_1px,transparent_1px),linear-gradient(to_bottom,#890149_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        )}
        {type === "packaging" && (
          <div className="w-full h-full bg-[radial-gradient(#5C6B47_1.5px,transparent_1.5px)] [background-size:28px_28px]" />
        )}
        {type === "experience" && (
          <div className="w-full h-full bg-[linear-gradient(to_bottom,#890149_1px,transparent_1px)] bg-[size:100%_3rem]" />
        )}
      </div>

      {/* Top Chapter Status Bar */}
      <div className="max-w-7xl mx-auto w-full pt-20 sm:pt-24 px-4 sm:px-6 lg:px-8 flex items-center justify-between z-20 relative">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-bold px-3 py-1 rounded-full bg-[#890149] text-white">
            CHAPTER {chapterNumber}
          </span>
          <span className="font-mono text-xs uppercase tracking-widest text-white/70 hidden sm:inline-block">
            {category}
          </span>
        </div>

        <button
          type="button"
          onClick={handleSkip}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-mono uppercase tracking-wider text-white transition-all backdrop-blur-sm active:scale-95"
          aria-label={`Skip ${title} intro and jump to projects`}
        >
          <span>Skip to Work</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Center Kinetic Stage (Desktop Pinned & Interactive / Mobile Staggered) */}
      <div className="mobile-container max-w-7xl mx-auto w-full my-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 z-20 relative flex flex-col items-center text-center">
        
        {/* Kinetic Icon & Symbol Choreography */}
        <div ref={visualRef} className="relative w-full max-w-2xl mb-8 flex justify-center items-center">
          {type === "logo" && (
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              <div className="kinetic-element w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#890149] text-white flex items-center justify-center font-display text-2xl shadow-lg border border-white/20">
                B
              </div>
              <div className="kinetic-element w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#2D5A3E] text-white flex items-center justify-center font-display text-2xl shadow-lg border border-white/20">
                V
              </div>
              <div className="kinetic-element w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#8E2800] text-white flex items-center justify-center font-display text-2xl shadow-lg border border-white/20">
                N
              </div>
              <div className="kinetic-element w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#1B4965] text-white flex items-center justify-center font-display text-2xl shadow-lg border border-white/20">
                L
              </div>
              <div className="kinetic-element w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#C84B31] text-white flex items-center justify-center font-display text-2xl shadow-lg border border-white/20">
                T
              </div>
              <div className="kinetic-element w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#6C5CE7] text-white flex items-center justify-center font-display text-2xl shadow-lg border border-white/20">
                P
              </div>
            </div>
          )}

          {type === "uiux" && (
            <div className="flex items-center justify-center gap-4 sm:gap-8">
              <div className="kinetic-element w-28 sm:w-36 aspect-[9/16] rounded-2xl border-2 border-[#890149] bg-white/5 p-2 flex flex-col justify-between shadow-2xl backdrop-blur-sm -rotate-6">
                <div className="w-8 h-1.5 rounded-full bg-[#890149] mx-auto" />
                <div className="space-y-1.5 my-auto">
                  <div className="w-full h-2 rounded bg-white/20" />
                  <div className="w-3/4 h-2 rounded bg-white/20" />
                </div>
                <div className="w-full h-6 rounded-lg bg-[#890149]/40 flex items-center justify-center text-[8px] font-mono">
                  Parent Flow
                </div>
              </div>
              <div className="kinetic-element w-32 sm:w-40 aspect-[9/16] rounded-2xl border-2 border-white/40 bg-white/10 p-2.5 flex flex-col justify-between shadow-2xl backdrop-blur-md z-10 scale-105">
                <div className="w-10 h-1.5 rounded-full bg-white/60 mx-auto" />
                <div className="space-y-2 my-auto">
                  <div className="w-full h-3 rounded bg-[#890149]" />
                  <div className="w-4/5 h-2.5 rounded bg-white/30" />
                  <div className="w-2/3 h-2.5 rounded bg-white/30" />
                </div>
                <div className="w-full h-7 rounded-lg bg-[#890149] text-white flex items-center justify-center text-[9px] font-mono font-bold">
                  CareConnect UI
                </div>
              </div>
              <div className="kinetic-element w-28 sm:w-36 aspect-[9/16] rounded-2xl border-2 border-white/20 bg-white/5 p-2 flex flex-col justify-between shadow-2xl backdrop-blur-sm rotate-6">
                <div className="w-8 h-1.5 rounded-full bg-white/30 mx-auto" />
                <div className="space-y-1.5 my-auto">
                  <div className="w-full h-2 rounded bg-white/20" />
                  <div className="w-3/4 h-2 rounded bg-white/20" />
                </div>
                <div className="w-full h-6 rounded-lg bg-white/10 flex items-center justify-center text-[8px] font-mono">
                  Caregiver
                </div>
              </div>
            </div>
          )}

          {type === "packaging" && (
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              {[
                { name: "Blueberry", color: "#4B4278" },
                { name: "Butterly", color: "#A86D37" },
                { name: "Cocoa", color: "#543026" },
                { name: "Cookieej", color: "#243E63" },
                { name: "Strawberry", color: "#8C1D40" },
                { name: "Mango", color: "#C86A18" },
                { name: "Pistachio", color: "#617A38" },
              ].map((flv, idx) => (
                <div
                  key={flv.name}
                  className="kinetic-element px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl text-white font-mono text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg border border-white/10"
                  style={{ backgroundColor: flv.color }}
                >
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  <span>{flv.name}</span>
                </div>
              ))}
            </div>
          )}

          {type === "experience" && (
            <div className="flex items-center justify-center gap-4 sm:gap-8 font-mono">
              <div className="kinetic-element px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-center">
                <span className="block text-2xl sm:text-3xl font-display text-[#890149]">2024</span>
                <span className="text-[11px] text-white/60">UI/UX Craft</span>
              </div>
              <div className="w-12 h-0.5 bg-gradient-to-r from-white/20 via-[#890149] to-white/20" />
              <div className="kinetic-element px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-center scale-110 shadow-lg">
                <span className="block text-2xl sm:text-3xl font-display text-white">2025</span>
                <span className="text-[11px] text-[#890149] font-bold">Systems</span>
              </div>
              <div className="w-12 h-0.5 bg-gradient-to-r from-white/20 via-[#890149] to-white/20" />
              <div className="kinetic-element px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-center">
                <span className="block text-2xl sm:text-3xl font-display text-[#890149]">2026</span>
                <span className="text-[11px] text-white/60">Lead Direction</span>
              </div>
            </div>
          )}
        </div>

        {/* Big Kinetic Title Typography */}
        <h2
          ref={titleRef}
          className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl uppercase tracking-tight leading-[0.9] text-white mb-6 drop-shadow-md"
        >
          {title}
        </h2>

        {/* Subtitle / Concept Statement */}
        <p className="font-sans text-base sm:text-xl text-white/80 max-w-2xl font-light leading-relaxed">
          {subtitle}
        </p>

        {/* Editorial Scroll Cue */}
        <div className="mt-8 flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-white/50">
          <span>Scroll to enter chapter</span>
          <ArrowDown className="w-3.5 h-3.5 text-[#890149] animate-bounce" />
        </div>
      </div>

      {/* Bottom Pinned Mask Layer (Uncurtains into the content) */}
      <div
        ref={maskRef}
        className="absolute inset-0 bg-[#F3F3E7] pointer-events-none z-10 origin-bottom scale-y-0"
        aria-hidden="true"
      />
    </section>
  );
}

export default ChapterIntro;
