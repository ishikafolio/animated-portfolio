"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSiteExperience } from "@/components/studio/SiteExperience";
import progelatoData from "../../../content/progelato.json";
import AaraRitual from "@/components/studio/AaraRitual";
import PackagingExtensions from "@/components/studio/PackagingExtensions";
import { ArrowDown, ArrowUpRight } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function PackagingChapter() {
  const { reducedMotion } = useSiteExperience();

  // Progelato Shelf Interactive State
  const [flavourIndex, setFlavourIndex] = useState(0);
  const [view, setView] = useState<"mockup" | "artwork">("mockup");
  const currentFlavour = progelatoData.flavours[flavourIndex];

  // 03A: Progelato & Shared Hero Animation Refs
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const heroWrapperRef = useRef<HTMLDivElement>(null);
  const heroSceneRef = useRef<HTMLDivElement>(null);
  const heroHeadingDesktopRef = useRef<HTMLDivElement>(null);
  const heroHeadingMobileRef = useRef<HTMLDivElement>(null);
  const heroLinksRef = useRef<HTMLDivElement>(null);
  const progelatoExplorerRef = useRef<HTMLDivElement>(null);

  // 03B: Aara Showcase Animation Refs
  const aaraShowcaseRef = useRef<HTMLElement>(null);
  const aaraBlendRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion) {
      // Clear all stale inline transforms and opacities when Pause Motion is toggled
      const targets = [
        heroWrapperRef.current,
        heroSceneRef.current,
        heroHeadingDesktopRef.current,
        heroHeadingMobileRef.current,
        heroLinksRef.current,
        progelatoExplorerRef.current,
        aaraShowcaseRef.current,
        aaraBlendRef.current,
      ];
      targets.forEach((el) => {
        if (el) gsap.set(el, { clearProps: "all" });
      });
      if (aaraShowcaseRef.current) {
        const subTargets = aaraShowcaseRef.current.querySelectorAll(
          ".ritual-stage, .ritual-header-wrap, #ritual-title, .font-mono, .ritual-options button"
        );
        subTargets.forEach((el) => gsap.set(el, { clearProps: "all" }));
      }
      return;
    }

    if (!wrapperRef.current || !stageRef.current) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // =========================================================================
      // DESKTOP: Synchronized Choreographed Sequences
      // =========================================================================
      mm.add("(min-width: 1024px)", () => {
        // -----------------------------------------------------------------
        // TIMELINE 1: SHARED HERO -> 03A PROGELATO ENTRANCE
        // -----------------------------------------------------------------
        const progelatoTl = gsap.timeline({
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

        // Phase 1: Slow upward movement and controlled zoom revealing shared podium hero
        if (heroWrapperRef.current) {
          progelatoTl.fromTo(
            heroWrapperRef.current,
            { y: 35, scale: 0.98, opacity: 0.8 },
            { y: 0, scale: 1.07, opacity: 1, ease: "power2.out", duration: 0.3 },
            0
          );
        }
        progelatoTl.to({}, { duration: 0.15 }, 0.15); // Hold steady

        // Phase 2: 30% -> 65% (Gentle push toward the left Progelato plum podium)
        if (heroHeadingDesktopRef.current) {
          progelatoTl.to(
            heroHeadingDesktopRef.current,
            { y: -30, opacity: 0, ease: "power2.inOut", duration: 0.25 },
            0.3
          );
        }
        if (heroSceneRef.current) {
          progelatoTl.to(
            heroSceneRef.current,
            {
              scale: 1.5,
              x: "18vw",
              y: "-2vh",
              opacity: 0.2,
              filter: "blur(4px)",
              ease: "power2.inOut",
              duration: 0.35,
            },
            0.3
          );
        }
        if (heroLinksRef.current) {
          progelatoTl.to(
            heroLinksRef.current,
            { opacity: 0, pointerEvents: "none", ease: "power2.inOut", duration: 0.2 },
            0.35
          );
        }

        // Phase 3: 60% -> 100% (Progelato Shelf Explorer emerges)
        if (progelatoExplorerRef.current) {
          progelatoTl.fromTo(
            progelatoExplorerRef.current,
            { y: 50, opacity: 0, scale: 0.95 },
            { y: 0, opacity: 1, scale: 1.0, ease: "power2.out", duration: 0.35 },
            0.6
          );
        }

        // -----------------------------------------------------------------
        // 03B AARA SHOWCASE DIRECT SCROLL TRANSITION (DESKTOP)
        // Background blends into forest green, heading & artwork gently rise
        // -----------------------------------------------------------------
        if (aaraShowcaseRef.current) {
          // Gradual background blend into Aara forest green
          gsap.fromTo(
            aaraShowcaseRef.current,
            { backgroundColor: "#0e1811" },
            {
              backgroundColor: "#122219",
              ease: "power1.out",
              scrollTrigger: {
                trigger: aaraShowcaseRef.current,
                start: "top 95%",
                end: "top 40%",
                scrub: 0.5,
              },
            }
          );

          if (aaraBlendRef.current) {
            gsap.fromTo(
              aaraBlendRef.current,
              { opacity: 0.9 },
              {
                opacity: 0.15,
                ease: "power1.out",
                scrollTrigger: {
                  trigger: aaraShowcaseRef.current,
                  start: "top 95%",
                  end: "top 40%",
                  scrub: 0.5,
                },
              }
            );
          }

          // Aara heading moves upward by a small amount as it enters viewport (readable throughout)
          const heading = aaraShowcaseRef.current.querySelector(".ritual-header-wrap");
          if (heading) {
            gsap.fromTo(
              heading,
              { y: 32, opacity: 0.88 },
              {
                y: 0,
                opacity: 1,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: aaraShowcaseRef.current,
                  start: "top 85%",
                  end: "top 45%",
                  scrub: 0.5,
                },
              }
            );
          }

          // Aara artwork stage moves upward by a small amount into place
          const artwork = aaraShowcaseRef.current.querySelectorAll(".ritual-stage");
          if (artwork.length > 0) {
            gsap.fromTo(
              artwork,
              { y: 40, opacity: 0.88 },
              {
                y: 0,
                opacity: 1,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: aaraShowcaseRef.current,
                  start: "top 85%",
                  end: "top 45%",
                  scrub: 0.5,
                },
              }
            );
          }
        }
      });

      // =========================================================================
      // MOBILE: Gentle, Unpinned Scroll Transitions (Native Touch Scrolling)
      // Dedicated aperture reveal for Stage 1 (Podium Hero) and smooth transitions into Progelato & Aara
      // =========================================================================
      mm.add("(max-width: 1023px)", () => {
        const mobileHeroTl = gsap.timeline({
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 80%",
            end: "top 25%",
            scrub: 0.6,
          },
        });

        if (heroHeadingMobileRef.current) {
          mobileHeroTl.fromTo(
            heroHeadingMobileRef.current,
            { y: 25, opacity: 0.25 },
            { y: 0, opacity: 1, ease: "power2.out", duration: 0.3 },
            0
          );
        }

        if (heroSceneRef.current) {
          mobileHeroTl.fromTo(
            heroSceneRef.current,
            { clipPath: "circle(34% at 50% 50%)", scale: 0.96 },
            { clipPath: "circle(76% at 50% 50%)", scale: 1.0, ease: "power2.out", duration: 0.5 },
            0.05
          );
        }

        if (heroLinksRef.current) {
          mobileHeroTl.fromTo(
            heroLinksRef.current,
            { y: 20, opacity: 0.4 },
            { y: 0, opacity: 1, ease: "power2.out", duration: 0.3 },
            0.15
          );
        }

        if (progelatoExplorerRef.current) {
          gsap.fromTo(
            progelatoExplorerRef.current,
            { y: 35, opacity: 0.65 },
            {
              y: 0,
              opacity: 1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: progelatoExplorerRef.current,
                start: "top 85%",
                end: "top 40%",
                scrub: 0.6,
              },
            }
          );
        }

        // -----------------------------------------------------------------
        // 03B AARA SHOWCASE DIRECT SCROLL TRANSITION (MOBILE)
        // Background blend, header and arched frame reveal
        // -----------------------------------------------------------------
        if (aaraShowcaseRef.current) {
          gsap.fromTo(
            aaraShowcaseRef.current,
            { backgroundColor: "#0e1811" },
            {
              backgroundColor: "#122219",
              ease: "power1.out",
              scrollTrigger: {
                trigger: aaraShowcaseRef.current,
                start: "top 95%",
                end: "top 50%",
                scrub: 0.5,
              },
            }
          );

          if (aaraBlendRef.current) {
            gsap.fromTo(
              aaraBlendRef.current,
              { opacity: 0.9 },
              {
                opacity: 0.15,
                ease: "power1.out",
                scrollTrigger: {
                  trigger: aaraShowcaseRef.current,
                  start: "top 95%",
                  end: "top 50%",
                  scrub: 0.5,
                },
              }
            );
          }

          const heading = aaraShowcaseRef.current.querySelector(".ritual-header-wrap");
          if (heading) {
            gsap.fromTo(
              heading,
              { y: 25, opacity: 0.6 },
              {
                y: 0,
                opacity: 1,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: aaraShowcaseRef.current,
                  start: "top 85%",
                  end: "top 50%",
                  scrub: 0.6,
                },
              }
            );
          }

          const artwork = aaraShowcaseRef.current.querySelectorAll(".ritual-stage");
          if (artwork.length > 0) {
            gsap.fromTo(
              artwork,
              { y: 30, scale: 0.95, opacity: 0.7 },
              {
                y: 0,
                scale: 1.0,
                opacity: 1,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: aaraShowcaseRef.current,
                  start: "top 85%",
                  end: "top 50%",
                  scrub: 0.6,
                },
              }
            );
          }
        }
      });
    }, [wrapperRef, aaraShowcaseRef]);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <>
      <section
        ref={wrapperRef}
        id="packaging"
        className={`packaging-world-wrapper relative w-full ${reducedMotion ? "min-h-0 py-8" : "lg:min-h-[240vh]"} bg-[#101A12]`}
        aria-label="Chapter 03: Packaging Design — Progelato & Aara"
      >
        {/* Anchor for direct discipline navigation */}
        <div id="chapter-packaging" className="absolute -top-24 pointer-events-none scroll-mt-[var(--nav-height,64px)]" aria-hidden="true" />
      {/* =========================================================================
          STAGE 1: DUAL-PODIUM HERO & 03A PROGELATO PINNED SEQUENCE
          ========================================================================= */}
      <div
        ref={stageRef}
        className={`packaging-stage relative w-full ${reducedMotion ? "min-h-0" : "min-h-screen lg:h-screen lg:sticky lg:top-0"} lg:overflow-hidden overflow-visible flex flex-col justify-between p-4 sm:p-6 lg:p-8 text-[#F4EEE5] select-none`}
        style={{
          background:
            "radial-gradient(circle at 50% 45%, rgba(18, 30, 22, 0.95) 0%, rgba(12, 20, 14, 1) 100%)",
        }}
      >
        {/* TOP HEADER META & CHAPTER NAVIGATION */}
        <header className="relative z-30 flex items-center justify-between gap-4 pb-3 border-b border-white/10 font-mono text-[11px] sm:text-xs tracking-wider uppercase">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-black/50 backdrop-blur-md font-semibold text-[#F4EEE5]">
              <span className="w-2 h-2 rounded-full bg-[#890149] animate-pulse" />
              CHAPTER 04
            </span>
            <span className="hidden sm:inline-block text-[#F4EEE5]/90 font-medium">
              04 / PACKAGING DESIGN
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:inline-block text-white/50 text-[10px]">
              PROGELATO & AARA // 2026
            </span>
            <a
              href="#showcase-packaging"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/20 hover:border-white/60 bg-black/40 hover:bg-black/60 backdrop-blur-sm transition-all text-[#F4EEE5] text-[10px] sm:text-[11px]"
            >
              <span>Explore Exhibition</span>
              <ArrowDown size={11} aria-hidden="true" />
            </a>
          </div>
        </header>

        {/* LAYER A: CONTINUOUS FULL-WIDTH 16:9 EXHIBITION HERO */}
        <div
          ref={heroWrapperRef}
          className="relative z-20 w-full max-w-6xl mx-auto my-auto flex flex-col items-center justify-center py-2 sm:py-4"
        >
          {/* MOBILE HEADING: Positioned cleanly above image on matching dark background */}
          <div ref={heroHeadingMobileRef} className="lg:hidden flex flex-col text-left w-full mb-3 px-1">
            <div className="font-mono text-[10px] sm:text-xs tracking-[0.2em] text-[#F6D06F] uppercase mb-1 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#890149]" />
              <span>04 / SELECTED WORK</span>
            </div>

            <h2 className="font-cubao text-3xl sm:text-4xl md:text-5xl leading-tight tracking-tight uppercase text-[#F3F3E7] drop-shadow-md">
              Packaging Design
            </h2>

            <p className="font-sans text-xs sm:text-sm text-[#F4EEE5]/85 tracking-wide mt-1 font-medium">
              Made to Hold
            </p>
          </div>

          {/* 16:9 FULL-WIDTH PHOTOGRAPHIC SCENE (Three brands, one forest stage) */}
          <div
            ref={heroSceneRef}
            className="relative w-full aspect-[16/9] rounded-xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.9)] bg-[#101A12] border border-white/10 group"
            style={{ transformOrigin: "28% 54%" }}
          >
            <Image
              src="/projects/exhibition/packaging-podium-hero.png"
              alt="Packaging Design Exhibition — Three brands, one forest stage: Progelato, Aara, and Glow Bite"
              fill
              priority
              className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.01]"
              sizes="(max-width: 1024px) 100vw, 1200px"
            />

            {/* DESKTOP HEADING: In dark upper-left area aligned with left edge of Progelato podium */}
            <div
              ref={heroHeadingDesktopRef}
              className="hidden lg:flex absolute top-[5.5%] left-[6.8%] flex-col text-left max-w-md z-20 pointer-events-none"
            >
              <div className="font-mono text-xs tracking-[0.2em] text-[#F6D06F] uppercase mb-1.5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#890149]" />
                <span>04 / SELECTED WORK</span>
              </div>

              <h2 className="font-cubao text-4xl lg:text-5xl xl:text-[3.6rem] leading-none tracking-tight uppercase text-[#F3F3E7] drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
                Packaging Design
              </h2>

              <p className="font-sans text-xs sm:text-sm lg:text-[15px] text-[#F4EEE5]/85 tracking-wide mt-2 font-medium">
                Made to Hold
              </p>
            </div>
          </div>

          {/* BELOW THE IMAGE: TWO COMPACT PROJECT LINKS ALIGNED WITH PODIUMS */}
          <div
            ref={heroLinksRef}
            className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3 sm:mt-4 font-mono text-xs px-1"
          >
            {/* Left Link: Aligned with Progelato plum podium */}
            <div className="flex justify-start sm:pl-[6.8%]">
              <a
                href="#showcase-packaging"
                className="w-full sm:w-auto inline-flex items-center justify-between sm:justify-start gap-2.5 px-4 py-2.5 min-h-[46px] rounded-xl bg-[#24121B]/95 hover:bg-[#341827] border border-[#E6ADC7]/40 hover:border-[#E6ADC7] backdrop-blur-md transition-all text-[#F4EEE5] group cursor-pointer shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#890149] group-hover:scale-125 transition-transform shrink-0 shadow-[0_0_8px_rgba(137,1,73,0.8)]" />
                  <span className="font-semibold text-[#F6D06F]">03A</span>
                  <span className="text-[#F4EEE5] font-medium underline underline-offset-4 decoration-[#F6D06F]/60 group-hover:decoration-white transition-all">
                    No Cheat Progelato
                  </span>
                </div>
                <ArrowUpRight size={15} className="text-[#F6D06F] group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 ml-1" />
              </a>
            </div>

            {/* Right Link: Aligned with Aara limestone podium */}
            <div className="flex justify-start sm:justify-end sm:pr-[6%]">
              <a
                href="#showcase-aara"
                className="w-full sm:w-auto inline-flex items-center justify-between sm:justify-start gap-2.5 px-4 py-2.5 min-h-[46px] rounded-xl bg-[#132318]/95 hover:bg-[#1A3121] border border-[#8EB897]/50 hover:border-[#8EB897] backdrop-blur-md transition-all text-[#F4EEE5] group cursor-pointer shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#8EB897] group-hover:scale-125 transition-transform shrink-0 shadow-[0_0_8px_rgba(142,184,151,0.8)]" />
                  <span className="font-semibold text-[#8EB897]">03B</span>
                  <span className="text-[#F4EEE5] font-medium underline underline-offset-4 decoration-[#8EB897]/70 group-hover:decoration-white transition-all">
                    Aara — Tea & Stillness
                  </span>
                </div>
                <ArrowUpRight size={15} className="text-[#8EB897] group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 ml-1" />
              </a>
            </div>
          </div>
        </div>

        {/* LAYER B: INTERACTIVE PROGELATO SHELF EXPLORER (Reveals on push) */}
        <div
          ref={progelatoExplorerRef}
          id="showcase-packaging"
          className={`relative ${reducedMotion ? "mt-8" : "lg:absolute lg:inset-x-0 lg:top-14 lg:bottom-12"} z-20 flex flex-col lg:flex-row items-center justify-center w-full max-w-6xl mx-auto gap-6 lg:gap-10 px-4 my-auto pointer-events-auto`}
        >
          {/* LEFT: REUSABLE PROGELATO PODIUM STAGE WITH DYNAMIC POUCH CROSSFADE */}
          <div className="relative w-full lg:w-[48%] max-w-[420px] aspect-[4/5] rounded-2xl overflow-hidden border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-sm group">
            <Image
              src="/projects/packaging/progelato-podium-stage.webp"
              alt="Progelato Aubergine Stone Podium Stage"
              fill
              className="object-cover object-center pointer-events-none"
              sizes="(max-width: 1024px) 90vw, 420px"
              priority
            />

            <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-6">
              {view === "mockup" ? (
                <div
                  key={`mockup-${currentFlavour.id}`}
                  className="relative w-[85%] h-[85%] animate-fade-in flex items-center justify-center"
                >
                  <Image
                    src={currentFlavour.mockupImage}
                    alt={`${currentFlavour.name} Packaging Pouch on Aubergine Podium`}
                    fill
                    className="object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.85)] filter contrast-[1.02] brightness-[1.01]"
                    sizes="(max-width: 1024px) 75vw, 360px"
                    priority
                  />
                </div>
              ) : (
                <div
                  key={`artwork-${currentFlavour.id}`}
                  className="relative w-full h-full flex items-center justify-center p-2 animate-fade-in"
                >
                  <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden border border-white/20 shadow-xl bg-black/40">
                    <Image
                      src={currentFlavour.flatImage}
                      alt={`${currentFlavour.name} Flat Packaging Dieline (Front and Back)`}
                      fill
                      className="object-contain"
                      sizes="(max-width: 1024px) 80vw, 380px"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 font-mono text-[10px] text-[#F4EEE5] uppercase">
              0{flavourIndex + 1} / 07 · {view === "mockup" ? "Podium Mockup" : "Flat Dieline"}
            </div>

            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
              <span
                className="px-2 py-0.5 rounded bg-black/75 backdrop-blur-sm font-mono text-[10px] font-semibold tracking-wider text-white border border-white/10"
                style={{ borderLeftColor: currentFlavour.accentColor, borderLeftWidth: 3 }}
              >
                {currentFlavour.flavourCue}
              </span>
              <span className="font-mono text-[9px] text-white/70 bg-black/50 px-2 py-0.5 rounded">
                150 × 230 mm
              </span>
            </div>
          </div>

          {/* RIGHT: PROGELATO SHELF CONTROLS & FLAVOUR SELECTOR */}
          <div className="w-full lg:w-[48%] max-w-md text-[#24121B] bg-[#FFFDF9] p-5 sm:p-7 rounded-2xl shadow-2xl border border-white/30 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-2 mb-1">
              <p className="font-mono text-[10px] font-semibold tracking-wider text-[#890149] uppercase">
                03A · No Cheat Progelato
              </p>
              <span className="font-mono text-[10px] text-[#888] uppercase tracking-wide">
                Pouch System
              </span>
            </div>

            <h3 className="font-cubao text-2xl sm:text-3xl text-[#24121B] leading-tight mb-1.5">
              {currentFlavour.name}
            </h3>
            <p className="text-xs text-[#555] leading-relaxed mb-4">
              {currentFlavour.descriptor}
            </p>

            <div className="flex gap-1.5 p-1 rounded-full bg-zinc-100 border border-zinc-200 w-fit mb-4" aria-label="Packaging view mode">
              <button
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  view === "mockup" ? "bg-[#890149] text-white shadow-sm font-semibold" : "text-[#555] hover:text-black"
                }`}
                aria-pressed={view === "mockup"}
                onClick={() => setView("mockup")}
              >
                View Mockup
              </button>
              <button
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  view === "artwork" ? "bg-[#890149] text-white shadow-sm font-semibold" : "text-[#555] hover:text-black"
                }`}
                aria-pressed={view === "artwork"}
                onClick={() => setView("artwork")}
              >
                View Flat Artwork
              </button>
            </div>

            <div className="grid gap-1 mb-4 max-h-[190px] overflow-y-auto pr-1" aria-label="Choose a flavour">
              {progelatoData.flavours.map((f, i) => (
                <button
                  key={f.id}
                  onClick={() => setFlavourIndex(i)}
                  aria-pressed={flavourIndex === i}
                  className={`flex items-center justify-between px-3.5 py-2.5 sm:py-1.5 min-h-[44px] sm:min-h-[36px] rounded-lg text-xs font-medium transition-all text-left cursor-pointer ${
                    flavourIndex === i
                      ? "bg-zinc-100 text-[#24121B] font-semibold border-l-4"
                      : "text-zinc-600 hover:bg-zinc-50 border-l-4 border-transparent"
                  }`}
                  style={{ borderLeftColor: flavourIndex === i ? f.accentColor : "transparent" }}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full border border-black/10 shadow-xs" style={{ background: f.accentColor }} />
                    <span>{f.name}</span>
                  </span>
                  <span className="font-mono text-[10px] text-[#888]">
                    {flavourIndex === i ? "SELECTED" : `0${i + 1}`}
                  </span>
                </button>
              ))}
            </div>

            <Link
              href="/work/no-cheat-progelato"
              className="inline-flex items-center gap-2 text-[#890149] hover:underline font-medium text-xs pt-2.5 border-t border-zinc-200 w-full justify-between group min-h-[44px] sm:min-h-0 py-2 sm:py-0"
            >
              <span>Explore full Progelato case study</span>
              <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>

          {/* THUMBNAIL STRIP BENEATH (Switches flavour with crossfade & keyboard navigation) */}
          <div className="w-full mt-3 pt-2.5 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 col-span-full">
            <span className="font-mono text-[10px] text-white/50 uppercase tracking-wider">
              Select Flavour (01–07):
            </span>
            <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Progelato Flavours">
              {progelatoData.flavours.map((f, idx) => {
                const isSelected = flavourIndex === idx;
                return (
                  <button
                    key={f.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setFlavourIndex(idx)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setFlavourIndex(idx);
                      }
                    }}
                    className={`px-3 py-2 sm:px-2.5 sm:py-1 min-h-[44px] sm:min-h-[32px] rounded-xl font-mono text-xs sm:text-[11px] transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-[#890149] text-white shadow-md ring-2 ring-[#F6D06F]/50 border border-[#F6D06F]"
                        : "bg-white/10 text-white/80 hover:bg-white/20 border border-white/10"
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: f.accentColor }} />
                    <span>{f.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* BOTTOM METADATA & SCROLL HINT */}
        <footer className="relative z-30 flex items-center justify-between pt-3 border-t border-white/10 font-mono text-[11px] text-white/70">
          <div className="flex items-center gap-4 text-[10px] tracking-wider">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F6D06F]" />
              SOFT-TOUCH MATTE + SPOT UV
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#890149]" />
              MONO-PE RECYCLABLE
            </span>
          </div>

          <a
            href="#showcase-aara"
            className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-[#8EB897] hover:text-white transition-colors tracking-wider"
          >
            <span>SCROLL INTO 03B AARA</span>
            <ArrowDown size={11} className="animate-bounce" aria-hidden="true" />
          </a>
        </footer>
      </div>
    </section>

    {/* =========================================================================
        03B AARA RITUAL SHOWCASE (DIRECT SCROLL HANDOFF IN NORMAL PAGE FLOW)
        ========================================================================= */}
    <section
      ref={aaraShowcaseRef}
      id="showcase-aara"
      className="relative w-full min-h-screen lg:min-h-[calc(100vh-var(--nav-height,64px))] lg:h-[calc(100vh-var(--nav-height,64px))] lg:max-h-[calc(100vh-var(--nav-height,64px))] overflow-hidden flex flex-col justify-between py-2 sm:py-2.5 lg:py-2 px-4 sm:px-6 lg:px-8 text-[#F3F3E7] select-none scroll-mt-[var(--nav-height,64px)]"
      style={{
        background:
          "radial-gradient(circle at 50% 20%, rgba(26, 46, 33, 0.98) 0%, rgba(18, 34, 25, 1) 100%)",
      }}
      aria-label="Chapter 03B: Aara Botanical Tea Packaging"
    >
      {/* Gradual blend overlay at the boundary */}
      <div
        ref={aaraBlendRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, #101A12 0%, transparent 35%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto my-auto flex-1 flex flex-col justify-center min-h-0">
        <AaraRitual theme="dark" showEyebrow={false} showArchiveRow={false} />
      </div>

      {/* BOTTOM FOOTER NAVIGATION */}
      <footer className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-2 pt-1.5 pb-1 border-t border-[#B6C6B8]/20 font-mono text-[11px] text-[#B6C6B8]/80 max-w-7xl mx-auto w-full shrink-0">
        <div className="flex items-center gap-4 text-[10px] tracking-wider">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8EB897]" />
            UNCOATED FSC KRAFT
          </span>
          <span className="hidden sm:inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4D6A53]" />
            BRUSHED METALLIC TIN
          </span>
        </div>

        <Link
          href="/work/aara"
          className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-[#F3F3E7] hover:text-[#8EB897] transition-colors tracking-wider font-semibold lg:mr-36 sm:mr-36"
        >
          <span>THE AARA CONCEPT ARCHIVE</span>
          <ArrowUpRight size={12} />
        </Link>
      </footer>
    </section>

    {/* 04C: EXTENDED PACKAGING SUITE (Glow Bite FMCG Packaging) */}
    <div className="relative z-20 w-full bg-[#101A12]">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PackagingExtensions />
      </div>
    </div>
    </>
  );
}
