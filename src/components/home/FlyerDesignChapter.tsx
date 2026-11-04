"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSiteExperience } from "@/components/studio/SiteExperience";
import { ArrowLeft, ArrowRight, ArrowDown, FileText, Sparkles, Layers } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface FlyerItem {
  id: string;
  num: string;
  client: string;
  title: string;
  headline: string;
  category: string;
  image: string;
  dimensions: string;
  stock: string;
  focusArea: string;
  leadCopy: string;
  staggerOffset: string;
  designHighlights: string[];
}

const FLYERS: FlyerItem[] = [
  {
    id: "drag-studio",
    num: "01",
    client: "Drag Studio",
    title: "The Saffron Edit — Wear Your Emotion",
    headline: "High Fashion Scarf Collection Editorial",
    category: "Fashion Editorial Print",
    image: "/projects/flyers/drag-studio-saffron-flyer.png",
    dimensions: "1092 × 1440 px (Portrait Tabloid)",
    stock: "Uncoated Warm Matte 240gsm",
    focusArea: "Stacked geometric outline typography & dramatic saffron textile texture",
    leadCopy: "Statement scarves. Bold colour. Effortless expression. Avant-garde editorial fashion piece with draped saffron orange fabric enveloping the model's gaze.",
    staggerOffset: "lg:translate-y-0",
    designHighlights: [
      "Stacked geometric outline typography 'DRAG' with negative-space optical lockup",
      "Vibrant saffron orange chromatic dominance contrasting with porcelain skin tones",
      "CTA pill 'Shop The Collection' anchoring the lower third with directional arrow"
    ]
  },
  {
    id: "streetwear",
    num: "02",
    client: "Urban Culture",
    title: "Own Your Edge — The Streetwear Collection",
    headline: "Distressed Denim & Retro Streetwear Poster",
    category: "Streetwear Brand Flyer",
    image: "/projects/flyers/streetwear-edge-flyer.jpg",
    dimensions: "1054 × 1493 px (A3 Print)",
    stock: "Distressed Heavy Kraft Poster Paper",
    focusArea: "Distressed retro letterforms 'OWN YOUR EDGE.' and textural halftone grain",
    leadCopy: "Oversized knits. Statement eyewear. Everyday attitude. Express your everyday with bold athletic knitwear and gritty urban attitude.",
    staggerOffset: "lg:translate-y-5",
    designHighlights: [
      "Distressed 90s-inspired bold display lettering with printed crease artifacts",
      "Deep indigo textural background with chalky ink grain and fold creases",
      "Neon lime underline accenting the bottom shop CTA"
    ]
  },
  {
    id: "naturea",
    num: "03",
    client: "Naturéa Natural Skincare",
    title: "Coffee Body Scrub — Smooth Radiant Skin",
    headline: "Tactile Ripped-Paper Product Presentation",
    category: "Organic Cosmetics Flyer",
    image: "/projects/flyers/naturea-coffee-scrub-flyer.jpg",
    dimensions: "1417 × 2008 px (Editorial 300DPI)",
    stock: "Recycled Heavy Cardstock with Kraft Flakes",
    focusArea: "Torn paper trompe-l'œil with glistening roasted coffee beans and ground granules",
    leadCopy: "Arabica Coffee Extract & Shea Butter. Exfoliate · Nourish · Rejuvenate. A sensory product reveal bursting through tactile ripped kraft paper.",
    staggerOffset: "lg:-translate-y-4",
    designHighlights: [
      "Torn textured parchment border creating physical three-dimensional reveal",
      "Glistening whole roasted coffee beans with dewy botanical leaves",
      "Chunky serif headline 'SMOOTH RADIANT SKIN' grounding the base"
    ]
  },
  {
    id: "street-roll",
    num: "04",
    client: "Street Roll Fast-Casual",
    title: "Hungry? Let's Roll! — Grab Your Bite",
    headline: "Energetic Retro-Pop Food Advertisement",
    category: "Hospitality & Fast Casual Flyer",
    image: "/projects/flyers/street-roll-food-flyer.jpg",
    dimensions: "1417 × 2008 px (High-Impact Poster)",
    stock: "Gloss Coated Menu Flyer 170gsm",
    focusArea: "Bubbly retro arched typography and circular dimensional pop-out portal",
    leadCopy: "Fresh wraps bursting with flavour. Vibrant retro-pop food flyer with checkerboard background, circular portal, and flying fresh basil leaves.",
    staggerOffset: "lg:translate-y-5",
    designHighlights: [
      "Bubbly, arched retro headline 'HUNGRY? LET'S ROLL!' in deep terracotta red",
      "Subject stepping out from circular sky portal creating immersive depth",
      "Warm pastel checkerboard pattern delivering retro diner nostalgia"
    ]
  },
  {
    id: "dental",
    num: "05",
    client: "Clínica Dental",
    title: "Feliz Dia Do Dentista — Dedicação Que Transforma",
    headline: "Clinical Awareness & 3D Orthodontic Poster",
    category: "Healthcare Editorial Flyer",
    image: "/projects/flyers/dental-clinic-flyer.jpg",
    dimensions: "1080 × 1440 px (Social & Print)",
    stock: "Silk Finish 200gsm Poster",
    focusArea: "3D dental chair flanked by giant polished molar and chrome high-speed drill",
    leadCopy: "Dedicação que transforma sorrisos. Cobalt blue professional dental health poster honoring clinicians and showcasing modern orthodontic care.",
    staggerOffset: "lg:-translate-y-2",
    designHighlights: [
      "Deep cobalt blue studio sweep background with soft radial highlight",
      "Central 3D dental chair with high-gloss porcelain tooth and chrome drill",
      "Understated clinical typography with Portuguese professional dedication copy"
    ]
  }
];

export default function FlyerDesignChapter() {
  const { reducedMotion } = useSiteExperience();

  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const heroOpeningRef = useRef<HTMLDivElement>(null);
  const paperMaskRef = useRef<HTMLDivElement>(null);
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
        paperMaskRef.current,
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
                FLYERS.length - 1,
                Math.floor(self.progress * FLYERS.length)
              );
              setActiveIdx(idx);
            },
          },
        });

        // -------------------------------------------------------------
        // BEAT 1: 0% -> 22%
        // Chapter Opening: Paper-inspired mask reveal with subtle vertical drift
        // -------------------------------------------------------------
        if (paperMaskRef.current) {
          tl.fromTo(
            paperMaskRef.current,
            { clipPath: "inset(12% 16% 12% 16% round 16px)", opacity: 0.8 },
            { clipPath: "inset(0% 0% 0% 0% round 0px)", opacity: 1, ease: "power2.out", duration: 0.18 },
            0
          );
        }

        if (heroImageRef.current) {
          tl.fromTo(
            heroImageRef.current,
            { scale: 0.98, y: 35 },
            { scale: 1.05, y: 0, ease: "power2.out", duration: 0.22 },
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

      // MOBILE: Natural horizontal swipeable track, gentle scroll entrance
      mm.add("(max-width: 1023px)", () => {
        if (heroOpeningRef.current) {
          gsap.fromTo(
            heroOpeningRef.current,
            { opacity: 0.6, y: 25 },
            {
              opacity: 1,
              y: 0,
              ease: "power2.out",
              scrollTrigger: {
                trigger: heroOpeningRef.current,
                start: "top 85%",
                end: "top 55%",
                scrub: 0.5,
              },
            }
          );
        }

        if (trackRef.current) {
          gsap.fromTo(
            trackRef.current,
            { opacity: 0.8, y: 20 },
            {
              opacity: 1,
              y: 0,
              ease: "power2.out",
              scrollTrigger: {
                trigger: trackRef.current,
                start: "top 85%",
                end: "top 60%",
                scrub: 0.5,
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
      id="chapter-flyers"
      className="relative w-full bg-[#141212] text-[#F3F3E7] select-none scroll-mt-[var(--nav-height,64px)] border-t border-white/10"
      aria-label="Chapter 06: Flyer & Print Design"
    >
      {/* =========================================================================
          STAGE (Sticky on desktop during scrub, natural flow on mobile)
          ========================================================================= */}
      <div
        ref={stageRef}
        className="w-full min-h-screen lg:h-screen lg:sticky lg:top-0 overflow-hidden flex flex-col justify-between pt-[calc(var(--nav-height,64px)+0.75rem)] pb-4 px-4 sm:px-6 lg:px-8 max-w-full"
      >
        {/* TOP HEADER & CONTROLS */}
        <header className="relative z-30 flex items-center justify-between gap-4 pb-3 border-b border-white/15 font-mono text-[11px] sm:text-xs tracking-wider uppercase max-w-7xl mx-auto w-full shrink-0">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#E5A830]/40 bg-[#E5A830]/10 font-semibold text-[#E5A830]">
              <span className="w-2 h-2 rounded-full bg-[#E5A830] animate-pulse" />
              06 / SELECTED WORK
            </span>
            <span className="hidden sm:inline-block text-white/80">
              Flyer Design · Tactile Editorial &amp; Print
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Gallery Progress Counter */}
            <div className="flex items-center gap-2 text-white/60 font-mono text-xs">
              <span className="text-[#E5A830] font-semibold">0{activeIdx + 1}</span>
              <span className="opacity-40">/</span>
              <span>0{FLYERS.length}</span>
            </div>

            {/* Accessible Previous / Next buttons */}
            <div className="flex items-center gap-1.5" role="group" aria-label="Gallery controls">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous flyer"
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 border border-white/15 flex items-center justify-center text-white/80 hover:text-white transition-all active:scale-95"
              >
                <ArrowLeft size={14} />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next flyer"
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 border border-white/15 flex items-center justify-center text-white/80 hover:text-white transition-all active:scale-95"
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
              Flyer Design
            </h2>
            <p className="font-sans text-xs sm:text-sm lg:text-base text-white/75 mt-2 leading-relaxed">
              Start with the suspended print exhibition. As you scroll, explore five tactile editorial poster systems with staggered vertical rhythms and generous breathing room.
            </p>
          </div>

          {/* Cumulative Chapter Artwork with Paper-Inspired Mask Reveal */}
          <div
            ref={paperMaskRef}
            className="relative w-full max-w-4xl aspect-[16/10] sm:aspect-[16/9] max-h-[380px] sm:max-h-[420px] rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-[#0E0D12] group"
            style={{ clipPath: "inset(0% 0% 0% 0%)" }}
          >
            <div ref={heroImageRef} className="relative w-full h-full">
              <Image
                src="/projects/exhibition/flyer-exhibition-hero.png"
                alt="Saffron and cobalt flyer exhibition — Flyer Design Chapter Opening"
                fill
                sizes="(max-width: 1024px) 100vw, 1100px"
                className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.01]"
                priority
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-white/90">
              <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[#E5A830]">
                Suspended Print Exhibition
              </span>
              <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
                Scroll to Enter Horizontal Gallery →
              </span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            LAYER 2: HORIZONTAL SCROLLING EDITORIAL GRID
            Sequence of portrait prints with staggered vertical placement & breathing room
            ========================================================================= */}
        <div
          ref={galleryWrapRef}
          className="relative z-10 my-auto w-full overflow-hidden py-2"
        >
          <div
            ref={trackRef}
            className="flex flex-row items-center gap-6 sm:gap-10 lg:gap-14 overflow-x-auto lg:overflow-x-visible snap-x snap-mandatory scrollbar-none touch-pan-x px-4 sm:px-8 lg:px-12 will-change-transform"
          >
            {FLYERS.map((f, index) => (
              <article
                key={f.id}
                id={`flyer-${f.id}`}
                className={`shrink-0 snap-center w-[85vw] sm:w-[75vw] lg:w-[54vw] max-w-[780px] rounded-3xl bg-[#1A1616] border border-white/15 p-5 sm:p-7 lg:p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between transition-transform duration-300 ${f.staggerOffset}`}
                aria-label={`${f.client}: ${f.title}`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
                  {/* PROMINENT LARGE PORTRAIT PRINT (Substantial artwork scale) */}
                  <div className="lg:col-span-6 xl:col-span-7 relative w-full aspect-[3/4] max-h-[400px] sm:max-h-[460px] rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-[#090808] group mx-auto">
                    <Image
                      src={f.image}
                      alt={`${f.title} — ${f.headline}`}
                      fill
                      sizes="(max-width: 1024px) 85vw, 500px"
                      className="object-contain object-center transition-transform duration-700 group-hover:scale-[1.01]"
                      priority={index === 0}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono text-white/90">
                      <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[#E5A830]">
                        {f.category}
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
                        {f.dimensions}
                      </span>
                    </div>
                  </div>

                  {/* PROJECT INFORMATION & CAPTIONS */}
                  <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#E5A830]" />
                        <span className="font-mono text-xs uppercase tracking-widest text-[#E5A830]">
                          06{String.fromCharCode(65 + index)} · {f.client}
                        </span>
                      </div>

                      <h3 className="font-cubao text-2xl sm:text-3xl text-white uppercase tracking-tight leading-tight">
                        {f.title}
                      </h3>

                      <p className="font-mono text-xs mt-1 uppercase text-[#E5A830]">
                        {f.headline}
                      </p>

                      <p className="font-sans text-xs sm:text-sm text-white/80 mt-2.5 leading-relaxed">
                        {f.leadCopy}
                      </p>
                    </div>

                    {/* PRINT PRODUCTION SPECS */}
                    <div className="space-y-1.5 pt-3 border-t border-white/10 font-mono text-xs">
                      <div className="flex justify-between items-center py-1 border-b border-white/5">
                        <span className="text-white/50 text-[11px]">Paper Stock</span>
                        <span className="text-white font-medium text-[11px]">{f.stock}</span>
                      </div>
                      <div className="flex flex-col py-0.5">
                        <span className="text-white/50 text-[10px] uppercase tracking-wider mb-0.5">
                          Focus Detail
                        </span>
                        <span className="text-[#E5A830] text-[11px] font-sans leading-snug">
                          {f.focusArea}
                        </span>
                      </div>
                    </div>

                    {/* HIGHLIGHT CHIPS */}
                    <div className="space-y-1 pt-2 border-t border-white/10 font-mono text-[11px]">
                      {f.designHighlights.slice(0, 2).map((hl, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-white/80">
                          <span className="text-[#E5A830] shrink-0 mt-0.5 text-[10px]">
                            0{idx + 1}
                          </span>
                          <span className="font-sans leading-tight text-white/70">{hl}</span>
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
            <span className="w-2 h-2 rounded-full bg-[#E5A830]" />
            <span className="text-[11px] uppercase tracking-wider">
              Horizontal Flyer Gallery · Staggered Print Layout
            </span>
          </div>

          {/* Visual Track Progress Bar */}
          <div className="w-full sm:w-64 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#E5A830] to-[#FF8C00] rounded-full transition-all duration-150"
              style={{
                width: `${Math.max(15, scrollProgress)}%`,
              }}
            />
          </div>

          <a
            href="#chapter-ai"
            className="inline-flex items-center gap-1.5 text-[#E5A830] hover:text-white transition-colors text-[11px]"
          >
            <span>Next: 07 / AI Creatives</span>
            <ArrowDown size={12} className="animate-bounce" />
          </a>
        </footer>
      </div>
    </section>
  );
}
