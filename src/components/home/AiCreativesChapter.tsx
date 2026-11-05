"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSiteExperience } from "@/components/studio/SiteExperience";
import { ArrowLeft, ArrowRight, ArrowUpRight, Mountain, Cpu, Sparkles, Layers } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface AiSeriesItem {
  id: string;
  series: string;
  seriesNum: "01" | "02";
  num: string;
  title: string;
  subtitle: string;
  image: string;
  dimensions: string;
  role: string;
  aiPromptContext: string;
  designIntegration: string;
  tags: string[];
}

const ALL_WORLDS: AiSeriesItem[] = [
  // -------------------------------------------------------------
  // SERIES 01: ALPINE EXPEDITIONS (Spiti Himalayan Tourism)
  // -------------------------------------------------------------
  {
    id: "spiti-campfire",
    series: "Series 01: Alpine Expeditions",
    seriesNum: "01",
    num: "01",
    title: "Spiti Valley — Campfire Stargazing",
    subtitle: "3 Days / 5 Nights / Zero Regrets · Camping Campaign",
    image: "/projects/ai-creatives/spiti-valley-campfire.jpg",
    dimensions: "1097 × 1350 px",
    role: "AI Art Director & Visual Designer",
    aiPromptContext: "High-altitude Himalayan night scene with friends gathered around a warm glowing campfire, backlit illuminated nylon tents, and star-studded snow-dusted jagged peaks.",
    designIntegration: "Integrated custom Spiti Travel Group branding, editorial serif title lockup, lime-yellow pricing badges ('Trips from 5,999/-'), and custom vector inclusion icons.",
    tags: ["Midjourney v6", "Editorial Typography", "Tourism Branding"]
  },
  {
    id: "himalaya-honeymoon",
    series: "Series 01: Alpine Expeditions",
    seriesNum: "01",
    num: "02",
    title: "Himalaya — Honeymoon Retreat",
    subtitle: "6 Days / 4 Nights Romantic Sunset Balcony Package",
    image: "/projects/ai-creatives/himalaya-honeymoon-sunset.jpg",
    dimensions: "1097 × 1350 px",
    role: "AI Concept Artist & Typographer",
    aiPromptContext: "Warm alpine sunset golden hour on a luxury wooden lodge balcony overlooking towering snow-covered peaks, with intimate candlelit dinner and wine glasses.",
    designIntegration: "Refined high-fashion serif logotype 'Himalaya', warm amber pricing pill ('Starting From Rs.34,000/-'), and structured package inclusion typography.",
    tags: ["Photorealistic AI", "Atmospheric Lighting", "Luxury Travel"]
  },
  {
    id: "langza-village",
    series: "Series 01: Alpine Expeditions",
    seriesNum: "01",
    num: "03",
    title: "Langza — India's First Fossil Village",
    subtitle: "One Day Free Cultural Excursion Campaign",
    image: "/projects/ai-creatives/langza-fossil-village.jpg",
    dimensions: "1097 × 1350 px",
    role: "AI Art Director & Campaign Designer",
    aiPromptContext: "Traditional high-altitude Spiti village with stone Tibetan houses, vibrant Buddhist prayer flags flapping in alpine breeze, whitewashed stupas, and terraced green barley fields.",
    designIntegration: "Flowing calligraphic display typography 'Langza' paired with stark modern geometry, neon promotional badge callouts, and localized travel itinerary hierarchy.",
    tags: ["Cultural Heritage", "Generative Landscape", "Travel Campaign"]
  },

  // -------------------------------------------------------------
  // SERIES 02: SPECULATIVE UI & HARDWARE (Entertainment & Concept Labs)
  // -------------------------------------------------------------
  {
    id: "ninja-shadows",
    series: "Series 02: Speculative UI & Hardware",
    seriesNum: "02",
    num: "04",
    title: "Ninja — Master the Shadows",
    subtitle: "Dark Cinematic Gaming Landing Page Experience",
    image: "/projects/ai-creatives/ninja-shadow-game.jpg",
    dimensions: "6912 × 4468 px (Ultra-HD Master)",
    role: "Concept UI & AI Visualizer",
    aiPromptContext: "Ominous brooding shinobi in hand-crafted lacquered armor sitting in dark meditative shadow with dramatic rim lighting on carbon-steel gauntlets.",
    designIntegration: "Immersive dark gaming website UI featuring navigation (Home, Support, Point Table), frosted glass modal buttons, and floating HUD controls.",
    tags: ["Gaming UI", "Dark Mode Web", "Glassmorphism"]
  },
  {
    id: "vr-imagination",
    series: "Series 02: Speculative UI & Hardware",
    seriesNum: "02",
    num: "05",
    title: "VR — Experience Your Imagination",
    subtitle: "Cyberpunk Virtual Reality Product Hero",
    image: "/projects/ai-creatives/vr-imagination.jpg",
    dimensions: "1599 × 1039 px",
    role: "Creative Director & UI Designer",
    aiPromptContext: "Excited young boy wearing high-tech futuristic holographic VR headset in neon cyberpunk city streetscape with dynamic particle depth.",
    designIntegration: "Frosted acrylic hero glass card with modern headline typography and glowing gradient CTA ('Learn MORE').",
    tags: ["Spatial Computing", "Cyberpunk", "Hardware Hero"]
  },
  {
    id: "zoro-chainsaw",
    series: "Series 02: Speculative UI & Hardware",
    seriesNum: "02",
    num: "06",
    title: "Zoro.to — Chainsaw Man Platform",
    subtitle: "High-Octane Anime Streaming Experience",
    image: "/projects/ai-creatives/zoro-chainsaw-man.jpg",
    dimensions: "3375 × 2301 px",
    role: "Entertainment UI Designer",
    aiPromptContext: "Dynamic anime combat hero atop crumbling concrete skyscrapers with dramatic cinematic perspective and urban battle dust.",
    designIntegration: "High-traffic streaming portal UI with carousel pagination, star rating system, neon lime action buttons, and dark navigation bar.",
    tags: ["Streaming UX", "Anime Platform", "Dynamic Action"]
  },
  {
    id: "anime-valley",
    series: "Series 02: Speculative UI & Hardware",
    seriesNum: "02",
    num: "07",
    title: "Anime Streaming — Golden Hour Valley",
    subtitle: "Atmospheric Ghibli-Inspired Streaming Hub",
    image: "/projects/ai-creatives/anime-streaming-landscape.jpg",
    dimensions: "1728 × 1125 px",
    role: "Digital Concept Artist",
    aiPromptContext: "Painterly animated landscape with lonely traveler on golden hillside overlooking a vast twilight valley under a glowing full moon.",
    designIntegration: "Platform subscription hero with pricing badge ('₹ 399/m'), trending carousel cards, and multi-device download markers.",
    tags: ["Painterly AI", "Streaming Hub", "Cross-Platform"]
  },
  {
    id: "jordan-retro",
    series: "Series 02: Speculative UI & Hardware",
    seriesNum: "02",
    num: "08",
    title: "Air Jordan 6 Retro SP — $225",
    subtitle: "High-Energy Athletic Footwear Concept",
    image: "/projects/ai-creatives/jordan-retro-sneaker.jpg",
    dimensions: "1440 × 1024 px",
    role: "E-Commerce Concept Designer",
    aiPromptContext: "Futuristic multi-layered Nike sneaker floating dynamically across sharp diagonal color blocking with warm ambient glow.",
    designIntegration: "Bold ecommerce landing page with split orange/black diagonal framing, oversized typographic backdrop, and minimal cart buttons.",
    tags: ["Sneaker Design", "E-Commerce UI", "Color Blocking"]
  },
  {
    id: "juice-splash",
    series: "Series 02: Speculative UI & Hardware",
    seriesNum: "02",
    num: "09",
    title: "JUICE — Save Your Energy",
    subtitle: "Fresh Beverage Bottle Digital Landing",
    image: "/projects/ai-creatives/juice-splash-concept.jpg",
    dimensions: "1728 × 1117 px",
    role: "Product Concept Visualizer",
    aiPromptContext: "Glass juice bottles surrounded by explosive liquid fruit splashes, sliced kiwi, and fresh botanical citrus leaves.",
    designIntegration: "Clean pastel blue beverage portal with circular masking, minimal icon rails, and clean product discovery navigation.",
    tags: ["Beverage Concept", "Liquid Splash", "Pastel Aesthetic"]
  }
];

export default function AiCreativesChapter() {
  const { reducedMotion } = useSiteExperience();

  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const heroOpeningRef = useRef<HTMLDivElement>(null);
  const depthApertureRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);
  const titleGroupRef = useRef<HTMLDivElement>(null);
  const titleWordRef = useRef<HTMLHeadingElement>(null);

  const galleryWrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Gallery interactive progress
  const [activeIdx, setActiveIdx] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  const activeItem = ALL_WORLDS[activeIdx] || ALL_WORLDS[0];

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
        depthApertureRef.current,
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
          return Math.max(0, track.scrollWidth - window.innerWidth + 180);
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
                ALL_WORLDS.length - 1,
                Math.floor(self.progress * ALL_WORLDS.length)
              );
              setActiveIdx(idx);
            },
          },
        });

        // -------------------------------------------------------------
        // BEAT 1: 0% -> 22%
        // Chapter Opening: Circular depth aperture reveal & camera push with readable pause
        // -------------------------------------------------------------
        if (depthApertureRef.current) {
          tl.fromTo(
            depthApertureRef.current,
            { clipPath: "circle(22% at 50% 50%)", opacity: 0.8 },
            { clipPath: "circle(85% at 50% 50%)", opacity: 1, ease: "power2.out", duration: 0.18 },
            0
          );
        }

        if (heroImageRef.current) {
          tl.fromTo(
            heroImageRef.current,
            { scale: 0.98, y: 15 },
            { scale: 1.08, y: 0, ease: "power2.out", duration: 0.22 },
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

      // MOBILE: Natural horizontal swipeable track, depth aperture mask reveal & gentle scroll entrance
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

        if (depthApertureRef.current) {
          mobileHeroTl.fromTo(
            depthApertureRef.current,
            { clipPath: "circle(32% at 50% 50%)", opacity: 0.7 },
            { clipPath: "circle(78% at 50% 50%)", opacity: 1, ease: "power2.out", duration: 0.5 },
            0.05
          );
        }

        if (heroImageRef.current) {
          mobileHeroTl.fromTo(
            heroImageRef.current,
            { scale: 1.08, y: 15 },
            { scale: 1.0, y: 0, ease: "power2.out", duration: 0.5 },
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
      id="chapter-ai"
      className="relative w-full bg-[#070A0F] text-[#F3F3E7] select-none scroll-mt-[var(--nav-height,64px)] border-t border-white/10"
      aria-label="Chapter 07: AI Creatives & Concept Labs"
    >
      {/* =========================================================================
          STAGE (Sticky on desktop during scrub, natural flow on mobile)
          ========================================================================= */}
      <div
        ref={stageRef}
        className="w-full min-h-screen lg:h-screen lg:sticky lg:top-0 lg:overflow-hidden overflow-visible flex flex-col justify-between pt-[calc(var(--nav-height,64px)+0.75rem)] pb-4 px-4 sm:px-6 lg:px-8 max-w-full"
      >
        {/* TOP HEADER & CONTROLS */}
        <header className="relative z-30 flex items-center justify-between gap-4 pb-3 border-b border-white/15 font-mono text-[11px] sm:text-xs tracking-wider uppercase max-w-7xl mx-auto w-full shrink-0">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00E5FF]/40 bg-[#00E5FF]/10 font-semibold text-[#00E5FF]">
              <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />
              07 / SELECTED WORK
            </span>
            <span className="hidden sm:inline-block text-white/80">
              AI Creatives · Art Direction &amp; Concept Labs
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Active Series Tag */}
            <span className="hidden md:inline-block px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-[#00E5FF]">
              {activeItem.series}
            </span>

            {/* Gallery Progress Counter */}
            <div className="flex items-center gap-2 text-white/60 font-mono text-xs">
              <span className="text-[#00E5FF] font-semibold">0{activeIdx + 1}</span>
              <span className="opacity-40">/</span>
              <span>0{ALL_WORLDS.length}</span>
            </div>

            {/* Accessible Previous / Next buttons */}
            <div className="flex items-center gap-1.5" role="group" aria-label="Gallery controls">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous world"
                className="w-10 h-10 sm:w-8 sm:h-8 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 rounded-full bg-white/5 hover:bg-white/15 border border-white/15 flex items-center justify-center text-white/80 hover:text-white transition-all active:scale-95 cursor-pointer"
              >
                <ArrowLeft size={14} />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next world"
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
              AI Creatives
            </h2>
            <p className="font-sans text-xs sm:text-sm lg:text-base text-white/75 mt-2 leading-relaxed">
              Start with the cinematic collection of nine creative worlds. As you scroll, explore the Himalayan expedition campaigns and speculative digital interfaces in a continuous horizontal journey.
            </p>
          </div>

          {/* Cumulative Chapter Artwork with Depth Aperture Reveal */}
          <div
            ref={depthApertureRef}
            className="relative w-full max-w-4xl aspect-[16/10] sm:aspect-[16/9] max-h-[380px] sm:max-h-[420px] rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-[#04060A] group"
            style={{ clipPath: "circle(85% at 50% 50%)" }}
          >
            <div ref={heroImageRef} className="relative w-full h-full">
              <Image
                src="/projects/exhibition/ai-creatives-hero.png"
                alt="Cinematic multiverse of nine creative worlds — AI Creatives Chapter Opening"
                fill
                sizes="(max-width: 1024px) 100vw, 1100px"
                className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.01]"
                priority
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-white/90">
              <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[#00E5FF]">
                Cinematic Multiverse of 9 Creative Worlds
              </span>
              <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
                Scroll to Enter Horizontal Gallery →
              </span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            LAYER 2: HORIZONTAL SCROLLING EDITORIAL GRID
            Larger landscape compositions with clearly grouped travel & concept series
            ========================================================================= */}
        <div
          ref={galleryWrapRef}
          className="relative z-10 my-auto w-full overflow-hidden py-2"
        >
          <div
            ref={trackRef}
            className="flex flex-row items-center gap-6 sm:gap-10 lg:gap-12 overflow-x-auto lg:overflow-x-visible snap-x snap-mandatory scrollbar-none touch-pan-x touch-pan-y px-4 sm:px-8 lg:px-12 will-change-transform"
          >
            {/* SERIES 01 ANCHOR PILLAR */}
            <div className="shrink-0 snap-start w-[50vw] sm:w-[35vw] lg:w-[22vw] max-w-[320px] rounded-2xl sm:rounded-3xl bg-[#0F1626]/80 border border-[#00E5FF]/30 p-4 sm:p-6 flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center gap-2 mb-2 font-mono text-xs text-[#00E5FF]">
                  <Mountain size={16} />
                  <span className="uppercase tracking-widest font-semibold">Series 01</span>
                </div>
                <h3 className="font-cubao text-2xl lg:text-3xl text-white uppercase tracking-tight leading-tight">
                  Alpine Tourism
                </h3>
                <p className="font-sans text-xs text-white/75 mt-2 leading-relaxed">
                  Spiti Himalayan tourism campaigns pairing photorealistic atmospheric landscapes with editorial typography and localized package systems.
                </p>
              </div>
              <div className="pt-4 border-t border-white/10 font-mono text-[11px] text-[#00E5FF]/80">
                <span>03 Expedition Studies</span>
              </div>
            </div>

            {/* ALL 9 WORLDS IN HORIZONTAL SEQUENCE */}
            {ALL_WORLDS.map((w, index) => {
              const isFirstOfSeries2 = index === 3;
              return (
                <React.Fragment key={w.id}>
                  {/* SERIES 02 DIVIDER PILLAR INSERTED BEFORE WORLD 04 */}
                  {isFirstOfSeries2 && (
                    <div className="shrink-0 snap-start w-[50vw] sm:w-[35vw] lg:w-[22vw] max-w-[320px] rounded-2xl sm:rounded-3xl bg-[#140F26]/80 border border-[#9B87F5]/30 p-4 sm:p-6 flex flex-col justify-between shadow-xl">
                      <div>
                        <div className="flex items-center gap-2 mb-2 font-mono text-xs text-[#9B87F5]">
                          <Cpu size={16} />
                          <span className="uppercase tracking-widest font-semibold">Series 02</span>
                        </div>
                        <h3 className="font-cubao text-2xl lg:text-3xl text-white uppercase tracking-tight leading-tight">
                          Concept Labs
                        </h3>
                        <p className="font-sans text-xs text-white/75 mt-2 leading-relaxed">
                          Speculative dark-mode gaming UI, holographic spatial VR headsets, anime streaming portals, and dynamic athletic landing pages.
                        </p>
                      </div>
                      <div className="pt-4 border-t border-white/10 font-mono text-[11px] text-[#9B87F5]/80">
                        <span>06 Interface Studies</span>
                      </div>
                    </div>
                  )}

                  <article
                    id={`world-${w.id}`}
                    className="shrink-0 snap-center w-[85vw] sm:w-[75vw] lg:w-[60vw] max-w-[820px] h-auto lg:max-h-[min(540px,calc(100vh-var(--nav-height,64px)-120px))] rounded-2xl sm:rounded-3xl bg-[#0B0F17] border border-white/15 p-4 sm:p-7 lg:p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between"
                    aria-label={`${w.title} — ${w.subtitle}`}
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
                      {/* PROMINENT LANDSCAPE ARTWORK (Substantial scale, no card shrinking) */}
                      <div className="lg:col-span-7 relative w-full aspect-[16/10] sm:aspect-[4/3] max-h-[380px] sm:max-h-[440px] rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-[#03060B] group mx-auto">
                        <Image
                          src={w.image}
                          alt={`${w.title} — ${w.subtitle}`}
                          fill
                          sizes="(max-width: 1024px) 85vw, 550px"
                          className="object-contain object-center transition-transform duration-700 group-hover:scale-[1.01]"
                          priority={index === 0}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono text-white/90">
                          <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[#00E5FF]">
                            {w.role}
                          </span>
                          <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
                            {w.dimensions}
                          </span>
                        </div>
                      </div>

                      {/* PROJECT INFORMATION & CAPTIONS */}
                      <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#00E5FF]" />
                            <span className="font-mono text-xs uppercase tracking-widest text-[#00E5FF]">
                              07{String.fromCharCode(65 + index)} · {w.seriesNum === "01" ? "Spiti" : "Labs"}
                            </span>
                          </div>

                          <h3 className="font-cubao text-2xl sm:text-3xl text-white uppercase tracking-tight leading-tight">
                            {w.title}
                          </h3>

                          <p className="font-mono text-xs mt-1 text-[#00E5FF]/90">
                            {w.subtitle}
                          </p>
                        </div>

                        {/* GENERATIVE PROMPT & DESIGN INTEGRATION */}
                        <div className="space-y-2 font-sans text-xs text-white/80">
                          <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                            <span className="block font-mono text-[9px] text-white/50 uppercase tracking-wider mb-0.5">
                              Prompt Context
                            </span>
                            <p className="italic text-white/70 line-clamp-2">
                              &ldquo;{w.aiPromptContext}&rdquo;
                            </p>
                          </div>

                          <div>
                            <span className="block font-mono text-[9px] text-white/50 uppercase tracking-wider mb-0.5">
                              Design Integration
                            </span>
                            <p className="text-white/85 leading-snug">
                              {w.designIntegration}
                            </p>
                          </div>
                        </div>

                        {/* TAG CHIPS */}
                        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/10 font-mono text-[10px]">
                          {w.tags.map((t) => (
                            <span key={t} className="px-2 py-0.5 rounded-md bg-white/5 text-white/60">
                              #{t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </article>
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* BOTTOM METADATA, PROGRESS BAR & CONCLUDING TRANSITION */}
        <footer className="relative z-30 flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/10 font-mono text-xs text-white/60 max-w-7xl mx-auto w-full shrink-0">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#00E5FF]" />
            <span className="text-[11px] uppercase tracking-wider">
              Horizontal Multiverse Gallery · 9 Creative Worlds
            </span>
          </div>

          {/* Visual Track Progress Bar */}
          <div className="w-full sm:w-64 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#00E5FF] to-[#9B87F5] rounded-full transition-all duration-150"
              style={{
                width: `${Math.max(15, scrollProgress)}%`,
              }}
            />
          </div>

          <a
            href="#contact"
            className="inline-flex items-center gap-1.5 text-[#00E5FF] hover:text-white transition-colors text-[11px]"
          >
            <span>Exhibition Complete · Contact Studio</span>
            <ArrowUpRight size={13} />
          </a>
        </footer>
      </div>
    </section>
  );
}
