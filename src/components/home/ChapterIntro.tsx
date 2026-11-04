"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSiteExperience } from "@/components/studio/SiteExperience";
import {
  ArrowDownRight,
  ArrowDown,
  Sparkles,
  Layers,
  Box,
  Smartphone,
  CheckCircle2,
  Compass,
} from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export type ChapterType = "logo" | "uiux" | "packaging" | "experience";

export interface ChapterIntroProps {
  id: string;
  chapterNumber: string;
  category: string;
  title: string;
  subtitle: string;
  type: ChapterType;
  targetId: string;
  projectHighlight?: string;
  disciplinePills?: string[];
  ctaLabel?: string;
}

export function ChapterIntro({
  id,
  chapterNumber,
  category,
  title,
  subtitle,
  type,
  targetId,
  projectHighlight,
  disciplinePills = [],
  ctaLabel,
}: ChapterIntroProps) {
  const { reducedMotion } = useSiteExperience();

  const containerRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const titleGroupRef = useRef<HTMLDivElement>(null);
  const motifsRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion || !containerRef.current || !screenRef.current) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // DESKTOP: Smooth bounded pin (~1 viewport scroll) with scrubbed transition into showcase
      mm.add("(min-width: 1024px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "+=95%", // Bounded ~1 viewport of scroll
            pin: screenRef.current,
            scrub: 0.7,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // Phase 1 (0 -> 0.25): Assembly into sharp focus
        if (titleGroupRef.current) {
          tl.fromTo(
            titleGroupRef.current,
            { scale: 0.94, y: 30, opacity: 0.8 },
            { scale: 1, y: 0, opacity: 1, ease: "none", duration: 0.25 },
            0
          );
        }
        if (motifsRef.current) {
          tl.fromTo(
            motifsRef.current,
            { scale: 0.95, opacity: 0.4 },
            { scale: 1, opacity: 1, ease: "none", duration: 0.25 },
            0
          );
        }
        if (gridRef.current) {
          tl.fromTo(
            gridRef.current,
            { opacity: 0.25 },
            { opacity: 0.75, ease: "none", duration: 0.25 },
            0
          );
        }

        // Phase 2 (0.25 -> 0.65): Locked reading hold
        tl.to({}, { duration: 0.4 });

        // Phase 3 (0.65 -> 1.0): Seamless handoff transition into the project showcase
        if (titleGroupRef.current) {
          tl.to(
            titleGroupRef.current,
            { y: -70, opacity: 0, scale: 1.05, ease: "power2.in", duration: 0.35 },
            0.65
          );
        }
        if (metaRef.current) {
          tl.to(
            metaRef.current,
            { y: -30, opacity: 0, ease: "power2.in", duration: 0.25 },
            0.65
          );
        }
        if (motifsRef.current) {
          tl.to(
            motifsRef.current,
            { y: -80, opacity: 0, scale: 1.08, ease: "power2.in", duration: 0.35 },
            0.65
          );
        }
        if (gridRef.current) {
          tl.to(
            gridRef.current,
            { opacity: 0, ease: "power2.in", duration: 0.25 },
            0.75
          );
        }
        if (bottomBarRef.current) {
          tl.to(
            bottomBarRef.current,
            { y: 30, opacity: 0, ease: "power2.in", duration: 0.25 },
            0.65
          );
        }
        if (curtainRef.current) {
          tl.to(
            curtainRef.current,
            { opacity: 1, ease: "power2.inOut", duration: 0.35 },
            0.65
          );
        }
      });

      // TABLET & MOBILE: Natural vertical scroll entrance without sticky pin
      mm.add("(max-width: 1023px)", () => {
        if (screenRef.current) {
          gsap.fromTo(
            screenRef.current,
            { opacity: 0.88, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
              scrollTrigger: {
                trigger: containerRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  // Color schemes and handoff curtain classes tailored to each discipline
  const typeConfig = {
    logo: {
      bg: "bg-[#180D14]",
      radial:
        "radial-gradient(circle at 75% 25%, rgba(137, 1, 73, 0.35) 0%, rgba(24, 13, 20, 0.95) 70%)",
      curtainBg:
        "bg-gradient-to-b from-transparent via-[#1B1118]/85 to-[#1B1118]",
      accentText: "text-[#E6ADC7]",
      accentBorder: "border-[#890149]/40",
      accentBg: "bg-[#890149]/20",
      symbol: "✳",
      disciplineCode: "DISCIPLINE: BRAND IDENTITY & VECTOR CRAFT",
      specs: [
        "KERNING: OPTICAL",
        "BEZIER PRECISION: 0.001",
        "6 FICTIONAL IDENTITIES",
        "COLORWAY: #890149 // #F3F3E7",
      ],
      defaultPills: [
        "Bespoke Wordmarks",
        "Geometric Tension",
        "Vector Glyphs",
        "Fictional Worlds",
      ],
      defaultCta: "Enter Identity Room",
    },
    uiux: {
      bg: "bg-[#131224]",
      radial:
        "radial-gradient(circle at 75% 30%, rgba(81, 70, 166, 0.35) 0%, rgba(19, 18, 36, 0.95) 70%)",
      curtainBg:
        "bg-gradient-to-b from-transparent via-[#F3F0F8]/90 to-[#F3F0F8]",
      accentText: "text-[#9B87F5]",
      accentBorder: "border-[#9B87F5]/40",
      accentBg: "bg-[#9B87F5]/20",
      symbol: "↗",
      disciplineCode: "DISCIPLINE: UI/UX & PRODUCT SYSTEMS",
      specs: [
        "WCAG AAA CONTRAST: 8.4:1",
        "AUTO-LAYOUT: VERTICAL",
        "TOUCH TARGET: ≥ 48dp",
        "DEMENTIA-FRIENDLY HIERARCHY",
      ],
      defaultPills: [
        "Mobile App System",
        "Caregiver Workflow",
        "Low-Stress Interface",
        "Interactive Prototype",
      ],
      defaultCta: "Test Interactive Prototype",
    },
    packaging: {
      bg: "bg-[#112318]",
      radial:
        "radial-gradient(circle at 75% 30%, rgba(45, 90, 60, 0.35) 0%, rgba(17, 35, 24, 0.95) 70%)",
      curtainBg:
        "bg-gradient-to-b from-transparent via-[#FFFDF9]/90 to-[#FFFDF9]",
      accentText: "text-[#F6D06F]",
      accentBorder: "border-[#2D5A3C]/40",
      accentBg: "bg-[#2D5A3C]/20",
      symbol: "◒",
      disciplineCode: "DISCIPLINE: PACKAGING & TACTILE SYSTEMS",
      specs: [
        "STOCK: 350 GSM VIRGIN KRAFT",
        "FINISH: SOFT-TOUCH MATTE",
        "SPOT EMBOSS: +0.4mm",
        "100% RECYCLABLE // FSC CERTIFIED",
      ],
      defaultPills: [
        "Carton Dieline Geometry",
        "3D Interactive Shelf",
        "Sensory Unboxing",
        "Print Finishes & Foil",
      ],
      defaultCta: "Explore Packaging Shelf",
    },
    experience: {
      bg: "bg-[#180D14]",
      radial:
        "radial-gradient(circle at 75% 30%, rgba(137, 1, 73, 0.35) 0%, rgba(24, 13, 20, 0.95) 70%)",
      curtainBg:
        "bg-gradient-to-b from-transparent via-[#1B1118]/85 to-[#1B1118]",
      accentText: "text-[#E6ADC7]",
      accentBorder: "border-[#890149]/40",
      accentBg: "bg-[#890149]/20",
      symbol: "↝",
      disciplineCode: "DISCIPLINE: CREATIVE EXPERIENCES",
      specs: ["INTERACTIVE LAB", "CANVAS EXPERIMENTS", "SOUND & MOTION"],
      defaultPills: ["WebGL", "Playful Systems", "Motion"],
      defaultCta: "Explore Lab",
    },
  }[type] || {
    bg: "bg-[#180D14]",
    radial: "",
    curtainBg: "bg-transparent",
    accentText: "text-[#E6ADC7]",
    accentBorder: "border-[#890149]/40",
    accentBg: "bg-[#890149]/20",
    symbol: "✳",
    disciplineCode: "DISCIPLINE: DESIGN",
    specs: [],
    defaultPills: [],
    defaultCta: "Explore Showcase",
  };

  const pills = disciplinePills.length > 0 ? disciplinePills : typeConfig.defaultPills;
  const actionLabel = ctaLabel || typeConfig.defaultCta;

  return (
    <div
      ref={containerRef}
      id={id}
      className="chapter-intro-wrapper relative w-full overflow-hidden"
      role="region"
      aria-label={`Chapter ${chapterNumber}: ${title}`}
    >
      {/* FULL SCREEN EDITORIAL CHAPTER COVER */}
      <div
        ref={screenRef}
        className={`chapter-editorial-screen relative w-full min-h-[75vh] lg:min-h-screen lg:h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-14 text-[#F3F3E7] ${typeConfig.bg} select-none`}
        style={{ backgroundImage: typeConfig.radial }}
      >
        {/* 1. DISCIPLINE GRAPHIC MOTIFS BACKGROUND LAYER */}
        <div
          ref={gridRef}
          className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-70"
          aria-hidden="true"
        >
          {type === "logo" && <LogoMotifGrid />}
          {type === "uiux" && <UiUxMotifGrid />}
          {type === "packaging" && <PackagingMotifGrid />}
        </div>

        {/* 2. DYNAMIC FLOATING VECTOR ART LAYER */}
        <div
          ref={motifsRef}
          className="absolute inset-0 pointer-events-none overflow-hidden z-1"
          aria-hidden="true"
        >
          {type === "logo" && <LogoFloatingMotifs />}
          {type === "uiux" && <UiUxFloatingMotifs />}
          {type === "packaging" && <PackagingFloatingMotifs />}
        </div>

        {/* 3. TOP META BAR */}
        <header
          ref={metaRef}
          className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-white/15 font-mono text-[11px] sm:text-xs tracking-wider uppercase"
        >
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#890149] animate-pulse" />
              CHAPTER {chapterNumber}
            </span>
            <span className="hidden sm:inline-block text-[#F3F3E7]/70">
              {category}
            </span>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <span className="hidden md:inline-block text-white/50 text-[10px]">
              {typeConfig.disciplineCode}
            </span>
            <a
              href={`#${targetId}`}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 hover:border-white/60 bg-white/5 hover:bg-white/15 transition-all text-[#F3F3E7] group"
              title={`Skip directly to ${title} showcase`}
            >
              <span>Explore showcase</span>
              <ArrowDownRight
                size={14}
                className="group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform"
                aria-hidden="true"
              />
            </a>
          </div>
        </header>

        {/* 4. MAIN EDITORIAL POSTER COMPOSITION */}
        <main
          ref={titleGroupRef}
          className="relative z-10 my-auto py-8 sm:py-12 flex flex-col items-start justify-center max-w-6xl"
        >
          {/* Eyebrow & Project Highlight */}
          <div className="flex flex-wrap items-center gap-3 mb-4 sm:mb-6">
            <span
              className={`inline-block font-mono text-[10px] sm:text-xs uppercase tracking-widest px-2.5 py-1 rounded ${typeConfig.accentBg} ${typeConfig.accentText} border ${typeConfig.accentBorder} font-medium`}
            >
              {projectHighlight || `0${chapterNumber} // SPOTLIGHT SYSTEM`}
            </span>
            <span className="text-white/40 font-mono text-xs hidden sm:inline">
              |
            </span>
            <span className="text-white/70 font-mono text-xs uppercase tracking-wider hidden sm:inline">
              Curated Portfolio 2026
            </span>
          </div>

          {/* Giant Cubao Typography Headline */}
          <div className="relative mb-4 sm:mb-6 flex items-baseline gap-4 sm:gap-6 flex-wrap">
            <h2 className="font-cubao text-6xl sm:text-8xl md:text-9xl lg:text-[7.5rem] xl:text-[9.25rem] leading-[0.88] tracking-tight uppercase text-[#F3F3E7] drop-shadow-sm">
              {title}
            </h2>
            <span
              className="font-cubao text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-[#890149] opacity-90 select-none"
              aria-hidden="true"
            >
              {typeConfig.symbol}
            </span>
          </div>

          {/* Editorial Narrative Subtitle */}
          <p className="max-w-2xl text-base sm:text-lg lg:text-xl font-normal text-[#F3F3E7]/85 leading-relaxed mb-6 sm:mb-8 font-sans">
            {subtitle}
          </p>

          {/* Discipline Tags / Methodology Chips */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {pills.map((pill, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono tracking-wide text-white/80 bg-white/5 border border-white/10 backdrop-blur-sm"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                {pill}
              </span>
            ))}
          </div>
        </main>

        {/* 5. BOTTOM BAR / INTERACTIVE TRANSITION TICKER */}
        <footer
          ref={bottomBarRef}
          className="relative z-10 pt-5 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs text-white/70"
        >
          {/* Technical Specs Array */}
          <div className="hidden lg:flex items-center gap-6 text-[10px] tracking-wider text-white/60">
            {typeConfig.specs.map((spec, i) => (
              <span key={i} className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-[#890149]" />
                {spec}
              </span>
            ))}
          </div>

          {/* Bottom Action / Scroll Indicator */}
          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
            <a
              href={`#${targetId}`}
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#890149] hover:bg-[#A81D63] text-white font-medium text-xs sm:text-sm tracking-wide transition-all shadow-md group"
            >
              <span>{actionLabel}</span>
              <ArrowDown
                size={14}
                className="group-hover:translate-y-0.5 transition-transform"
                aria-hidden="true"
              />
            </a>

            <div className="flex items-center gap-2 text-[11px] text-white/50 tracking-wider">
              <span className="hidden sm:inline">SCROLL TO ENTER</span>
              <ArrowDown size={12} className="animate-bounce" aria-hidden="true" />
            </div>
          </div>
        </footer>

        {/* 6. SEAMLESS HANDOFF CURTAIN FOR SMOOTH SHOWCASE INTEGRATION */}
        <div
          ref={curtainRef}
          className={`absolute inset-0 pointer-events-none opacity-0 z-20 transition-opacity duration-300 ${typeConfig.curtainBg}`}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

// ============================================================================
// 1. MOTIF GRIDS & VECTOR SCHEMATICS
// ============================================================================

function LogoMotifGrid() {
  return (
    <svg
      className="w-full h-full object-cover"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id="logo-grid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path
            d="M 60 0 L 0 0 0 60"
            fill="none"
            stroke="rgba(243, 243, 231, 0.04)"
            strokeWidth="1"
          />
          <circle cx="60" cy="60" r="1" fill="rgba(230, 173, 199, 0.2)" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#logo-grid)" />

      {/* Typographic baseline and x-height rules */}
      <line
        x1="0"
        y1="220"
        x2="1440"
        y2="220"
        stroke="rgba(230, 173, 199, 0.15)"
        strokeWidth="1"
        strokeDasharray="4 4"
      />
      <text
        x="30"
        y="212"
        fill="rgba(230, 173, 199, 0.35)"
        fontSize="9"
        fontFamily="monospace"
        letterSpacing="2"
      >
        CAP HEIGHT // 720.00 PT
      </text>

      <line
        x1="0"
        y1="560"
        x2="1440"
        y2="560"
        stroke="rgba(230, 173, 199, 0.18)"
        strokeWidth="1"
      />
      <text
        x="30"
        y="552"
        fill="rgba(230, 173, 199, 0.35)"
        fontSize="9"
        fontFamily="monospace"
        letterSpacing="2"
      >
        BASELINE // 144.00 PT (OPTICAL KERNING)
      </text>

      <line
        x1="0"
        y1="640"
        x2="1440"
        y2="640"
        stroke="rgba(137, 1, 73, 0.25)"
        strokeWidth="1"
        strokeDasharray="6 3"
      />
      <text
        x="30"
        y="632"
        fill="rgba(137, 1, 73, 0.45)"
        fontSize="9"
        fontFamily="monospace"
        letterSpacing="2"
      >
        DESCENDER BOUNDS // -180.00 PT
      </text>

      {/* Vertical alignment guides */}
      <line
        x1="240"
        y1="0"
        x2="240"
        y2="900"
        stroke="rgba(243, 243, 231, 0.08)"
        strokeWidth="1"
      />
      <line
        x1="720"
        y1="0"
        x2="720"
        y2="900"
        stroke="rgba(137, 1, 73, 0.2)"
        strokeWidth="1"
        strokeDasharray="8 6"
      />
      <line
        x1="1200"
        y1="0"
        x2="1200"
        y2="900"
        stroke="rgba(243, 243, 231, 0.08)"
        strokeWidth="1"
      />

      {/* Center crosshair */}
      <path
        d="M 710 450 L 730 450 M 720 440 L 720 460"
        stroke="rgba(230, 173, 199, 0.4)"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function UiUxMotifGrid() {
  return (
    <svg
      className="w-full h-full object-cover"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id="uiux-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="20" r="1" fill="rgba(155, 135, 245, 0.12)" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#uiux-grid)" />

      {/* 8-Column Blueprint Layout Lines */}
      {[140, 280, 420, 560, 700, 840, 980, 1120, 1260].map((x, i) => (
        <g key={i}>
          <line
            x1={x}
            y1="0"
            x2={x}
            y2="900"
            stroke="rgba(155, 135, 245, 0.08)"
            strokeWidth="1"
          />
          <text
            x={x + 6}
            y="70"
            fill="rgba(155, 135, 245, 0.25)"
            fontSize="8"
            fontFamily="monospace"
          >
            COL_0{i + 1}
          </text>
        </g>
      ))}

      {/* Screen frame dimension callouts */}
      <rect
        x="980"
        y="140"
        width="380"
        height="640"
        rx="36"
        fill="rgba(155, 135, 245, 0.03)"
        stroke="rgba(155, 135, 245, 0.25)"
        strokeWidth="1.5"
      />
      <text
        x="1000"
        y="170"
        fill="rgba(155, 135, 245, 0.4)"
        fontSize="9"
        fontFamily="monospace"
      >
        FRAME // 390 × 844 (SAFE AREA 44PT)
      </text>

      {/* Auto-layout indicators */}
      <path
        d="M 960 220 L 975 220 M 960 380 L 975 380 M 967 220 L 967 380"
        stroke="rgba(155, 135, 245, 0.3)"
        strokeWidth="1"
      />
      <text
        x="870"
        y="305"
        fill="rgba(155, 135, 245, 0.35)"
        fontSize="8"
        fontFamily="monospace"
      >
        GAP: 16PX
      </text>
    </svg>
  );
}

function PackagingMotifGrid() {
  return (
    <svg
      className="w-full h-full object-cover"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Packaging Dieline System */}
      {/* Outer Bleed Lines */}
      <rect
        x="120"
        y="120"
        width="1200"
        height="660"
        fill="none"
        stroke="rgba(244, 238, 229, 0.08)"
        strokeWidth="1"
      />

      {/* Cut Lines (Solid) */}
      <rect
        x="140"
        y="140"
        width="1160"
        height="620"
        fill="none"
        stroke="rgba(244, 238, 229, 0.18)"
        strokeWidth="1.5"
      />
      <text
        x="155"
        y="160"
        fill="rgba(244, 238, 229, 0.4)"
        fontSize="9"
        fontFamily="monospace"
      >
        CUT LINE // TRIM EDGE
      </text>

      {/* Crease / Fold Lines (Dashed) */}
      <line
        x1="430"
        y1="140"
        x2="430"
        y2="760"
        stroke="rgba(137, 1, 73, 0.4)"
        strokeWidth="1.5"
        strokeDasharray="8 6"
      />
      <line
        x1="720"
        y1="140"
        x2="720"
        y2="760"
        stroke="rgba(137, 1, 73, 0.4)"
        strokeWidth="1.5"
        strokeDasharray="8 6"
      />
      <line
        x1="1010"
        y1="140"
        x2="1010"
        y2="760"
        stroke="rgba(137, 1, 73, 0.4)"
        strokeWidth="1.5"
        strokeDasharray="8 6"
      />

      <text
        x="440"
        y="190"
        fill="rgba(137, 1, 73, 0.6)"
        fontSize="8"
        fontFamily="monospace"
      >
        FOLD LINE (SCORE: 0.8MM)
      </text>

      {/* Corner Crop Marks */}
      <g stroke="rgba(244, 238, 229, 0.35)" strokeWidth="1.5">
        <path d="M 120 140 L 100 140 M 140 120 L 140 100" />
        <path d="M 1320 140 L 1340 140 M 1300 120 L 1300 100" />
        <path d="M 120 760 L 100 760 M 140 780 L 140 800" />
        <path d="M 1320 760 L 1340 760 M 1300 780 L 1300 800" />
      </g>

      {/* Printer Calibration Targets */}
      <g transform="translate(1360, 450)">
        <circle cx="0" cy="0" r="14" fill="none" stroke="rgba(244, 238, 229, 0.4)" strokeWidth="1" />
        <circle cx="0" cy="0" r="7" fill="none" stroke="rgba(244, 238, 229, 0.4)" strokeWidth="1" />
        <line x1="-18" y1="0" x2="18" y2="0" stroke="rgba(244, 238, 229, 0.4)" strokeWidth="1" />
        <line x1="0" y1="-18" x2="0" y2="18" stroke="rgba(244, 238, 229, 0.4)" strokeWidth="1" />
      </g>
    </svg>
  );
}

// ============================================================================
// 2. DYNAMIC FLOATING ART MOTIFS
// ============================================================================

function LogoFloatingMotifs() {
  return (
    <div className="w-full h-full relative">
      {/* Floating Typographic Glyph Fragments */}
      <div className="absolute right-[8%] top-[18%] opacity-20 pointer-events-none select-none hidden lg:block">
        <span className="font-serif italic text-[16rem] leading-none text-[#F3F3E7]">
          &
        </span>
      </div>

      <div className="absolute right-[22%] bottom-[20%] opacity-25 pointer-events-none select-none hidden md:block">
        <span className="font-cubao text-[10rem] text-[#890149]">✳</span>
      </div>

      {/* Bezier Spline Schematic Overlay */}
      <svg
        className="absolute right-[12%] top-[30%] w-[340px] h-[280px] pointer-events-none select-none hidden xl:block"
        viewBox="0 0 340 280"
        fill="none"
      >
        <path
          d="M 30 220 C 100 40, 220 260, 310 70"
          stroke="rgba(230, 173, 199, 0.4)"
          strokeWidth="2.5"
        />
        {/* Tangent control arms */}
        <line
          x1="30"
          y1="220"
          x2="100"
          y2="40"
          stroke="rgba(137, 1, 73, 0.6)"
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />
        <circle cx="100" cy="40" r="4.5" fill="#E6ADC7" />
        <line
          x1="310"
          y1="70"
          x2="220"
          y2="260"
          stroke="rgba(137, 1, 73, 0.6)"
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />
        <circle cx="220" cy="260" r="4.5" fill="#890149" />
        {/* Anchor nodes */}
        <circle cx="30" cy="220" r="5" fill="#F3F3E7" />
        <circle cx="310" cy="70" r="5" fill="#F3F3E7" />
        <text
          x="110"
          y="35"
          fill="rgba(230, 173, 199, 0.8)"
          fontSize="9"
          fontFamily="monospace"
        >
          C1(100, 40)
        </text>
        <text
          x="230"
          y="275"
          fill="rgba(230, 173, 199, 0.8)"
          fontSize="9"
          fontFamily="monospace"
        >
          C2(220, 260)
        </text>
      </svg>
    </div>
  );
}

function UiUxFloatingMotifs() {
  return (
    <div className="w-full h-full relative">
      {/* Stylized CareConnect UI Card Mockup */}
      <div className="absolute right-[6%] top-[24%] w-[330px] rounded-2xl border border-[#9B87F5]/30 bg-[#1A1833]/70 backdrop-blur-md p-5 shadow-2xl pointer-events-none select-none hidden lg:block">
        {/* Card Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 text-[10px] font-mono text-white/60">
          <span className="flex items-center gap-1.5 text-[#9B87F5]">
            <Smartphone size={12} />
            CARECONNECT OS
          </span>
          <span className="text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            SYNCHRONIZED
          </span>
        </div>

        {/* Task Card Skeleton */}
        <div className="mt-4 space-y-2.5">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-white/90">
                Blood Pressure & Vitals
              </p>
              <p className="text-[10px] font-mono text-white/50">
                08:00 AM • MORNING DOSE
              </p>
            </div>
            <span className="p-1 rounded-full bg-emerald-500/20 text-emerald-300">
              <CheckCircle2 size={16} />
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#9B87F5]/10 border border-[#9B87F5]/30 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-[#ECE9FB]">
                Afternoon Hydration
              </p>
              <p className="text-[10px] font-mono text-[#9B87F5]">
                12:30 PM • NEXT ACTION
              </p>
            </div>
            <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-[#9B87F5]/20 text-[#ECE9FB]">
              TAP TO LOG
            </span>
          </div>
        </div>

        {/* Metric Bar */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[9px] font-mono text-white/50">
          <span>PROGRESS // 3 OF 4</span>
          <span className="text-[#9B87F5]">75% COMPLETED</span>
        </div>
      </div>

      {/* Floating Pointer / Cursor Node */}
      <div className="absolute right-[28%] bottom-[28%] flex items-center gap-2 pointer-events-none select-none hidden xl:flex">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M 4 2 L 18 10 L 11 12 L 8 19 L 4 2 Z"
            fill="#9B87F5"
            stroke="#FFFFFF"
            strokeWidth="1.5"
          />
        </svg>
        <span className="px-2 py-1 rounded bg-[#9B87F5]/20 border border-[#9B87F5]/40 text-[#ECE9FB] font-mono text-[9px]">
          TAP_TARGET: 48×48DP
        </span>
      </div>
    </div>
  );
}

function PackagingFloatingMotifs() {
  return (
    <div className="w-full h-full relative">
      {/* 3D Pint Carton Profile Silhouette */}
      <svg
        className="absolute right-[8%] top-[22%] w-[320px] h-[360px] pointer-events-none select-none hidden lg:block"
        viewBox="0 0 320 360"
        fill="none"
      >
        {/* Pint tub wireframe silhouette */}
        <path
          d="M 70 80 L 250 80 L 225 310 L 95 310 Z"
          fill="rgba(244, 238, 229, 0.03)"
          stroke="rgba(244, 238, 229, 0.25)"
          strokeWidth="1.5"
        />
        {/* Lid rim */}
        <ellipse
          cx="160"
          cy="80"
          rx="90"
          ry="18"
          fill="rgba(137, 1, 73, 0.15)"
          stroke="rgba(230, 173, 199, 0.4)"
          strokeWidth="1.5"
        />
        {/* Base rim */}
        <ellipse
          cx="160"
          cy="310"
          rx="65"
          ry="12"
          fill="none"
          stroke="rgba(244, 238, 229, 0.2)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        {/* Label placement boundary */}
        <path
          d="M 80 140 L 240 140 L 230 250 L 90 250 Z"
          fill="rgba(137, 1, 73, 0.2)"
          stroke="rgba(246, 208, 111, 0.4)"
          strokeWidth="1"
          strokeDasharray="5 3"
        />
        <text
          x="105"
          y="198"
          fill="rgba(246, 208, 111, 0.7)"
          fontSize="9"
          fontFamily="monospace"
        >
          LABEL FACE // 473 ML
        </text>
        <text
          x="115"
          y="214"
          fill="rgba(244, 238, 229, 0.4)"
          fontSize="8"
          fontFamily="monospace"
        >
          SPOT UV EMBOSS
        </text>
      </svg>

      {/* CMYK Ink Density Swatches */}
      <div className="absolute right-[26%] bottom-[20%] flex items-center gap-1.5 p-2 rounded-lg bg-black/40 border border-white/10 backdrop-blur-md pointer-events-none select-none hidden md:flex">
        <div className="w-5 h-5 rounded bg-cyan-400/80 flex items-center justify-center font-mono text-[8px] text-black font-bold">
          C
        </div>
        <div className="w-5 h-5 rounded bg-[#890149] flex items-center justify-center font-mono text-[8px] text-white font-bold">
          M
        </div>
        <div className="w-5 h-5 rounded bg-amber-400/80 flex items-center justify-center font-mono text-[8px] text-black font-bold">
          Y
        </div>
        <div className="w-5 h-5 rounded bg-zinc-800 flex items-center justify-center font-mono text-[8px] text-white font-bold border border-white/20">
          K
        </div>
        <span className="font-mono text-[9px] text-white/50 pl-2">
          PANTONE 228 C
        </span>
      </div>
    </div>
  );
}

export default ChapterIntro;
