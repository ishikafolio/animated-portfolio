"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, CheckCircle2, ChevronRight, Eye, Sparkles } from "lucide-react";
import { projects } from "@/lib/projects";
import Badge from "@/components/shared/Badge";
import ChapterIntro from "./ChapterIntro";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const PROGELATO_FLAVOURS = [
  { name: "Blueberry Muffin", color: "#4B4278", tagline: "Berry Muffin Delight", macro: "18g Protein · No Added Sugar" },
  { name: "Butterly Crunch", color: "#A86D37", tagline: "Buttery Crunch Delight", macro: "18g Protein · Prebiotic Fiber" },
  { name: "Chocolicious", color: "#543026", tagline: "Rich Cocoa Taste", macro: "18g Protein · Brain-Health DHA" },
  { name: "Cookieej 'N' Cream", color: "#243E63", tagline: "Cookie Cream Delight", macro: "18g Protein · Zero Gluten" },
  { name: "Creamy Strawberry", color: "#8C1D40", tagline: "Real Fruit Goodness", macro: "18g Protein · Antioxidant Rich" },
  { name: "Mastana Mango", color: "#C86A18", tagline: "Tropical Mango Delight", macro: "18g Protein · 100% Real Alphonso" },
  { name: "Shahi Zaffran Pista", color: "#617A38", tagline: "Zaffran Pista Delight", macro: "18g Protein · Real Saffron & Pistachio" },
];

export function SelectedWorkSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeFlavourIdx, setActiveFlavourIdx] = useState(0);

  const logoFolio = projects.find((p) => p.id === "logo-folio");
  const careconnect = projects.find((p) => p.id === "careconnect");
  const progelato = projects.find((p) => p.id === "no-cheat-progelato");
  const aara = projects.find((p) => p.id === "aara");

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // Parallax on featured images
      const images = containerRef.current?.querySelectorAll(".parallax-image");
      images?.forEach((img) => {
        gsap.fromTo(
          img,
          { yPercent: -3 },
          {
            yPercent: 3,
            ease: "none",
            scrollTrigger: {
              trigger: img,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.5,
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} id="work" className="relative bg-[#F3F3E7]">
      
      {/* =========================================================================
          CHAPTER 01: LOGO DESIGN & BRAND IDENTITY
         ========================================================================= */}
      <ChapterIntro
        id="intro-logo"
        chapterNumber="01"
        category="Logo Design & Brand Identity"
        title="LOGO FOLIO"
        subtitle="Six Brands. Six Stories. Six Unique Identities. An immersive brand exhibition exploring typography, symbols, and distinct market aesthetics."
        type="logo"
        targetId="showcase-logo"
      />

      {/* Category 01 Showcase: Dark Velvet Brand Exhibition */}
      <section
        id="showcase-logo"
        className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#180C14] text-[#F3F3E7] relative z-10"
        aria-label="Category 01: Logo Folio Exhibition"
      >
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-white/10">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-full bg-[#890149] text-white">
                  01
                </span>
                <span className="text-xs uppercase tracking-widest text-[#890149] font-bold">
                  Brand Identity Exhibition
                </span>
              </div>
              <h3 className="font-display text-4xl sm:text-6xl lg:text-7xl uppercase tracking-tight text-white leading-tight">
                Six Brand Identities
              </h3>
            </div>
            <div className="max-w-md">
              <p className="text-sm sm:text-base text-white/70 font-light leading-relaxed">
                Self-initiated visual study examining custom typography, brand psychology, and expressive iconography across six diverse industries.
              </p>
            </div>
          </div>

          {/* Master Panoramic Presentation Board */}
          {logoFolio && (
            <div className="mt-12 rounded-3xl bg-white/5 border border-white/15 p-6 sm:p-10 lg:p-12 backdrop-blur-sm">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-widest text-[#890149] font-semibold block mb-2">
                      Master Concept Board
                    </span>
                    <h4 className="font-display text-3xl sm:text-4xl uppercase text-white mb-4">
                      {logoFolio.title}
                    </h4>
                    <p className="text-sm text-white/80 leading-relaxed font-light mb-6">
                      {logoFolio.summary}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-mono text-white/80">
                        AI-Assisted Concept
                      </span>
                      <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-mono text-white/80">
                        6 Complete Brands
                      </span>
                      <span className="px-3 py-1 rounded-full bg-[#890149]/40 text-xs font-mono text-white">
                        2026 Collection
                      </span>
                    </div>

                    <div>
                      <Link
                        href={logoFolio.route}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#890149] text-[#F3F3E7] text-xs sm:text-sm font-semibold uppercase tracking-wider hover:bg-[#6B0139] transition-all active:scale-95 shadow-md"
                      >
                        <span>Explore 6 Brand Concepts</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7">
                  <Link
                    href={logoFolio.route}
                    aria-label="View Logo Folio case study"
                    className="group block relative aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden bg-[#24121B] border border-white/10"
                  >
                    <Image
                      src={logoFolio.coverImage}
                      alt={logoFolio.coverAlt}
                      fill
                      className="parallax-image object-contain p-2 sm:p-4 group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 1024px) 100vw, 60vw"
                    />
                  </Link>
                </div>
              </div>

              {/* Interactive 6-Brand Exhibition Grid */}
              <div className="mt-12 pt-10 border-t border-white/10">
                <span className="font-mono text-xs uppercase tracking-widest text-white/50 block mb-6 font-semibold">
                  Featured Brand Identities · Click Any To Open Deep Dive
                </span>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {logoFolio.brands?.map((brand) => (
                    <Link
                      key={brand.slug}
                      href={logoFolio.route}
                      className="group p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#890149] hover:bg-white/10 transition-all duration-300 flex flex-col justify-between"
                    >
                      <div className="aspect-square relative rounded-xl overflow-hidden mb-3 bg-black/40">
                        <Image
                          src={brand.heroImage}
                          alt={`${brand.name} preview`}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div>
                        <span className="font-display text-lg uppercase tracking-tight text-white group-hover:text-[#890149] transition-colors block">
                          {brand.name}
                        </span>
                        <span className="text-[11px] font-mono text-white/50 block truncate">
                          {brand.category}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          CHAPTER 02: UI/UX DESIGN & PRODUCT SYSTEMS
         ========================================================================= */}
      <ChapterIntro
        id="intro-uiux"
        chapterNumber="02"
        category="UI/UX & Mobile Product Systems"
        title="UI / UX DESIGN"
        subtitle="Human-first health interface architecture with dual-flow care coordination. Ten cohesive screens balancing parent clarity with caregiver peace of mind."
        type="uiux"
        targetId="showcase-uiux"
      />

      {/* Category 02 Showcase: Soft Lavender Mobile Studio */}
      <section
        id="showcase-uiux"
        className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#F9F7FD] border-t border-[#24121B]/15 relative z-10"
        aria-label="Category 02: CareConnect UI/UX Case Study"
      >
        <div className="max-w-7xl mx-auto">
          {careconnect && (
            <div className="rounded-3xl bg-white border border-[#24121B]/10 p-8 sm:p-12 lg:p-16 shadow-card">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                {/* Left Column: Dual-Flow Architecture Narrative */}
                <div className="lg:col-span-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-full bg-[#890149] text-white">
                        02
                      </span>
                      <span className="text-xs font-mono uppercase tracking-widest text-[#890149] font-bold">
                        {careconnect.discipline}
                      </span>
                    </div>

                    <h3 className="font-display text-4xl sm:text-5xl lg:text-6xl uppercase tracking-tight text-[#24121B] mt-2 mb-4 leading-tight">
                      {careconnect.title}
                    </h3>
                    <p className="font-medium text-lg text-[#5146A6] mb-4">
                      {careconnect.subtitle}
                    </p>
                    <p className="text-sm sm:text-base text-[#24121B]/80 font-light leading-relaxed mb-6">
                      {careconnect.summary}
                    </p>

                    {/* Dual Flow Pill Highlights */}
                    <div className="space-y-3 mb-8">
                      <div className="p-3.5 rounded-2xl bg-[#EFECFA] border border-[#5146A6]/20 flex items-start gap-3">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#5146A6] text-white">
                          Flow A
                        </span>
                        <div>
                          <span className="text-xs font-bold text-[#25304A] block">
                            Parent Flow (Screens 01–06)
                          </span>
                          <span className="text-xs text-[#25304A]/70">
                            High-contrast medication reminders, simplified SOS assistance, and daily health check-ins.
                          </span>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#24121B]/10 flex items-start gap-3">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#25304A] text-white">
                          Flow B
                        </span>
                        <div>
                          <span className="text-xs font-bold text-[#24121B] block">
                            Caregiver Flow (Screens 07–10)
                          </span>
                          <span className="text-xs text-[#24121B]/70">
                            Remote medication adherence oversight, emergency contact routing, and permission-based updates.
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Palette and Font Tags */}
                    <div className="flex flex-wrap gap-2 mb-8">
                      <span className="px-3 py-1 rounded-full bg-[#5146A6] text-xs font-medium text-white">
                        #5146A6 Iris
                      </span>
                      <span className="px-3 py-1 rounded-full bg-[#25304A] text-xs font-medium text-white">
                        #25304A Navy
                      </span>
                      <span className="px-3 py-1 rounded-full bg-[#EFECFA] text-xs font-medium text-[#5146A6] border border-[#5146A6]/30">
                        Atkinson Hyperlegible
                      </span>
                    </div>
                  </div>

                  <div>
                    <Link
                      href={careconnect.route}
                      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#5146A6] text-white text-xs sm:text-sm font-semibold uppercase tracking-wider hover:bg-[#3E3486] transition-all shadow-md active:scale-95"
                    >
                      <span>View 10-Screen UI/UX Case Study</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Right Column: Tilted Interactive Smartphone Mockup */}
                <div className="lg:col-span-7">
                  <Link
                    href={careconnect.route}
                    aria-label="View CareConnect mobile UI/UX case study"
                    className="group block relative aspect-[4/3] rounded-3xl overflow-hidden bg-gradient-to-br from-[#EFECFA] to-[#FAF8F5] border border-[#5146A6]/20 p-6 sm:p-10 shadow-inner"
                  >
                    <Image
                      src={careconnect.coverImage}
                      alt={careconnect.coverAlt}
                      fill
                      className="parallax-image object-contain p-4 group-hover:scale-105 group-hover:-rotate-1 transition-transform duration-700 drop-shadow-2xl"
                      sizes="(max-width: 1024px) 100vw, 60vw"
                    />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          CHAPTER 03: PACKAGING DESIGN & PRODUCT VISUALS
         ========================================================================= */}
      <ChapterIntro
        id="intro-packaging"
        chapterNumber="03"
        category="Packaging Design & Tactile Systems"
        title="PACKAGING"
        subtitle="Tactile shelf presence, seven-flavour differentiation, and botanical tea storytelling. From commercial protein gelato to calming organic tea rituals."
        type="packaging"
        targetId="showcase-packaging"
      />

      {/* Category 03 Showcase: Progelato Commercial Studio + Aara Botanical Storytelling */}
      <section
        id="showcase-packaging"
        className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#FAF8F5] border-t border-[#24121B]/15 relative z-10"
        aria-label="Category 03: Packaging Design"
      >
        <div className="max-w-7xl mx-auto space-y-24">
          
          {/* 03A: No Cheat Progelato Commercial Campaign */}
          {progelato && (
            <div className="rounded-3xl bg-white border border-[#24121B]/10 p-8 sm:p-12 lg:p-16 shadow-card">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                <div className="lg:col-span-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-[#890149] text-white">
                        03A
                      </span>
                      <span className="text-xs font-mono uppercase tracking-widest text-[#890149] font-semibold">
                        {progelato.discipline}
                      </span>
                    </div>

                    <h3 className="font-display text-4xl sm:text-5xl lg:text-6xl uppercase tracking-tight text-[#24121B] mt-2 mb-4 leading-tight">
                      {progelato.title}
                    </h3>
                    <p className="font-medium text-lg text-[#890149] mb-4">
                      {progelato.subtitle}
                    </p>
                    <p className="text-sm text-[#24121B]/75 leading-relaxed font-light mb-6">
                      {progelato.summary}
                    </p>

                    {/* Macro Nutrition Badges */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="px-3 py-1 rounded-full bg-[#890149]/10 text-xs font-medium text-[#890149]">
                        18g Protein
                      </span>
                      <span className="px-3 py-1 rounded-full bg-[#24121B]/5 text-xs font-medium text-[#24121B]">
                        No Added Sugar
                      </span>
                      <span className="px-3 py-1 rounded-full bg-[#24121B]/5 text-xs font-medium text-[#24121B]">
                        Prebiotics & DHA
                      </span>
                    </div>
                  </div>

                  <div>
                    <Link
                      href={progelato.route}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#890149] text-[#F3F3E7] text-xs sm:text-sm font-semibold uppercase tracking-wider hover:bg-[#6B0139] transition-all shadow-md active:scale-95"
                    >
                      <span>{progelato.ctaText}</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                <div className="lg:col-span-7">
                  <Link
                    href={progelato.route}
                    aria-label="View No Cheat Progelato packaging case study"
                    className="group block relative aspect-[16/10] rounded-2xl overflow-hidden bg-[#F3F3E7] border border-[#24121B]/10"
                  >
                    <Image
                      src={progelato.coverImage}
                      alt={progelato.coverAlt}
                      fill
                      className="parallax-image object-contain p-2 sm:p-4 group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 1024px) 100vw, 60vw"
                    />
                  </Link>
                </div>
              </div>

              {/* Interactive 7-Flavor Palette Navigator */}
              <div className="mt-12 pt-10 border-t border-[#24121B]/10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <span className="font-mono text-xs uppercase tracking-widest text-[#24121B]/60 font-semibold">
                    Interactive 7-Flavor Palette Navigator · Tap to Inspect
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#890149]">
                      {PROGELATO_FLAVOURS[activeFlavourIdx].tagline}
                    </span>
                    <span className="text-xs font-mono text-[#24121B]/40">
                      ({PROGELATO_FLAVOURS[activeFlavourIdx].macro})
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {PROGELATO_FLAVOURS.map((flv, idx) => (
                    <button
                      key={flv.name}
                      type="button"
                      onClick={() => setActiveFlavourIdx(idx)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all duration-300 ${
                        activeFlavourIdx === idx
                          ? "text-white ring-2 ring-[#890149] ring-offset-2 scale-105 shadow-md"
                          : "text-white/90 hover:opacity-100 opacity-80"
                      }`}
                      style={{ backgroundColor: flv.color }}
                    >
                      <span className="w-2 h-2 rounded-full bg-white" />
                      <span>{flv.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Hairline Botanical Divider */}
          <div className="relative py-4 flex items-center justify-center">
            <hr className="w-full border-t border-[#1E3A2B]/20" />
            <span className="absolute px-5 py-1 rounded-full bg-[#1E3A2B] text-white text-xs font-mono uppercase tracking-widest shadow-sm">
              Packaging Continuation · Botanical Ritual
            </span>
          </div>

          {/* 03B: Aara — Tea & Stillness Botanical Storytelling */}
          {aara && (
            <div className="rounded-3xl bg-[#FAF7F0] border-2 border-[#1E3A2B]/20 p-8 sm:p-12 lg:p-16 shadow-card">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                <div className="lg:col-span-7 order-2 lg:order-1">
                  <Link
                    href={aara.route}
                    aria-label="View Aara Tea and Stillness packaging case study"
                    className="group block relative aspect-[16/10] rounded-2xl overflow-hidden bg-[#F5EFEB] border border-[#1E3A2B]/15"
                  >
                    <Image
                      src={aara.coverImage}
                      alt={aara.coverAlt}
                      fill
                      className="parallax-image object-contain p-2 sm:p-4 group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 1024px) 100vw, 60vw"
                    />
                  </Link>
                </div>

                <div className="lg:col-span-5 order-1 lg:order-2">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-[#1E3A2B] text-white">
                      03B
                    </span>
                    <span className="text-xs font-mono uppercase tracking-widest text-[#1E3A2B] font-semibold">
                      {aara.discipline}
                    </span>
                  </div>

                  <h3 className="font-display text-4xl sm:text-5xl lg:text-6xl uppercase tracking-tight text-[#24121B] mt-2 mb-4 leading-tight">
                    {aara.title}
                  </h3>
                  <p className="font-medium text-lg text-[#1E3A2B] mb-4">
                    {aara.subtitle}
                  </p>
                  <p className="text-sm text-[#24121B]/75 leading-relaxed font-light mb-6">
                    {aara.summary}
                  </p>

                  {/* Earthy Botanical Palette */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    <span className="px-3 py-1 rounded-full bg-[#1E3A2B] text-xs font-medium text-white">
                      #1E3A2B Forest
                    </span>
                    <span className="px-3 py-1 rounded-full bg-[#5C6B47] text-xs font-medium text-white">
                      #5C6B47 Olive
                    </span>
                    <span className="px-3 py-1 rounded-full bg-[#F5EFEB] text-xs font-medium text-[#24121B] border border-black/10">
                      Warm Parchment
                    </span>
                  </div>

                  <div>
                    <Link
                      href={aara.route}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1E3A2B] text-white text-xs sm:text-sm font-semibold uppercase tracking-wider hover:bg-[#13251C] transition-all shadow-md active:scale-95"
                    >
                      <span>Explore Aara Tea Ritual</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </section>

    </div>
  );
}

export default SelectedWorkSection;
