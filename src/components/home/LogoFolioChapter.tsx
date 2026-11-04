"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSiteExperience } from "@/components/studio/SiteExperience";
import { projects } from "@/lib/projects";
import { ArrowDown, ArrowUpRight, Compass, Sparkles, ExternalLink, Info } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function LogoFolioChapter() {
  const logoProject = projects[0];
  const { reducedMotion } = useSiteExperience();

  // Active mark inspection state
  const [inspectedBrand, setInspectedBrand] = useState<number>(0);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const bgGridRef = useRef<HTMLDivElement>(null);

  // Beat 1 & 2: Typography & Oversized Mark Layer
  const titleGroupRef = useRef<HTMLDivElement>(null);
  const titleWordRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const metaBadgeRef = useRef<HTMLDivElement>(null);

  // Oversized Lead Mark & Scroll-Driven Geometric Mask
  const oversizedMarkContainerRef = useRef<HTMLDivElement>(null);
  const maskApertureRef = useRef<HTMLDivElement>(null);
  const constructionLinesRef = useRef<SVGSVGElement>(null);

  // Floating mark fragments (depth planes)
  const fragment1Ref = useRef<HTMLDivElement>(null); // Brûlé
  const fragment2Ref = useRef<HTMLDivElement>(null); // Vèrda
  const fragment3Ref = useRef<HTMLDivElement>(null); // Nína
  const fragment4Ref = useRef<HTMLDivElement>(null); // Lùmora

  // Beat 3: Assembled Clean Gallery
  const gallerySectionRef = useRef<HTMLDivElement>(null);
  const galleryHeadingRef = useRef<HTMLDivElement>(null);
  const galleryGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion) {
      const targets = [
        titleWordRef.current,
        subtitleRef.current,
        metaBadgeRef.current,
        oversizedMarkContainerRef.current,
        maskApertureRef.current,
        constructionLinesRef.current,
        fragment1Ref.current,
        fragment2Ref.current,
        fragment3Ref.current,
        fragment4Ref.current,
        galleryHeadingRef.current,
        galleryGridRef.current,
      ];
      targets.forEach((el) => {
        if (el) gsap.set(el, { clearProps: "all" });
      });
      return;
    }

    if (!wrapperRef.current || !stageRef.current) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // DESKTOP: 220vh pinned 3-beat sequence
      mm.add("(min-width: 1024px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top top",
            end: "bottom bottom",
            pin: stageRef.current,
            scrub: 1.0,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // ---------------------------------------------------------------------
        // BEAT 1: 0% -> 25%
        // Establish section title & reveal the oversized mark in dramatic focus
        // ---------------------------------------------------------------------
        if (titleWordRef.current) {
          tl.fromTo(
            titleWordRef.current,
            { scale: 1.3, y: -70, opacity: 0.15, filter: "blur(8px)" },
            { scale: 1.0, y: 0, opacity: 1, filter: "blur(0px)", ease: "power2.out", duration: 0.25 },
            0
          );
        }

        if (metaBadgeRef.current) {
          tl.fromTo(
            metaBadgeRef.current,
            { y: -30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.15 },
            0.05
          );
        }

        if (subtitleRef.current) {
          tl.fromTo(
            subtitleRef.current,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 0.9, duration: 0.2 },
            0.08
          );
        }

        // Floating mark fragments enter from periphery
        if (fragment1Ref.current) {
          tl.fromTo(
            fragment1Ref.current,
            { x: -160, y: -100, rotation: -12, opacity: 0, scale: 0.8 },
            { x: 0, y: 0, rotation: -5, opacity: 0.85, scale: 1, ease: "power1.out", duration: 0.2 },
            0
          );
        }

        if (fragment2Ref.current) {
          tl.fromTo(
            fragment2Ref.current,
            { x: 170, y: -70, rotation: 14, opacity: 0, scale: 0.75 },
            { x: 0, y: 0, rotation: 5, opacity: 0.85, scale: 1, ease: "power1.out", duration: 0.2 },
            0.02
          );
        }

        if (fragment3Ref.current) {
          tl.fromTo(
            fragment3Ref.current,
            { x: -130, y: 110, rotation: 8, opacity: 0, scale: 0.85 },
            { x: 0, y: 0, rotation: 3, opacity: 0.85, scale: 1, ease: "power1.out", duration: 0.2 },
            0.04
          );
        }

        if (fragment4Ref.current) {
          tl.fromTo(
            fragment4Ref.current,
            { x: 140, y: 120, rotation: -10, opacity: 0, scale: 0.8 },
            { x: 0, y: 0, rotation: -4, opacity: 0.85, scale: 1, ease: "power1.out", duration: 0.2 },
            0.03
          );
        }

        // ---------------------------------------------------------------------
        // BEAT 2: 25% -> 65%
        // SOFTLY EXPANDING APERTURE & GENTLE CAMERA PUSH TOWARD SCULPTURAL PLAQUES
        // ---------------------------------------------------------------------
        if (oversizedMarkContainerRef.current) {
          tl.fromTo(
            oversizedMarkContainerRef.current,
            { scale: 0.85, opacity: 0, y: 50 },
            { scale: 1.0, opacity: 1, y: 0, ease: "power2.inOut", duration: 0.35 },
            0.25
          );
        }

        // Softly expanding aperture mask revealing sculptural plaques
        if (maskApertureRef.current) {
          tl.fromTo(
            maskApertureRef.current,
            { clipPath: "circle(22% at 50% 50%)", scale: 0.96 },
            { clipPath: "circle(85% at 50% 50%)", scale: 1.08, ease: "power2.inOut", duration: 0.35 },
            0.25
          );
        }

        // Construction grid lines fade in and illuminate precision geometry
        if (constructionLinesRef.current) {
          tl.fromTo(
            constructionLinesRef.current,
            { opacity: 0, scale: 0.9 },
            { opacity: 1, scale: 1.0, ease: "power2.out", duration: 0.3 },
            0.3
          );
        }

        // Title and floating fragments ease away smoothly to spotlight mark
        if (titleWordRef.current) {
          tl.to(
            titleWordRef.current,
            { y: -100, scale: 0.85, opacity: 0.15, ease: "power2.inOut", duration: 0.3 },
            0.35
          );
        }

        if (subtitleRef.current) {
          tl.to(subtitleRef.current, { opacity: 0, y: -30, duration: 0.2 }, 0.35);
        }

        if (fragment1Ref.current) {
          tl.to(fragment1Ref.current, { x: -280, y: -160, opacity: 0, duration: 0.25 }, 0.35);
        }
        if (fragment2Ref.current) {
          tl.to(fragment2Ref.current, { x: 280, y: -140, opacity: 0, duration: 0.25 }, 0.35);
        }
        if (fragment3Ref.current) {
          tl.to(fragment3Ref.current, { x: -260, y: 180, opacity: 0, duration: 0.25 }, 0.35);
        }
        if (fragment4Ref.current) {
          tl.to(fragment4Ref.current, { x: 260, y: 190, opacity: 0, duration: 0.25 }, 0.35);
        }

        // ---------------------------------------------------------------------
        // BEAT 3: 65% -> 100%
        // Carries visual into the clean assembled marks gallery
        // ---------------------------------------------------------------------
        if (oversizedMarkContainerRef.current) {
          tl.to(
            oversizedMarkContainerRef.current,
            { scale: 0.96, opacity: 0.9, y: -20, ease: "power2.out", duration: 0.25 },
            0.65
          );
        }

        if (galleryHeadingRef.current) {
          tl.fromTo(
            galleryHeadingRef.current,
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, ease: "power2.out", duration: 0.3 },
            0.7
          );
        }

        if (galleryGridRef.current) {
          tl.fromTo(
            galleryGridRef.current,
            { y: 60, opacity: 0 },
            { y: 0, opacity: 1, ease: "power2.out", duration: 0.3 },
            0.75
          );
        }
      });

      // MOBILE: Native touch sequence with visible mask aperture effect
      mm.add("(max-width: 1023px)", () => {
        if (titleWordRef.current) {
          gsap.fromTo(
            titleWordRef.current,
            { y: 20, opacity: 0.4 },
            {
              y: 0,
              opacity: 1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: titleWordRef.current,
                start: "top 85%",
                end: "top 50%",
                scrub: 0.5,
              },
            }
          );
        }

        if (oversizedMarkContainerRef.current) {
          gsap.fromTo(
            oversizedMarkContainerRef.current,
            { scale: 0.92, opacity: 0.7 },
            {
              scale: 1.0,
              opacity: 1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: oversizedMarkContainerRef.current,
                start: "top 85%",
                end: "bottom 55%",
                scrub: 0.5,
              },
            }
          );
        }

        if (galleryGridRef.current) {
          gsap.fromTo(
            galleryGridRef.current,
            { y: 25, opacity: 0.6 },
            {
              y: 0,
              opacity: 1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: galleryGridRef.current,
                start: "top 85%",
                end: "top 45%",
                scrub: 0.5,
              },
            }
          );
        }
      });
    }, wrapperRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  const activeMarkData = (logoProject.brands && logoProject.brands[inspectedBrand]) || {
    name: "brùlè",
    slug: "brule",
    category: "Specialty Coffee / Café",
    tagline: "Good Coffee. Brighter Days.",
    concept: "A tactile coffee identity with expressive serif letterforms and a leaf-and-bean mark, applied across coffee packaging, ceramics, and signage.",
    panelImage: "/projects/logo-folio/brands/01-brule-case-study.webp",
    heroImage: "/projects/logo-folio/previews/01-brule-hero.webp",
  };

  return (
    <section
      ref={wrapperRef}
      id="chapter-logofolio"
      className="logo-folio-world-wrapper relative w-full lg:min-h-[220vh] bg-[#160B12] text-[#F3F3E7] select-none scroll-mt-[var(--nav-height,64px)]"
      aria-label="Chapter 01: Logo Folio — Individual Marks & Monograms"
    >
      {/* Anchor aliases for backward compatibility */}
      <div id="logofolio" className="absolute -top-24 pointer-events-none" aria-hidden="true" />
      <div id="intro-logo" className="absolute -top-24 pointer-events-none" aria-hidden="true" />

      {/* =========================================================================
          PINNED STAGE (Sticky on desktop, flow on mobile)
          ========================================================================= */}
      <div
        ref={stageRef}
        className="logo-folio-stage w-full min-h-screen lg:h-screen lg:sticky lg:top-0 overflow-hidden flex flex-col justify-between p-4 sm:p-8 lg:p-12"
        style={{
          background:
            "radial-gradient(circle at 65% 35%, rgba(137, 1, 73, 0.42) 0%, rgba(22, 11, 18, 0.98) 72%)",
        }}
      >
        {/* Background Grid & Precision Alignment Rules */}
        <div
          ref={bgGridRef}
          className="absolute inset-0 pointer-events-none opacity-40 z-0 overflow-hidden"
          aria-hidden="true"
        >
          <svg className="w-full h-full object-cover" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 900">
            <defs>
              <pattern id="lf-grid-01" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(243, 243, 231, 0.04)" strokeWidth="1" />
                <circle cx="60" cy="60" r="1" fill="rgba(230, 173, 199, 0.2)" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#lf-grid-01)" />
            {/* Guide Lines */}
            <line x1="0" y1="210" x2="1440" y2="210" stroke="rgba(230, 173, 199, 0.15)" strokeWidth="1" strokeDasharray="4 4" />
            <text x="30" y="202" fill="rgba(230, 173, 199, 0.35)" fontSize="9" fontFamily="monospace">
              CAP HEIGHT // 720.00 PT
            </text>
            <line x1="0" y1="580" x2="1440" y2="580" stroke="rgba(230, 173, 199, 0.18)" strokeWidth="1" />
            <text x="30" y="572" fill="rgba(230, 173, 199, 0.35)" fontSize="9" fontFamily="monospace">
              BASELINE // 144.00 PT (OPTICAL KERNING)
            </text>
            <line x1="720" y1="0" x2="720" y2="900" stroke="rgba(137, 1, 73, 0.25)" strokeWidth="1" strokeDasharray="8 6" />
          </svg>
        </div>

        {/* TOP HEADER META */}
        <header
          ref={metaBadgeRef}
          className="relative z-10 flex items-center justify-between gap-4 pb-4 border-b border-white/10 font-mono text-[11px] sm:text-xs tracking-wider uppercase"
        >
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#890149] animate-pulse" />
              01 / SELECTED WORK
            </span>
            <span className="hidden sm:inline-block text-[#F3F3E7]/70">
              Logo Folio · Study of Individual Marks
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden md:inline-block text-white/40 text-[10px]">
              6 FICTIONAL MARKS // 2026
            </span>
            <a
              href="#gallery-marks"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/20 hover:border-white/60 bg-white/5 hover:bg-white/15 transition-all text-[#F3F3E7] text-[11px]"
            >
              <span>Inspect Marks Gallery</span>
              <ArrowDown size={13} aria-hidden="true" />
            </a>
          </div>
        </header>

        {/* CENTER STAGE CONTAINER */}
        <div className="relative z-10 my-auto flex flex-col items-center justify-center w-full max-w-7xl mx-auto min-h-[460px]">
          {/* FLOATING MARKS DEPTH PLANES (Periphery) */}
          <div
            ref={fragment1Ref}
            className="absolute -left-4 sm:left-4 lg:left-8 top-4 w-36 sm:w-48 lg:w-60 aspect-[4/3] rounded-xl overflow-hidden border border-white/15 shadow-2xl z-10 pointer-events-none hidden sm:block"
          >
            <Image
              src="/projects/logo-folio/previews/01-brule-hero.webp"
              alt="Brûlé Coffee Mark Fragment"
              fill
              className="object-cover"
              sizes="240px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2.5">
              <span className="font-mono text-[10px] text-white/90">01 / brùlè</span>
            </div>
          </div>

          <div
            ref={fragment2Ref}
            className="absolute -right-4 sm:right-4 lg:right-8 top-8 w-36 sm:w-48 lg:w-60 aspect-[4/3] rounded-xl overflow-hidden border border-white/15 shadow-2xl z-10 pointer-events-none hidden sm:block"
          >
            <Image
              src="/projects/logo-folio/previews/02-verda-hero.webp"
              alt="Vèrda Botanical Mark Fragment"
              fill
              className="object-cover"
              sizes="240px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2.5">
              <span className="font-mono text-[10px] text-white/90">02 / vèrda</span>
            </div>
          </div>

          <div
            ref={fragment3Ref}
            className="absolute -left-2 sm:left-6 lg:left-12 bottom-6 w-36 sm:w-48 lg:w-56 aspect-[4/3] rounded-xl overflow-hidden border border-white/15 shadow-2xl z-10 pointer-events-none hidden md:block"
          >
            <Image
              src="/projects/logo-folio/previews/03-nina-hero.webp"
              alt="Nína Fashion Mark Fragment"
              fill
              className="object-cover"
              sizes="240px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2.5">
              <span className="font-mono text-[10px] text-white/90">03 / nína</span>
            </div>
          </div>

          <div
            ref={fragment4Ref}
            className="absolute -right-2 sm:right-6 lg:right-12 bottom-4 w-36 sm:w-48 lg:w-56 aspect-[4/3] rounded-xl overflow-hidden border border-white/15 shadow-2xl z-10 pointer-events-none hidden md:block"
          >
            <Image
              src="/projects/logo-folio/previews/04-lumora-hero.webp"
              alt="Lùmora Travel Mark Fragment"
              fill
              className="object-cover"
              sizes="240px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2.5">
              <span className="font-mono text-[10px] text-white/90">04 / lùmora</span>
            </div>
          </div>

          {/* BEAT 1: OVERSIZED TITLE (The Anatomy of the Mark) */}
          <div
            ref={titleGroupRef}
            className="relative z-1 text-center flex flex-col items-center justify-center max-w-4xl px-4 select-none"
          >
            <span className="font-mono text-xs sm:text-sm tracking-widest text-[#E6ADC7] uppercase mb-2">
              Study of Individual Marks & Monograms
            </span>
            <h2
              ref={titleWordRef}
              className="font-cubao text-6xl sm:text-8xl md:text-9xl lg:text-[8rem] xl:text-[9.5rem] leading-[0.88] tracking-tight uppercase text-[#F3F3E7] drop-shadow-md"
            >
              LOGO FOLIO
            </h2>
            <p
              ref={subtitleRef}
              className="mt-3 sm:mt-5 text-sm sm:text-base lg:text-lg text-[#F3F3E7]/80 max-w-xl font-normal leading-relaxed"
            >
              An exploration of individual marks, typographic rhythm, and negative-space tension — before expanding into full identity systems.
            </p>
          </div>

          {/* BEAT 2: SIX SCULPTURAL LOGO PLAQUES WITH SOFT APERTURE REVEAL */}
          <div
            ref={oversizedMarkContainerRef}
            className="relative lg:absolute inset-x-2 sm:inset-x-8 lg:inset-x-16 max-w-5xl mx-auto z-20 pointer-events-auto mt-6 lg:mt-0"
          >
            <div
              ref={maskApertureRef}
              className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-[#100A0E] group"
              style={{ clipPath: "circle(60% at 50% 50%)" }}
            >
              {/* Sculptural Logo Plaques Exhibition Artwork */}
              <Image
                src="/projects/exhibition/logo-plaques-hero.png"
                alt="Six sculptural logo plaques in warm ivory — Logo Folio Chapter Opening"
                fill
                sizes="(max-width: 1024px) 95vw, 1200px"
                className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
                priority
              />

              {/* Subtle SVG Geometric Construction Overlay */}
              <svg
                ref={constructionLinesRef}
                className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-50"
                viewBox="0 0 1000 450"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="500" cy="225" r="140" stroke="rgba(230, 173, 199, 0.25)" strokeWidth="1" strokeDasharray="4 4" />
                <circle cx="500" cy="225" r="210" stroke="rgba(137, 1, 73, 0.3)" strokeWidth="1" />
                <line x1="0" y1="225" x2="1000" y2="225" stroke="rgba(243, 243, 231, 0.12)" strokeWidth="1" />
                <line x1="500" y1="0" x2="500" y2="450" stroke="rgba(243, 243, 231, 0.12)" strokeWidth="1" />
              </svg>

              {/* Hover Badge */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <span className="px-5 py-2.5 rounded-full bg-[#890149] text-white font-mono text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl">
                  <span>Scroll to Explore Mark Plaques</span>
                  <ArrowDown size={14} />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM METADATA & HINT */}
        <footer className="relative z-10 flex items-center justify-between pt-4 border-t border-white/10 font-mono text-xs text-white/60">
          <div className="flex items-center gap-4 text-[10px] tracking-wider">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#890149]" />
              OPTICAL AXIS
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E6ADC7]" />
              GEOMETRIC APERTURE
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-white/50 tracking-wider">
            <span className="hidden sm:inline">ASSEMBLE MARKS</span>
            <ArrowDown size={12} className="animate-bounce" aria-hidden="true" />
          </div>
        </footer>
      </div>

      {/* =========================================================================
          BEAT 3: ASSEMBLED CLEAN GALLERY (Inspect Each Mark & System Link)
          ========================================================================= */}
      <div
        id="gallery-marks"
        ref={gallerySectionRef}
        className="relative z-20 bg-[#180E15] text-[#F3F3E7] py-16 sm:py-24 border-t border-white/10"
        aria-labelledby="gallery-title"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={galleryHeadingRef} className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-white/15">
            <div>
              <div className="flex items-center gap-2 mb-2 font-mono text-xs uppercase tracking-widest text-[#E6ADC7]">
                <span className="w-2 h-2 rounded-full bg-[#890149]" />
                <span>01 / SELECTED WORK · LOGO FOLIO</span>
              </div>
              <h3 id="gallery-title" className="font-cubao text-4xl sm:text-6xl uppercase tracking-tight text-white leading-none">
                A Personality for Every Story.
              </h3>
              <p className="font-sans text-sm sm:text-base text-white/75 mt-3 max-w-2xl leading-relaxed">
                Six speculative marks exploring distinct industries. Tap any mark below to inspect its geometry, concept story, and links to broader brand systems.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/work/logo-folio"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/20 transition-all font-mono text-xs uppercase tracking-wider text-white"
              >
                <span>Full Case Study</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>

          {/* =========================================================================
              SKETCH LAYOUT: Featured Artwork Left, Info Right, Thumbnails Beneath
              ========================================================================= */}
          <div className="mt-10 rounded-3xl bg-[#110A0F] border border-white/15 p-6 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* LEFT: FEATURED ARTWORK */}
              <div className="lg:col-span-7 relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-[#090508] group">
                <Image
                  key={`featured-${activeMarkData.slug}`}
                  src={activeMarkData.panelImage || activeMarkData.heroImage}
                  alt={`${activeMarkData.name} sculptural mark plaque`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 750px"
                  className="object-contain object-center transition-all duration-500 will-change-transform group-hover:scale-[1.01]"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between text-xs font-mono text-white/90">
                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[#E6ADC7]">
                    Plaque 0{inspectedBrand + 1} / 06 · {activeMarkData.name}
                  </span>
                  <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
                    {activeMarkData.category}
                  </span>
                </div>
              </div>

              {/* RIGHT: PROJECT INFORMATION */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2 font-mono text-xs uppercase tracking-widest text-[#E6ADC7]">
                    <span className="w-2 h-2 rounded-full bg-[#890149]" />
                    <span>01{String.fromCharCode(65 + inspectedBrand)} · {activeMarkData.category}</span>
                  </div>

                  <h4 className="font-cubao text-3xl sm:text-4xl lg:text-5xl text-white uppercase tracking-tight leading-tight">
                    {activeMarkData.name}
                  </h4>

                  <p className="font-mono text-xs text-[#E6ADC7] mt-1.5 italic">
                    &ldquo;{activeMarkData.tagline}&rdquo;
                  </p>

                  <p className="font-sans text-sm text-white/80 mt-3 leading-relaxed">
                    {activeMarkData.concept}
                  </p>
                </div>

                {/* GEOMETRY & OPTICAL HIGHLIGHTS */}
                <div className="space-y-2.5 pt-4 border-t border-white/10 font-mono text-xs">
                  <div className="flex items-center justify-between text-white/70 py-1 border-b border-white/5">
                    <span className="text-[#E6ADC7]">Optical Geometry</span>
                    <span>Concentric Golden Ratio &amp; Tangents</span>
                  </div>
                  <div className="flex items-center justify-between text-white/70 py-1 border-b border-white/5">
                    <span className="text-[#E6ADC7]">Kerning Rhythm</span>
                    <span>Custom Display Monogram</span>
                  </div>
                </div>

                {/* ACTION BUTTON */}
                <div className="pt-2">
                  <Link
                    href={`${logoProject.route}#brand-${activeMarkData.slug}`}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-mono text-xs uppercase tracking-wider transition-all"
                  >
                    <span>Explore {activeMarkData.name} Study ↗</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* THUMBNAIL STRIP BENEATH (Switches featured artwork with brief crossfade & keyboard navigation) */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <span className="block font-mono text-[11px] text-white/50 uppercase tracking-wider mb-3">
                Select Mark Plaque to Inspect (01–06):
              </span>
              <div
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3"
                role="tablist"
                aria-label="Logo Folio Mark Plaques"
              >
                {logoProject.brands?.map((b, i) => {
                  const isSelected = inspectedBrand === i;
                  return (
                    <button
                      key={b.slug}
                      type="button"
                      role="tab"
                      aria-selected={isSelected}
                      onClick={() => setInspectedBrand(i)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setInspectedBrand(i);
                        }
                      }}
                      className={`text-left p-2.5 rounded-xl border transition-all cursor-pointer group ${
                        isSelected
                          ? "bg-white/15 border-[#E6ADC7] ring-2 ring-[#E6ADC7]/60 shadow-lg"
                          : "bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/[0.08]"
                      }`}
                    >
                      <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-black/40 mb-2 border border-white/10">
                        <Image
                          src={b.heroImage}
                          alt={`${b.name} thumbnail`}
                          fill
                          sizes="(max-width: 650px) 40vw, 120px"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <span className="block font-mono text-[11px] font-semibold text-white truncate">
                        0{i + 1} · {b.name}
                      </span>
                      <span className="block text-[10px] text-white/60 truncate">{b.category}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* TRANSITION CUE INTO CHAPTER 02: BRAND IDENTITY */}
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-white/60">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#819845]" />
              <span>Next Discipline: Complete Brand Systems</span>
            </div>
            <a
              href="#chapter-identity"
              className="inline-flex items-center gap-2 text-[#E6ADC7] hover:text-white transition-colors"
            >
              <span>Scroll into 02 / Brand Identity</span>
              <ArrowDown size={14} className="animate-bounce" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
