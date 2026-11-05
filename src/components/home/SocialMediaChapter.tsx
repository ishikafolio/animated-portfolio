"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSiteExperience } from "@/components/studio/SiteExperience";
import { ArrowLeft, ArrowRight, ArrowDown, Smartphone, Layers, Monitor, Sparkles } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface SocialCampaign {
  id: string;
  num: string;
  brand: string;
  title: string;
  headline: string;
  tagline: string;
  image: string;
  accentHex: string;
  format: string;
  dimensions: string;
  strategy: string;
  supportingFormat: {
    icon: "story" | "carousel" | "banner";
    label: string;
    specs: string;
    description: string;
  };
  designNotes: string[];
}

const CAMPAIGNS: SocialCampaign[] = [
  {
    id: "nike",
    num: "01",
    brand: "Nike Athletic",
    title: "Air Max 90 — Comfort That Lifts You",
    headline: "Kinetic Streetwear & Typographic Impact",
    tagline: "Air Max 90 · Comfort That Lifts You",
    image: "/projects/social/nike-airmax-social.png",
    accentHex: "#B6FF00",
    format: "1:1 Social Feed Hero",
    dimensions: "1254 × 1254 px",
    strategy: "High-contrast dynamic leap breaking through massive extruded typography to evoke weightlessness and explosive athletic performance.",
    supportingFormat: {
      icon: "story",
      label: "9:16 Vertical Story",
      specs: "1080 × 1920 px",
      description: "Full-bleed kinetic motion banner for Instagram Stories & Reels"
    },
    designNotes: [
      "Extruded bold typography acting as a physical architectural backdrop",
      "Dynamic model pose breaking boundary planes across the brandmark",
      "Glow neon lime swoosh echoing footwear accent details",
      "Halftone screen pattern adding tactile print-making grit"
    ]
  },
  {
    id: "redbull",
    num: "02",
    brand: "Red Bull",
    title: "Defy Gravity — Take Your Energy Higher",
    headline: "Surreal Aerial Surrealism",
    tagline: "Take Your Energy Higher",
    image: "/projects/social/redbull-defy-gravity.png",
    accentHex: "#FFE500",
    format: "1:1 Social Feed Hero",
    dimensions: "1254 × 1254 px",
    strategy: "Surreal visual metaphor transforming the iconic can with feathered wings soaring through high-altitude cloudscapes alongside a skydiver.",
    supportingFormat: {
      icon: "banner",
      label: "16:9 Display Hero",
      specs: "1920 × 1080 px",
      description: "E-commerce hero billboard and programmatic retail ads"
    },
    designNotes: [
      "Photorealistic feathered wing integration with condensation-laden aluminum can",
      "Bold yellow kinetic typography anchoring the sky composition",
      "High-altitude perspective scale using a distant skydiver silhouette",
      "Light trail ribbon guiding eye movement across the visual diagonal"
    ]
  },
  {
    id: "frutta",
    num: "03",
    brand: "Frutta Nectar",
    title: "The Mango Edit — Mango Makes Waves",
    headline: "Vibrant Appetite & Freshness Appeal",
    tagline: "Pour. Sip. Repeat. Turn Up the Taste.",
    image: "/projects/social/frutta-mango-social.png",
    accentHex: "#FFAE00",
    format: "1:1 Social Feed Hero",
    dimensions: "1254 × 1254 px",
    strategy: "Sun-drenched, saturated chromatic harmony contrasting ultramarine blue with ripe golden mango textures to trigger immediate sensory crave.",
    supportingFormat: {
      icon: "story",
      label: "9:16 Reel Asset",
      specs: "1080 × 1920 px",
      description: "Splashing nectar wave dynamic video intro bumper"
    },
    designNotes: [
      "High-saturation royal blue backdrop emphasizing fruit freshness",
      "Juicy diced mango with glistening nectar droplet highlights",
      "Wavy kinetic vector curves leading to carton packaging hero",
      "Layered typography pairing expressive script with bold display"
    ]
  },
  {
    id: "october",
    num: "04",
    brand: "Lifestyle Editorial",
    title: "Welcome October — Seasonal Growth",
    headline: "Atmospheric Fashion & Seasonal Greetings",
    tagline: "May this month bring growth, joy, and good vibes.",
    image: "/projects/social/october-lifestyle-social.jpg",
    accentHex: "#39E58C",
    format: "1:1 Editorial Grid Post",
    dimensions: "3810 × 3810 px (Ultra-HD)",
    strategy: "Editorial lifestyle visual celebrating the change of season through monochromatic emerald fashion, floating star balloons, and elegant typographic breaks.",
    supportingFormat: {
      icon: "carousel",
      label: "4:5 Carousel Slide",
      specs: "1080 × 1350 px",
      description: "Multi-slide fashion moodboard and typography detail crops"
    },
    designNotes: [
      "Coordinated monochrome styling with deep forest and neon green accents",
      "Floating metallic star balloons providing spatial foreground depth",
      "Stacked two-tier month title with script ligature accent",
      "Flowing silk veil background adding soft fluid movement"
    ]
  }
];

export default function SocialMediaChapter() {
  const { reducedMotion } = useSiteExperience();

  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const heroOpeningRef = useRef<HTMLDivElement>(null);
  const heroMaskRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);
  const titleGroupRef = useRef<HTMLDivElement>(null);
  const titleWordRef = useRef<HTMLHeadingElement>(null);

  const galleryWrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Gallery interactive progress
  const [activeIdx, setActiveIdx] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Accessible navigation controls
  const handleNext = () => {
    if (trackRef.current && window.innerWidth < 1024) {
      trackRef.current.scrollBy({ left: trackRef.current.clientWidth * 0.85, behavior: "smooth" });
      return;
    }
    if (containerRef.current) {
      const step = window.innerHeight * 0.7;
      window.scrollBy({ top: step, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (trackRef.current && window.innerWidth < 1024) {
      trackRef.current.scrollBy({ left: -trackRef.current.clientWidth * 0.85, behavior: "smooth" });
      return;
    }
    if (containerRef.current) {
      const step = window.innerHeight * 0.7;
      window.scrollBy({ top: -step, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (reducedMotion) {
      const targets = [
        heroOpeningRef.current,
        heroMaskRef.current,
        heroImageRef.current,
        titleWordRef.current,
        trackRef.current,
      ];
      targets.forEach((el) => {
        if (el) gsap.set(el, { clearProps: "all" });
      });
      return;
    }

    if (!containerRef.current || !stageRef.current || !trackRef.current) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // DESKTOP: Bounded sticky stage where vertical scroll drives horizontal gallery
      mm.add("(min-width: 1024px)", () => {
        const track = trackRef.current;
        if (!track) return;

        // Calculate travel distance from content scrollWidth
        const getTravelDistance = () => {
          return Math.max(0, track.scrollWidth - window.innerWidth + 160);
        };

        const totalTravel = getTravelDistance();

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: () => `+=${totalTravel + window.innerHeight * 0.7}`,
            pin: stageRef.current,
            scrub: 1.0,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              setScrollProgress(Math.round(self.progress * 100));
              const idx = Math.min(
                CAMPAIGNS.length - 1,
                Math.floor(self.progress * CAMPAIGNS.length)
              );
              setActiveIdx(idx);
            },
          },
        });

        // -------------------------------------------------------------
        // BEAT 1: 0% -> 22%
        // Chapter Opening: Directional panel reveal & diagonal drift with readable pause
        // -------------------------------------------------------------
        if (heroMaskRef.current) {
          tl.fromTo(
            heroMaskRef.current,
            { clipPath: "inset(0% 100% 0% 0%)", opacity: 0.8 },
            { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, ease: "power2.out", duration: 0.18 },
            0
          );
        }

        if (heroImageRef.current) {
          tl.fromTo(
            heroImageRef.current,
            { scale: 0.96, x: -30, y: 20 },
            { scale: 1.05, x: 0, y: 0, ease: "power2.out", duration: 0.22 },
            0
          );
        }

        if (titleWordRef.current) {
          tl.fromTo(
            titleWordRef.current,
            { scale: 1.2, y: -35, opacity: 0.2 },
            { scale: 1.0, y: 0, opacity: 1, ease: "power2.out", duration: 0.18 },
            0
          );
        }

        // Readable pause on hero
        tl.to({}, { duration: 0.08 }, 0.18);

        // -------------------------------------------------------------
        // BEAT 2: 26% -> 92%
        // Transition hero into horizontal gallery track
        // -------------------------------------------------------------
        if (heroOpeningRef.current) {
          tl.to(
            heroOpeningRef.current,
            { opacity: 0, scale: 0.94, y: -40, pointerEvents: "none", duration: 0.14 },
            0.26
          );
        }

        if (galleryWrapRef.current) {
          tl.fromTo(
            galleryWrapRef.current,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.12 },
            0.28
          );
        }

        // Advance horizontal track
        tl.to(
          track,
          {
            x: () => -getTravelDistance(),
            ease: "none",
            duration: 0.64,
          },
          0.28
        );

        // -------------------------------------------------------------
        // BEAT 3: 92% -> 100%
        // Settle cleanly on final project before releasing pin
        // -------------------------------------------------------------
        tl.to({}, { duration: 0.08 }, 0.92);
      });

      // MOBILE: Natural horizontal swipeable track, cinematic mask reveal & gentle scroll entrance
      mm.add("(max-width: 1023px)", () => {
        const mobileHeroTl = gsap.timeline({
          scrollTrigger: {
            trigger: heroOpeningRef.current,
            start: "top 80%",
            end: "top 25%",
            scrub: 0.6,
          },
        });

        if (titleWordRef.current) {
          mobileHeroTl.fromTo(
            titleWordRef.current,
            { y: 25, opacity: 0.25 },
            { y: 0, opacity: 1, ease: "power2.out", duration: 0.3 },
            0
          );
        }

        if (heroMaskRef.current) {
          mobileHeroTl.fromTo(
            heroMaskRef.current,
            { clipPath: "inset(0% 100% 0% 0%)", opacity: 0.7 },
            { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, ease: "power2.out", duration: 0.5 },
            0.05
          );
        }

        if (heroImageRef.current) {
          mobileHeroTl.fromTo(
            heroImageRef.current,
            { scale: 1.08, x: -20 },
            { scale: 1.0, x: 0, ease: "power2.out", duration: 0.5 },
            0.05
          );
        }

        if (trackRef.current) {
          gsap.fromTo(
            trackRef.current,
            { opacity: 0.75, y: 35 },
            {
              opacity: 1,
              y: 0,
              ease: "power2.out",
              scrollTrigger: {
                trigger: trackRef.current,
                start: "top 85%",
                end: "top 50%",
                scrub: 0.6,
              },
            }
          );
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={containerRef}
      id="chapter-social"
      className="relative w-full bg-[#090C14] text-[#F3F3E7] select-none scroll-mt-[var(--nav-height,64px)] border-t border-white/10"
      aria-label="Chapter 05: Social Media Campaigns"
    >
      {/* =========================================================================
          STAGE (Sticky on desktop during scrub, natural flow on mobile)
          ========================================================================= */}
      <div
        ref={stageRef}
        className="w-full min-h-screen lg:h-screen lg:sticky lg:top-0 lg:overflow-hidden overflow-visible flex flex-col justify-between pt-[calc(var(--nav-height,64px)+0.75rem)] pb-4 px-4 sm:px-6 lg:px-8 max-w-full"
      >
        {/* TOP HEADER & CAMPAIGN SELECTOR TABS */}
        <header className="relative z-30 flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/15 font-mono text-[11px] sm:text-xs tracking-wider uppercase max-w-7xl mx-auto w-full shrink-0">
          <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Select Campaign">
            {CAMPAIGNS.map((c, i) => {
              const isSelected = activeIdx === i;
              return (
                <button
                  key={c.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => {
                    setActiveIdx(i);
                    if (trackRef.current) {
                      const child = trackRef.current.children[i] as HTMLElement;
                      if (child) {
                        child.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
                      }
                    }
                  }}
                  className={`px-3 sm:px-3.5 py-2 sm:py-1.5 min-h-[44px] sm:min-h-0 flex items-center justify-center rounded-xl text-xs font-mono font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#B6FF00] text-black shadow-md border border-[#B6FF00]"
                      : "bg-white/5 text-white/70 hover:text-white hover:bg-white/10 border border-white/10"
                  }`}
                >
                  0{i + 1} — {c.brand}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-4">
            {/* Active Format Badge */}
            <div className="flex items-center gap-2 font-mono text-xs text-[#B6FF00]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B6FF00] animate-pulse" />
              <span>{CAMPAIGNS[activeIdx].format}</span>
            </div>

            {/* Accessible Previous / Next buttons */}
            <div className="flex items-center gap-1.5" role="group" aria-label="Gallery controls">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous campaign"
                className="w-10 h-10 sm:w-8 sm:h-8 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 rounded-full bg-white/5 hover:bg-white/15 border border-white/15 flex items-center justify-center text-white/80 hover:text-white transition-all active:scale-95 cursor-pointer"
              >
                <ArrowLeft size={14} />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next campaign"
                className="w-10 h-10 sm:w-8 sm:h-8 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 rounded-full bg-white/5 hover:bg-white/15 border border-white/15 flex items-center justify-center text-white/80 hover:text-white transition-all active:scale-95 cursor-pointer"
              >
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </header>

        {/* =========================================================================
            LAYER 1: CINEMATIC CHAPTER OPENING (Reveals on entry, fades as gallery slides)
            ========================================================================= */}
        <div
          ref={heroOpeningRef}
          className="relative lg:absolute inset-x-0 top-[calc(var(--nav-height,64px)+3.5rem)] bottom-16 z-20 flex flex-col items-center justify-center px-4 sm:px-6 pointer-events-auto"
        >
          <div ref={titleGroupRef} className="mb-4 text-center max-w-2xl mx-auto">
            <h2
              ref={titleWordRef}
              className="font-cubao text-4xl sm:text-6xl lg:text-7xl uppercase tracking-tight text-white leading-none"
            >
              Social Media
            </h2>
            <p className="font-sans text-xs sm:text-sm lg:text-base text-white/75 mt-2 leading-relaxed">
              Start with the coordinated wave. As you scroll, explore each campaign architecture from explosive streetwear typography to surreal aerial flight.
            </p>
          </div>

          {/* Cumulative Chapter Artwork with Directional Panel Reveal */}
          <div
            ref={heroMaskRef}
            className="relative w-full max-w-4xl aspect-[16/10] sm:aspect-[16/9] max-h-[380px] sm:max-h-[420px] rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-[#0F1F12] group"
            style={{ clipPath: "inset(0% 0% 0% 0%)" }}
          >
            <div ref={heroImageRef} className="relative w-full h-full">
              <Image
                src="/projects/exhibition/social-media-hero.png"
                alt="Four Campaigns in a Cinematic Wave — Social Media Chapter Opening"
                fill
                sizes="(max-width: 1024px) 100vw, 1100px"
                className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.01]"
                priority
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-white/90">
              <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[#B6FF00]">
                Four Campaigns in a Cinematic Wave
              </span>
              <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
                Scroll to Enter Horizontal Gallery →
              </span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            LAYER 2: HORIZONTAL SCROLLING EDITORIAL GRID
            Sequence of project columns showing ~1 large project and part of next
            ========================================================================= */}
        <div
          ref={galleryWrapRef}
          className="relative z-10 my-auto w-full overflow-hidden py-2"
        >
          <div
            ref={trackRef}
            className="flex flex-row items-center gap-6 sm:gap-10 lg:gap-14 overflow-x-auto lg:overflow-x-visible snap-x snap-mandatory scrollbar-none touch-pan-x touch-pan-y px-4 sm:px-8 lg:px-12 will-change-transform"
          >
            {CAMPAIGNS.map((c, index) => (
              <article
                key={c.id}
                id={`campaign-${c.id}`}
                className="shrink-0 snap-center w-[85vw] sm:w-[75vw] lg:w-[62vw] max-w-[850px] h-auto lg:max-h-[min(540px,calc(100vh-var(--nav-height,64px)-120px))] rounded-2xl sm:rounded-3xl bg-[#0F1411] border border-white/15 p-4 sm:p-6 lg:p-7 shadow-2xl relative overflow-hidden flex flex-col justify-between"
                aria-label={`${c.brand}: ${c.title}`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
                  {/* PROMINENT BOLD SQUARE ARTWORK (Substantial scale, no clipping top or bottom) */}
                  <div className="lg:col-span-7 relative w-full aspect-square max-h-[min(440px,calc(100vh-var(--nav-height,64px)-180px))] rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-[#07090C] group mx-auto">
                    <Image
                      src={c.image}
                      alt={`${c.title} — ${c.headline}`}
                      fill
                      sizes="(max-width: 1024px) 85vw, 550px"
                      className="object-contain object-center transition-transform duration-700 group-hover:scale-[1.01]"
                      priority={index === 0}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs font-mono text-white/90">
                      <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-1.5 text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.accentHex }} />
                        <span>{c.format}</span>
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px]">
                        {c.dimensions}
                      </span>
                    </div>
                  </div>

                  {/* PROJECT INFORMATION & CAPTIONS */}
                  <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.accentHex }} />
                        <span className="font-mono text-xs uppercase tracking-widest text-white/60">
                          05{String.fromCharCode(65 + index)} · {c.brand}
                        </span>
                      </div>

                      <h3 className="font-cubao text-2xl sm:text-3xl text-white uppercase tracking-tight leading-tight">
                        {c.title}
                      </h3>

                      <p className="font-mono text-xs mt-1 uppercase" style={{ color: c.accentHex }}>
                        {c.headline}
                      </p>

                      <p className="font-sans text-xs sm:text-sm text-white/80 mt-2.5 leading-relaxed">
                        {c.strategy}
                      </p>
                    </div>

                    {/* SUPPORTING FORMAT CHIP */}
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 font-mono text-xs flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-7 h-9 rounded-md flex items-center justify-center shrink-0 border"
                          style={{
                            backgroundColor: `${c.accentHex}15`,
                            borderColor: `${c.accentHex}40`,
                            color: c.accentHex,
                          }}
                        >
                          {c.supportingFormat.icon === "story" ? (
                            <Smartphone size={14} />
                          ) : c.supportingFormat.icon === "carousel" ? (
                            <Layers size={14} />
                          ) : (
                            <Monitor size={14} />
                          )}
                        </div>
                        <div>
                          <span className="block font-semibold uppercase text-[10px]" style={{ color: c.accentHex }}>
                            {c.supportingFormat.label}
                          </span>
                          <span className="text-white/70 font-sans text-[11px] line-clamp-1">
                            {c.supportingFormat.description}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] text-white/50 shrink-0 font-mono">
                        {c.supportingFormat.specs}
                      </span>
                    </div>

                    {/* CRAFT EXECUTION HIGHLIGHTS */}
                    <div className="space-y-1.5 pt-3 border-t border-white/10 font-mono text-xs">
                      <span className="block text-white/50 text-[10px] uppercase tracking-wider mb-1">
                        Craft Execution Highlights
                      </span>
                      {c.designNotes.slice(0, 2).map((note, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-white/80">
                          <span className="text-[10px] shrink-0 mt-0.5" style={{ color: c.accentHex }}>
                            0{idx + 1}
                          </span>
                          <span className="font-sans text-xs leading-tight">{note}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* BOTTOM METADATA, PROGRESS BAR & TRANSITION CUE */}
        <footer className="relative z-30 flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/10 font-mono text-xs text-white/60 max-w-7xl mx-auto w-full shrink-0">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#B6FF00]" />
            <span className="text-[11px] uppercase tracking-wider">
              Horizontal Campaign Gallery · Scroll to Advance
            </span>
          </div>

          {/* Visual Track Progress Bar */}
          <div className="w-full sm:w-64 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#B6FF00] to-[#FFE500] rounded-full transition-all duration-150"
              style={{
                width: `${Math.max(15, scrollProgress)}%`,
              }}
            />
          </div>

          <a
            href="#chapter-flyers"
            className="inline-flex items-center gap-1.5 text-[#B6FF00] hover:text-white transition-colors text-[11px]"
          >
            <span>Next: 06 / Flyer Design</span>
            <ArrowDown size={12} className="animate-bounce" />
          </a>
        </footer>
      </div>
    </section>
  );
}
