"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSiteExperience } from "@/components/studio/SiteExperience";
import { ArrowDown, ArrowUpRight, Check, Maximize2, X } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface LightboxState {
  src: string;
  alt: string;
  title: string;
  aspect: string;
}

export default function BrandIdentityChapter() {
  const { reducedMotion } = useSiteExperience();
  const [earthkindTouchpoint, setEarthkindTouchpoint] = useState(0);
  const [activeCopied, setActiveCopied] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);

  // Opening stage refs
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const leftCurtainRef = useRef<HTMLDivElement>(null);
  const rightCurtainRef = useRef<HTMLDivElement>(null);
  const leadBoardRef = useRef<HTMLDivElement>(null);
  const titleGroupRef = useRef<HTMLDivElement>(null);
  const titleWordRef = useRef<HTMLHeadingElement>(null);
  const metaBadgeRef = useRef<HTMLDivElement>(null);

  // Editorial presentation sheet refs
  const earthkindRef = useRef<HTMLDivElement>(null);
  const veloraLeatherRef = useRef<HTMLDivElement>(null);
  const veloraSkincareRef = useRef<HTMLDivElement>(null);
  const nexaRef = useRef<HTMLDivElement>(null);

  const copyColor = (hex: string) => {
    navigator.clipboard?.writeText(hex);
    setActiveCopied(hex);
    setTimeout(() => setActiveCopied(null), 1500);
  };

  // Close lightbox on Escape key
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const earthKindColors = [
    { name: "Forest", hex: "#164740", bg: "bg-[#164740]", text: "text-white" },
    { name: "Meadow", hex: "#819845", bg: "bg-[#819845]", text: "text-white" },
    { name: "Ivory", hex: "#F3EFE3", bg: "bg-[#F3EFE3]", text: "text-[#164740]" },
    { name: "Bark", hex: "#452C1C", bg: "bg-[#452C1C]", text: "text-white" },
  ];

  const veloraLeatherColors = [
    { name: "Signature Brown", hex: "#642D23", bg: "bg-[#642D23]", text: "text-white" },
    { name: "Warm Ivory", hex: "#F0E8DC", bg: "bg-[#F0E8DC]", text: "text-[#642D23]" },
    { name: "Soft Taupe", hex: "#B7A391", bg: "bg-[#B7A391]", text: "text-white" },
    { name: "Clay Brown", hex: "#994D3C", bg: "bg-[#994D3C]", text: "text-white" },
  ];

  const veloraSkincareColors = [
    { name: "Brand Green", hex: "#3F523B", bg: "bg-[#3F523B]", text: "text-white" },
    { name: "Cream", hex: "#EDE7DD", bg: "bg-[#EDE7DD]", text: "text-[#3F523B]" },
    { name: "Sage", hex: "#A7B89F", bg: "bg-[#A7B89F]", text: "text-[#3F523B]" },
    { name: "Mineral Taupe", hex: "#8C9B86", bg: "bg-[#8C9B86]", text: "text-white" },
  ];

  const nexaColors = [
    { name: "Neon Lime", hex: "#B4F000", bg: "bg-[#B4F000]", text: "text-black" },
    { name: "Matte Black", hex: "#0D0E11", bg: "bg-[#0D0E11]", text: "text-white" },
    { name: "Graphite", hex: "#1A1D24", bg: "bg-[#1A1D24]", text: "text-white" },
    { name: "Clinical White", hex: "#FFFFFF", bg: "bg-white", text: "text-black" },
  ];

  const earthkindTouchpoints = [
    { title: "Glass Dropper", spec: "Screen-printed frosted green bottle", desc: "Frosted green glass with screen-printed white branding, featuring child-resistant precision dropper cap." },
    { title: "Kraft Pouch", spec: "Compostable paper with water-based inks", desc: "FSC certified multi-wall pouch made from unbleached kraft with bio-barrier film and vegetable inks." },
    { title: "Unboxing Mailer", spec: "FSC kraft box with patterned tissue & card", desc: "Rigid kraft corrugated shipper featuring inner botanical flood print, debossed seal, and folded welcome note." },
    { title: "Canvas Shopper", spec: "Screen-printed organic cotton tote bag", desc: "Heavyweight 320gsm unbleached organic cotton tote bag with screen-printed brandmark for physical retail." },
    { title: "Digital Shop", spec: "Mobile product PDP & cart interaction", desc: "Responsive e-commerce product detail page emphasizing sustainable ingredients, batch transparency, and refill subscription." },
  ];

  useEffect(() => {
    if (reducedMotion) {
      const targets = [
        titleWordRef.current,
        metaBadgeRef.current,
        leadBoardRef.current,
        leftCurtainRef.current,
        rightCurtainRef.current,
        earthkindRef.current,
        veloraLeatherRef.current,
        veloraSkincareRef.current,
        nexaRef.current,
      ];
      targets.forEach((el) => {
        if (el) gsap.set(el, { clearProps: "all" });
      });
      return;
    }

    if (!wrapperRef.current || !stageRef.current) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // DESKTOP: Separating vertical curtain panels + restrained camera push
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

        // BEAT 1 (0% -> 45%): Two vertical panels softly part left and right
        if (leftCurtainRef.current) {
          tl.to(leftCurtainRef.current, { xPercent: -102, ease: "power2.inOut", duration: 0.45 }, 0);
        }
        if (rightCurtainRef.current) {
          tl.to(rightCurtainRef.current, { xPercent: 102, ease: "power2.inOut", duration: 0.45 }, 0);
        }

        // Restrained camera push into the cumulative artwork beneath
        if (leadBoardRef.current) {
          tl.fromTo(
            leadBoardRef.current,
            { scale: 0.96, opacity: 0.8 },
            { scale: 1.05, opacity: 1, ease: "power2.out", duration: 0.5 },
            0.05
          );
        }

        // Title and badge settle cleanly
        if (titleWordRef.current) {
          tl.fromTo(
            titleWordRef.current,
            { y: -30, opacity: 0.3 },
            { y: 0, opacity: 1, ease: "power1.out", duration: 0.3 },
            0
          );
        }
        if (metaBadgeRef.current) {
          tl.fromTo(
            metaBadgeRef.current,
            { y: -15, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.2 },
            0.05
          );
        }

        // BEAT 2 (45% -> 75%): Pause for contemplation, allowing visitor to inspect the opening board
        tl.to({}, { duration: 0.3 }, 0.45);

        // BEAT 3 (75% -> 100%): Seamless release into the presentation sheets below
        if (leadBoardRef.current) {
          tl.to(leadBoardRef.current, { y: -20, opacity: 0.9, duration: 0.25 }, 0.75);
        }
      });

      // MOBILE: Native touch sequence with separating vertical curtain panels & board reveal
      mm.add("(max-width: 1023px)", () => {
        const mobileTl = gsap.timeline({
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 80%",
            end: "top 20%",
            scrub: 0.6,
          },
        });

        if (titleWordRef.current) {
          mobileTl.fromTo(
            titleWordRef.current,
            { y: 30, opacity: 0.25 },
            { y: 0, opacity: 1, ease: "power2.out", duration: 0.3 },
            0
          );
        }

        if (metaBadgeRef.current) {
          mobileTl.fromTo(
            metaBadgeRef.current,
            { y: -15, opacity: 0 },
            { y: 0, opacity: 1, ease: "power2.out", duration: 0.25 },
            0.05
          );
        }

        // Two vertical panels softly part left and right to reveal lead presentation board
        if (leftCurtainRef.current) {
          mobileTl.to(leftCurtainRef.current, { xPercent: -100, ease: "power2.inOut", duration: 0.5 }, 0.05);
        }
        if (rightCurtainRef.current) {
          mobileTl.to(rightCurtainRef.current, { xPercent: 100, ease: "power2.inOut", duration: 0.5 }, 0.05);
        }

        if (leadBoardRef.current) {
          mobileTl.fromTo(
            leadBoardRef.current,
            { scale: 0.94, opacity: 0.7 },
            { scale: 1.02, opacity: 1, ease: "power2.out", duration: 0.5 },
            0.08
          );
        }
      });

      // Directional reveals for each brand presentation sheet on scroll
      const sheets = [
        { ref: earthkindRef, color: "#164740" },
        { ref: veloraLeatherRef, color: "#642D23" },
        { ref: veloraSkincareRef, color: "#3F523B" },
        { ref: nexaRef, color: "#B4F000" },
      ];

      sheets.forEach(({ ref }) => {
        if (!ref.current) return;
        gsap.fromTo(
          ref.current,
          { y: 40, opacity: 0.8 },
          {
            y: 0,
            opacity: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ref.current,
              start: "top 85%",
              end: "top 45%",
              scrub: 0.6,
            },
          }
        );
      });
    }, wrapperRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={wrapperRef}
      id="brand-identity"
      className="brand-world-wrapper relative w-full lg:min-h-[170vh] bg-[#0A100C]"
      aria-label="Chapter 02: Brand Identity Systems"
    >
      {/* Anchor for direct discipline navigation */}
      <div id="chapter-identity" className="absolute -top-24 pointer-events-none scroll-mt-[var(--nav-height,64px)]" aria-hidden="true" />

      {/* =========================================================================
          STAGE (Sticky on desktop during panel separation, natural flow on mobile)
          ========================================================================= */}
      <div
        ref={stageRef}
        className="brand-stage w-full min-h-screen lg:h-screen lg:sticky lg:top-0 lg:overflow-hidden overflow-visible flex flex-col justify-between pt-[calc(var(--nav-height,64px)+0.75rem)] pb-4 px-4 sm:px-8 lg:px-12 text-[#F4EEE5] select-none"
        style={{
          background: "radial-gradient(circle at 50% 40%, rgba(22, 71, 64, 0.45) 0%, rgba(10, 16, 12, 0.98) 75%)",
        }}
      >
        {/* TOP HEADER META */}
        <header
          ref={metaBadgeRef}
          className="relative z-30 flex items-center justify-between gap-4 pb-3 border-b border-white/10 font-mono text-[11px] sm:text-xs tracking-wider uppercase max-w-7xl mx-auto w-full shrink-0"
        >
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#819845]/40 bg-[#819845]/10 font-semibold text-[#D4DEC9]">
              <span className="w-2 h-2 rounded-full bg-[#819845] animate-pulse" />
              CHAPTER 02
            </span>
            <span className="hidden sm:inline-block text-[#D4DEC9]/80">
              Brand Identity Systems &amp; Visual Architectures
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden md:inline-block text-[#819845] text-[10px]">
              FOUR SYSTEMS
            </span>
            <a
              href="#showcase-earthkind"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/20 hover:border-white/60 bg-white/5 hover:bg-white/15 transition-all text-[#F4EEE5] text-[11px]"
            >
              <span>Explore Systems</span>
              <ArrowDown size={13} aria-hidden="true" />
            </a>
          </div>
        </header>

        {/* CENTER STAGE CONTAINER (Cumulative Artwork with Two Separating Vertical Panels) */}
        <div className="relative z-10 my-auto flex-1 flex flex-col items-center justify-center w-full max-w-5xl mx-auto min-h-0 py-2">
          {/* Chapter Title & Subtitle */}
          <div ref={titleGroupRef} className="text-center mb-4 max-w-2xl px-4 shrink-0">
            <h2
              ref={titleWordRef}
              className="font-cubao text-4xl sm:text-6xl lg:text-7xl leading-[0.9] tracking-tight uppercase text-[#F3EFE3] drop-shadow-md"
            >
              Brand Identity
            </h2>
            <p className="mt-2 text-xs sm:text-sm lg:text-base text-[#D4DEC9] font-normal leading-relaxed">
              Complete brand systems designed from core marks into typography, tactile packaging, and omnichannel social suites.
            </p>
          </div>

          {/* Cumulative Artwork Frame */}
          <div
            ref={leadBoardRef}
            className="relative w-full max-w-4xl aspect-[16/9] max-h-[380px] sm:max-h-[420px] rounded-2xl overflow-hidden border border-[#819845]/30 shadow-2xl bg-[#08100C] group"
          >
            <Image
              src="/projects/exhibition/brand-identity-hero.png"
              alt="Brand Identity Systems — EarthKind, Vélora Leather, Vélora Skincare, and NEXA"
              fill
              sizes="(max-width: 1024px) 100vw, 1100px"
              className="object-cover object-center transition-transform duration-700"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

            {/* TWO SOFTLY SEPARATING VERTICAL CURTAIN PANELS */}
            <div
              ref={leftCurtainRef}
              className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-[#0A100C] via-[#0E1712] to-[#122018] border-r border-[#819845]/30 flex items-center justify-end pr-4 pointer-events-none z-20"
              aria-hidden="true"
            >
              <div className="flex flex-col items-end opacity-40 font-mono text-[9px] text-[#819845] tracking-widest uppercase rotate-90 origin-right">
                <span>PRESENTATION SHEET // 01</span>
              </div>
            </div>

            <div
              ref={rightCurtainRef}
              className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-[#0A100C] via-[#0E1712] to-[#122018] border-l border-[#819845]/30 flex items-center justify-start pl-4 pointer-events-none z-20"
              aria-hidden="true"
            >
              <div className="flex flex-col items-start opacity-40 font-mono text-[9px] text-[#819845] tracking-widest uppercase -rotate-90 origin-left">
                <span>PRESENTATION SHEET // 02</span>
              </div>
            </div>

            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs font-mono text-white/90 z-10">
              <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-[#819845]/40 text-[#D4DEC9]">
                EarthKind · Vélora Dual Line · NEXA
              </span>
              <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
                Scroll to Inspect Presentation Sheets ↓
              </span>
            </div>
          </div>
        </div>

        {/* BOTTOM METADATA & SCROLL CUE */}
        <footer className="relative z-10 flex items-center justify-between pt-3 border-t border-white/10 font-mono text-xs text-white/60 max-w-7xl mx-auto w-full shrink-0">
          <div className="flex items-center gap-3 text-[10px]">
            <span className="w-2 h-2 rounded-full bg-[#819845]" />
            <span>FOUR COMPLETE SYSTEMS</span>
          </div>
          <a
            href="#showcase-earthkind"
            className="flex items-center gap-2 text-[11px] text-[#D4DEC9] hover:text-white transition-colors"
          >
            <span>SCROLL INTO 02A EARTHKIND</span>
            <ArrowDown size={12} className="animate-bounce" aria-hidden="true" />
          </a>
        </footer>
      </div>

      {/* =========================================================================
          EDITORIAL PRESENTATION SHEETS (EarthKind, Vélora Leather, Vélora Skincare, NEXA)
          Rebuilt around actual image proportions with zero artificial side bars
          ========================================================================= */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16 lg:space-y-24">
        {/* =========================================================================
            02A: EARTHKIND — SUSTAINABLE LIVING IDENTITY (Landscape Board: 16:9)
            ========================================================================= */}
        <section
          ref={earthkindRef}
          id="showcase-earthkind"
          className="w-full rounded-2xl sm:rounded-3xl bg-[#14221C] border border-[#819845]/25 p-4 sm:p-8 lg:p-12 shadow-2xl relative overflow-hidden"
          aria-label="EarthKind Brand Identity System"
        >
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#819845]/20">
            <div>
              <div className="flex items-center gap-2 mb-1.5 font-mono text-xs uppercase tracking-widest text-[#819845]">
                <span className="w-2 h-2 rounded-full bg-[#819845]" />
                <span>02A / SUSTAINABLE LIVING IDENTITY</span>
              </div>
              <h3 className="font-cubao text-3xl sm:text-4xl lg:text-5xl text-[#F3EFE3] uppercase tracking-tight">
                EarthKind — Rooted in Nature.
              </h3>
              <p className="font-sans text-sm sm:text-base text-[#D4DEC9] mt-2 max-w-2xl leading-relaxed">
                Physical packaging and collaterals designed for clean, sustainable unboxing and circular life cycles.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setLightbox({
                  src: "/projects/brand-identity/earthkind-brand-identity.png",
                  alt: "EarthKind brand identity master board",
                  title: "EarthKind — Master System Board",
                  aspect: "aspect-[16/9]",
                })
              }
              className="inline-flex items-center gap-2 px-3.5 py-2 sm:py-1.5 rounded-xl bg-white/5 hover:bg-white/15 border border-[#819845]/30 text-xs font-mono text-[#D4DEC9] hover:text-white transition-all self-start lg:self-end shrink-0 min-h-[44px] sm:min-h-0"
            >
              <Maximize2 size={13} />
              <span>Inspect full board</span>
            </button>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* LEFT: FEATURED ARTWORK (Landscape ~16:9) */}
            <div className="lg:col-span-7 flex flex-col">
              <div
                onClick={() =>
                  setLightbox({
                    src: "/projects/brand-identity/earthkind-brand-identity.png",
                    alt: "EarthKind brand identity master board",
                    title: "EarthKind — Master System Board",
                    aspect: "aspect-[16/9]",
                  })
                }
                className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-[#819845]/30 shadow-2xl bg-[#0D1612] group cursor-pointer"
              >
                <Image
                  src="/projects/brand-identity/earthkind-brand-identity.png"
                  alt="EarthKind brand identity master board — dropper bottle, kraft packaging, unboxing mailer, canvas shopper"
                  fill
                  sizes="(max-width: 1024px) 100vw, 750px"
                  className="object-cover object-center transition-all duration-500 will-change-transform group-hover:scale-[1.01]"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-black/60 backdrop-blur-sm font-mono text-[10px] text-white/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  <Maximize2 size={11} /> Click to zoom
                </div>
              </div>
              <span className="font-mono text-[11px] text-[#D4DEC9]/70 mt-2.5">
                02A.1 // Master System Spread: Frosted glass bottle, kraft mailer, unboxing card, and cotton shopper.
              </span>
            </div>

            {/* RIGHT: SYSTEM INFORMATION & PALETTE */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div>
                <span className="font-mono text-xs text-[#819845] uppercase tracking-wider block mb-1">
                  Touchpoint 0{earthkindTouchpoint + 1} of 05
                </span>
                <h4 className="font-cubao text-2xl sm:text-3xl text-white uppercase tracking-tight">
                  {earthkindTouchpoints[earthkindTouchpoint].title}
                </h4>
                <p className="font-sans text-xs sm:text-sm text-[#D4DEC9] mt-2 leading-relaxed">
                  {earthkindTouchpoints[earthkindTouchpoint].desc}
                </p>
              </div>

              {/* MINERAL COLOR PALETTE WITH CLICK-TO-COPY */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 font-mono text-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#819845] font-semibold uppercase tracking-wider text-[11px]">
                    Mineral Color Palette:
                  </span>
                  <span className="text-[10px] text-white/50">Tap to copy</span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {earthKindColors.map((c) => (
                    <button
                      key={c.hex}
                      onClick={() => copyColor(c.hex)}
                      title={`Copy ${c.name} (${c.hex})`}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold flex items-center gap-1 transition-transform active:scale-95 shadow-sm border border-black/20 ${c.bg} ${c.text}`}
                    >
                      <span>{c.name}</span>
                      <span className="opacity-75">{c.hex}</span>
                      {activeCopied === c.hex && <Check size={10} className="text-emerald-300" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* TYPOGRAPHY HIERARCHY NOTE */}
              <div className="pt-2 border-t border-white/10 font-mono text-xs text-[#D4DEC9] flex items-center justify-between">
                <span>Serif &amp; Sans Duo</span>
                <span className="text-[#819845]">Fraunces + DM Sans</span>
              </div>
            </div>
          </div>

          {/* TOUCHPOINTS STRIP BENEATH */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <span className="block font-mono text-[11px] text-white/50 uppercase tracking-wider mb-3">
              Explore EarthKind Touchpoints (01–05):
            </span>
            <div
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 font-mono text-xs"
              role="tablist"
              aria-label="EarthKind Touchpoints"
            >
              {earthkindTouchpoints.map((t, idx) => {
                const isSelected = earthkindTouchpoint === idx;
                return (
                  <button
                    key={t.title}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setEarthkindTouchpoint(idx)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setEarthkindTouchpoint(idx);
                      }
                    }}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer min-h-[44px] ${
                      isSelected
                        ? "bg-white/15 border-[#819845] ring-2 ring-[#819845]/50 shadow-lg text-white"
                        : "bg-white/5 border-white/10 hover:border-white/30 text-white/70"
                    }`}
                  >
                    <span className="block text-[#819845] font-semibold mb-0.5 text-[11px]">
                      0{idx + 1} / {t.title}
                    </span>
                    <span className="text-[10px] text-white/60 line-clamp-1">{t.spec}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* =========================================================================
            02B: VÉLORA LEATHER GOODS — BESPOKE LUXURY (Portrait Board: 4:5)
            Rebuilt around actual image proportions: 1122 x 1402, zero artificial side panels
            ========================================================================= */}
        <section
          ref={veloraLeatherRef}
          id="showcase-velora"
          className="w-full rounded-2xl sm:rounded-3xl bg-[#1C1614] border border-[#B7A391]/25 p-4 sm:p-8 lg:p-12 shadow-2xl relative overflow-hidden"
          aria-label="Vélora Leather Goods Brand Identity"
        >
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#B7A391]/20">
            <div>
              <div className="flex items-center gap-2 mb-1.5 font-mono text-xs uppercase tracking-widest text-[#B7A391]">
                <span className="w-2 h-2 rounded-full bg-[#B7A391]" />
                <span>02B / BESPOKE LEATHER GOODS</span>
              </div>
              <h3 className="font-cubao text-3xl sm:text-4xl lg:text-5xl text-[#F0E8DC] uppercase tracking-tight">
                Vélora — Tactile Luxury.
              </h3>
              <p className="font-sans text-sm sm:text-base text-[#D8CEBC] mt-2 max-w-2xl leading-relaxed">
                Handcrafted bespoke leather handbags, physical calfskin swatches, and brushed brass hardware, anchored in warm terracotta and rich mineral tones.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setLightbox({
                  src: "/projects/brand-identity/velora-leather-identity.jpg",
                  alt: "Vélora luxury leather goods identity board",
                  title: "Vélora — Leather Goods Presentation Board",
                  aspect: "aspect-[4/5]",
                })
              }
              className="inline-flex items-center gap-2 px-3.5 py-2 sm:py-1.5 rounded-xl bg-white/5 hover:bg-white/15 border border-[#B7A391]/30 text-xs font-mono text-[#D8CEBC] hover:text-white transition-all self-start lg:self-end shrink-0 min-h-[44px] sm:min-h-0"
            >
              <Maximize2 size={13} />
              <span>Inspect full board</span>
            </button>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* LEFT: PORTRAIT ARTWORK COLUMN (~50% width, natural 4:5 ratio, NO black side bars) */}
            <div className="lg:col-span-6 flex flex-col items-center">
              <div
                onClick={() =>
                  setLightbox({
                    src: "/projects/brand-identity/velora-leather-identity.jpg",
                    alt: "Vélora luxury leather goods identity board",
                    title: "Vélora — Leather Goods Presentation Board",
                    aspect: "aspect-[4/5]",
                  })
                }
                className="relative w-full max-w-[500px] aspect-[4/5] rounded-2xl overflow-hidden border border-[#B7A391]/30 shadow-2xl bg-[#140E0C] group cursor-pointer"
              >
                <Image
                  src="/projects/brand-identity/velora-leather-identity.jpg"
                  alt="Vélora luxury leather goods identity board — handbags, bespoke leather swatches, warm terracotta palette"
                  fill
                  sizes="(max-width: 1024px) 100vw, 550px"
                  className="object-cover object-center transition-all duration-500 will-change-transform group-hover:scale-[1.01]"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-black/60 backdrop-blur-sm font-mono text-[10px] text-white/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  <Maximize2 size={11} /> Click to zoom
                </div>
              </div>
              <span className="font-mono text-[11px] text-[#B7A391]/75 mt-2.5 text-center">
                02B.1 // Presentation Board: Calfskin swatches, embossed mark, and luxury hardware.
              </span>
            </div>

            {/* RIGHT: COMPLEMENTARY INFORMATION & PALETTE */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div>
                <span className="font-mono text-xs text-[#B7A391] uppercase tracking-wider block mb-1">
                  Brand Architecture &amp; Materials
                </span>
                <h4 className="font-cubao text-2xl sm:text-3xl text-white uppercase tracking-tight">
                  Calfskin &amp; Brushed Brass
                </h4>
                <p className="font-sans text-xs sm:text-sm text-[#D8CEBC] mt-2 leading-relaxed">
                  Sculptural letterforms paired with warm mineral pigments. The identity extends across custom dustbags, brass hangtags, blind-debossed leather certificates, and boutique retail collateral.
                </p>
              </div>

              {/* PALETTE WITH CLICK-TO-COPY */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 font-mono text-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#B7A391] font-semibold uppercase tracking-wider text-[11px]">
                    Terracotta Leather Palette:
                  </span>
                  <span className="text-[10px] text-white/50">Tap to copy</span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {veloraLeatherColors.map((c) => (
                    <button
                      key={c.hex}
                      onClick={() => copyColor(c.hex)}
                      title={`Copy ${c.name} (${c.hex})`}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold flex items-center gap-1 transition-transform active:scale-95 shadow-sm border border-black/20 ${c.bg} ${c.text}`}
                    >
                      <span>{c.name}</span>
                      <span className="opacity-75">{c.hex}</span>
                      {activeCopied === c.hex && <Check size={10} className="text-emerald-300" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* CRAFT DETAILS TABLE */}
              <div className="pt-3 border-t border-white/10 space-y-2 font-mono text-xs text-[#D8CEBC]">
                <div className="flex justify-between items-center py-1 border-b border-white/5">
                  <span className="text-white/60">Substrate</span>
                  <span className="text-[#F0E8DC]">Full-Grain Calfskin &amp; Textured Linen</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-white/5">
                  <span className="text-white/60">Finish</span>
                  <span className="text-[#F0E8DC]">Blind Deboss + Brushed Brass Foil</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-white/60">Typography</span>
                  <span className="text-[#B7A391]">Cubao Display &amp; Poppins Sans</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            02C: VÉLORA BOTANICAL SKINCARE — CLEAN RITUAL WELLNESS (Portrait Board: 2:3)
            Rebuilt around actual image proportions: 1024 x 1536, zero artificial side panels
            ========================================================================= */}
        <section
          ref={veloraSkincareRef}
          id="showcase-velora-skincare"
          className="w-full rounded-2xl sm:rounded-3xl bg-[#141C16] border border-[#3F523B]/35 p-4 sm:p-8 lg:p-12 shadow-2xl relative overflow-hidden"
          aria-label="Vélora Botanical Skincare Brand Identity"
        >
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#3F523B]/25">
            <div>
              <div className="flex items-center gap-2 mb-1.5 font-mono text-xs uppercase tracking-widest text-[#A7B89F]">
                <span className="w-2 h-2 rounded-full bg-[#A7B89F]" />
                <span>02C / BOTANICAL WELLNESS</span>
              </div>
              <h3 className="font-cubao text-3xl sm:text-4xl lg:text-5xl text-[#EDE7DD] uppercase tracking-tight">
                Vélora — Pure Skin Rituals.
              </h3>
              <p className="font-sans text-sm sm:text-base text-[#C2D0BE] mt-2 max-w-2xl leading-relaxed">
                Cold-pressed botanical skincare formulated for daily mindfulness — housed in recycled amber glass dropper bottles and soft mineral sage cartons.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setLightbox({
                  src: "/projects/brand-identity/velora-skincare-identity.png",
                  alt: "Vélora botanical skincare wellness board",
                  title: "Vélora — Botanical Skincare Presentation Board",
                  aspect: "aspect-[2/3]",
                })
              }
              className="inline-flex items-center gap-2 px-3.5 py-2 sm:py-1.5 rounded-xl bg-white/5 hover:bg-white/15 border border-[#3F523B]/40 text-xs font-mono text-[#C2D0BE] hover:text-white transition-all self-start lg:self-end shrink-0 min-h-[44px] sm:min-h-0"
            >
              <Maximize2 size={13} />
              <span>Inspect full board</span>
            </button>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* LEFT: PORTRAIT ARTWORK COLUMN (~50% width, natural 2:3 ratio, NO black side bars) */}
            <div className="lg:col-span-6 flex flex-col items-center">
              <div
                onClick={() =>
                  setLightbox({
                    src: "/projects/brand-identity/velora-skincare-identity.png",
                    alt: "Vélora botanical skincare wellness board",
                    title: "Vélora — Botanical Skincare Presentation Board",
                    aspect: "aspect-[2/3]",
                  })
                }
                className="relative w-full max-w-[480px] aspect-[2/3] rounded-2xl overflow-hidden border border-[#3F523B]/40 shadow-2xl bg-[#0D140F] group cursor-pointer"
              >
                <Image
                  src="/projects/brand-identity/velora-skincare-identity.png"
                  alt="Vélora botanical skincare wellness board — dropper bottles, mineral cream tones, leaf moodboard"
                  fill
                  sizes="(max-width: 1024px) 100vw, 520px"
                  className="object-cover object-center transition-all duration-500 will-change-transform group-hover:scale-[1.01]"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-black/60 backdrop-blur-sm font-mono text-[10px] text-white/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  <Maximize2 size={11} /> Click to zoom
                </div>
              </div>
              <span className="font-mono text-[11px] text-[#A7B89F]/75 mt-2.5 text-center">
                02C.1 // Presentation Board: Recycled amber bottles, mineral packaging, and botanical dielines.
              </span>
            </div>

            {/* RIGHT: COMPLEMENTARY INFORMATION & PALETTE */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div>
                <span className="font-mono text-xs text-[#A7B89F] uppercase tracking-wider block mb-1">
                  Botanical Identity Formulation
                </span>
                <h4 className="font-cubao text-2xl sm:text-3xl text-white uppercase tracking-tight">
                  Mindful Daily Rituals
                </h4>
                <p className="font-sans text-xs sm:text-sm text-[#C2D0BE] mt-2 leading-relaxed">
                  Clean typographic hierarchy with ample white space. Screen-printed amber glass bottles eliminate paper label waste, paired with soft sage cartons made from post-consumer recycled fiber.
                </p>
              </div>

              {/* PALETTE WITH CLICK-TO-COPY */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 font-mono text-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#A7B89F] font-semibold uppercase tracking-wider text-[11px]">
                    Botanical Skincare Palette:
                  </span>
                  <span className="text-[10px] text-white/50">Tap to copy</span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {veloraSkincareColors.map((c) => (
                    <button
                      key={c.hex}
                      onClick={() => copyColor(c.hex)}
                      title={`Copy ${c.name} (${c.hex})`}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold flex items-center gap-1 transition-transform active:scale-95 shadow-sm border border-black/20 ${c.bg} ${c.text}`}
                    >
                      <span>{c.name}</span>
                      <span className="opacity-75">{c.hex}</span>
                      {activeCopied === c.hex && <Check size={10} className="text-emerald-300" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* SUSTAINABILITY SPECS */}
              <div className="pt-3 border-t border-white/10 space-y-2 font-mono text-xs text-[#C2D0BE]">
                <div className="flex justify-between items-center py-1 border-b border-white/5">
                  <span className="text-white/60">Vessel</span>
                  <span className="text-[#EDE7DD]">100% Recycled Amber Glass</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-white/5">
                  <span className="text-white/60">Outer Pack</span>
                  <span className="text-[#EDE7DD]">FSC Certified Unbleached Board</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-white/60">Typography</span>
                  <span className="text-[#A7B89F]">Fraunces Display &amp; Inter Sans</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            02D: NEXA — BRAND IDENTITY & PACKAGING SYSTEM (Restored Packaging Composition)
            Left: Title, specs, 4 nutrition callouts & series details
            Right: Tall packaging artwork commanding the right side with ZERO black borders
            ========================================================================= */}
        <section
          ref={nexaRef}
          id="showcase-nexa"
          className="w-full rounded-2xl sm:rounded-3xl bg-[#0B0D10] border border-[#B4F000]/25 p-4 sm:p-8 lg:p-12 shadow-2xl relative overflow-hidden my-auto scroll-mt-[calc(var(--nav-height,64px)+1rem)]"
          aria-label="NEXA High-Performance Brand Identity and Packaging"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* LEFT COLUMN: TITLE, SPECS, NUTRITION CALLOUTS & SUB-NAVIGATION */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6 order-2 lg:order-1">
              <div>
                <div className="flex items-center gap-2 mb-2 font-mono text-xs uppercase tracking-widest text-[#B4F000]">
                  <span className="w-2 h-2 rounded-full bg-[#B4F000] animate-pulse" />
                  <span>02D / PERFORMANCE BRAND SYSTEM &amp; SOCIAL</span>
                </div>
                <h3 className="font-cubao text-3xl sm:text-4xl lg:text-5xl text-white uppercase tracking-tight leading-tight">
                  NEXA — Fuel Your Next Level
                </h3>
                <p className="font-mono text-xs text-[#B4F000] mt-1.5 uppercase tracking-wider font-semibold">
                  High Performance Whey Isolate · 1kg Matte Black Tub
                </p>
                <p className="font-sans text-sm sm:text-base text-[#A0A4B0] mt-3 leading-relaxed">
                  Aggressive, clinical performance branding for elite athletics. Engineered with tactile soft-touch matte black jars, embossed gloss lid typography, and high-visibility neon lime structural slashes.
                </p>
              </div>

              {/* 4 NUTRITION CALLOUT TILES (2x2 Grid) */}
              <div className="grid grid-cols-2 gap-3 font-mono text-xs" aria-label="NEXA Nutrition Profile">
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-center flex flex-col items-center justify-center">
                  <span className="block text-2xl font-cubao text-[#B4F000]">24g</span>
                  <span className="text-[10px] text-white/70 uppercase tracking-wider mt-0.5">Protein / Serve</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-center flex flex-col items-center justify-center">
                  <span className="block text-2xl font-cubao text-[#B4F000]">5.5g</span>
                  <span className="text-[10px] text-white/70 uppercase tracking-wider mt-0.5">BCAAs</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-center flex flex-col items-center justify-center">
                  <span className="block text-2xl font-cubao text-[#B4F000]">4g</span>
                  <span className="text-[10px] text-white/70 uppercase tracking-wider mt-0.5">Glutamine</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-center flex flex-col items-center justify-center">
                  <span className="block text-2xl font-cubao text-[#B4F000]">0g</span>
                  <span className="text-[10px] text-white/70 uppercase tracking-wider mt-0.5">Added Sugar</span>
                </div>
              </div>

              {/* BOTTOM DETAILS & SUB-NAVIGATION */}
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
                <span className="text-white/80">Packaging System &amp; Shaker Bottle</span>
                <span className="text-[#B4F000] font-semibold">Chocolate Flavour Series</span>
              </div>

              {/* BRAND COLOR TOKENS */}
              <div className="pt-3 border-t border-white/10 font-mono text-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#B4F000] font-semibold uppercase tracking-wider text-[11px]">
                    Brand Tokens:
                  </span>
                  <span className="text-[10px] text-white/50">Tap to copy</span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {nexaColors.map((c) => (
                    <button
                      key={c.hex}
                      onClick={() => copyColor(c.hex)}
                      title={`Copy ${c.name} (${c.hex})`}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold flex items-center gap-1 transition-transform active:scale-95 shadow-sm border border-black/20 ${c.bg} ${c.text}`}
                    >
                      <span>{c.name}</span>
                      <span className="opacity-75">{c.hex}</span>
                      {activeCopied === c.hex && <Check size={10} className="text-emerald-300" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: TALL PACKAGING ARTWORK COMMANDING RIGHT SIDE (Natural 2:3 ratio, snug fit, zero black borders, artwork first on mobile) */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center order-1 lg:order-2">
              <div
                onClick={() =>
                  setLightbox({
                    src: "/projects/packaging/nexa-protein-packaging.png",
                    alt: "NEXA High-Performance Brand Identity and Social Campaign",
                    title: "NEXA — Brand Identity & Social Suite",
                    aspect: "aspect-[2/3]",
                  })
                }
                className="relative w-full max-w-[440px] aspect-[2/3] rounded-2xl overflow-hidden border border-[#B4F000]/35 shadow-[0_25px_60px_rgba(0,0,0,0.85)] bg-[#08090C] group cursor-pointer"
              >
                <Image
                  src="/projects/packaging/nexa-protein-packaging.png"
                  alt="NEXA High-Performance Brand Identity and Social Campaign — wordmark, athlete campaign creative, 1kg tub, shaker bottle, and social post suite"
                  fill
                  sizes="(max-width: 1024px) 100vw, 480px"
                  className="object-cover object-center transition-all duration-500 will-change-transform group-hover:scale-[1.01]"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-black/60 backdrop-blur-sm font-mono text-[10px] text-white/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  <Maximize2 size={11} /> Click to zoom
                </div>
              </div>
              <span className="font-mono text-[11px] text-[#B4F000]/75 mt-2.5 text-center">
                02D.1 // Master System Spread: Wordmark, athlete campaign, matte tub, shaker bottle, and social grid.
              </span>
            </div>
          </div>
        </section>

        {/* TRANSITION CUE INTO CHAPTER 03: UI/UX DESIGN */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-white/60">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#4E77B5]" />
            <span>Next Discipline: Digital Product &amp; Healthcare Systems</span>
          </div>
          <a
            href="#intro-uiux"
            className="inline-flex items-center gap-2 text-[#819845] hover:text-white transition-colors"
          >
            <span>Scroll into 03 / UI/UX Design (CareConnect)</span>
            <ArrowDown size={14} className="animate-bounce" />
          </a>
        </div>
      </div>

      {/* =========================================================================
          ACCESSIBLE ENLARGED LIGHTBOX MODAL FOR DENSE PRESENTATION BOARDS
          ========================================================================= */}
      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.title}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-fade-in"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative w-full max-w-5xl max-h-[90vh] flex flex-col items-center bg-[#0C120E] border border-white/20 rounded-2xl p-4 sm:p-6 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with Title and Close Button */}
            <div className="w-full flex items-center justify-between pb-3 mb-3 border-b border-white/10 font-mono text-xs text-white/80 shrink-0">
              <span className="font-semibold text-white tracking-wider">{lightbox.title}</span>
              <button
                type="button"
                onClick={() => setLightbox(null)}
                aria-label="Close enlarged view"
                className="w-11 h-11 min-h-[44px] min-w-[44px] rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* High-Resolution Presentation Board Image */}
            <div className={`relative w-full max-h-[75vh] ${lightbox.aspect} rounded-xl overflow-hidden bg-black/60`}>
              <Image
                src={lightbox.src}
                alt={lightbox.alt}
                fill
                sizes="(max-width: 1440px) 95vw, 1200px"
                className="object-contain object-center"
                priority
              />
            </div>

            <p className="mt-3 font-mono text-[11px] text-white/50 text-center">
              Press Escape or click outside to dismiss.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
