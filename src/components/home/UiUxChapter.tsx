"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSiteExperience } from "@/components/studio/SiteExperience";
import { ArrowDown, ArrowUpRight, RotateCcw, Smartphone, CheckCircle2 } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const TASKS = [
  {
    title: "A gentle reminder",
    screen: 3,
    label: "Try marking a medicine taken",
    note: "A single primary action keeps the next step clear. A confirmation explains what is shared, with an option to undo.",
    action: "taken",
  },
  {
    title: "Choose what to share",
    screen: 5,
    label: "Try changing a sharing permission",
    note: "Separate controls make the scope of family updates visible. Consent is a choice in the flow, not a hidden assumption.",
    action: "toggle:",
  },
  {
    title: "A family overview",
    screen: 7,
    label: "Explore a parent’s update",
    note: "The caregiver sees a summary first. A pending confirmation is distinguished from a confirmed missed dose.",
    action: "go:8",
  },
];

export default function UiUxChapter() {
  const { reducedMotion } = useSiteExperience();

  // Task interaction state
  const [task, setTask] = useState(0);
  const [attempted, setAttempted] = useState(false);
  const [reset, setReset] = useState(0);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const current = TASKS[task];

  // GSAP animation refs
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const bgGridRef = useRef<HTMLDivElement>(null);

  // Typography layer
  const titleGroupRef = useRef<HTMLDivElement>(null);
  const titleWordRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const metaBadgeRef = useRef<HTMLDivElement>(null);
  const mobileTitleRef = useRef<HTMLDivElement>(null);

  // Supporting orbital UI panels (real screens)
  const panelLeftRef = useRef<HTMLDivElement>(null);
  const panelRightRef = useRef<HTMLDivElement>(null);
  const panelTopRef = useRef<HTMLDivElement>(null);

  // Central phone and final demo layout
  const heroConstellationRef = useRef<HTMLDivElement>(null);
  const heroApertureRef = useRef<HTMLDivElement>(null);
  const phoneContainerRef = useRef<HTMLDivElement>(null);
  const demoNotesRef = useRef<HTMLDivElement>(null);
  const [isInteractive, setIsInteractive] = useState(false);
  const isInteractiveRef = useRef(false);

  // Observe prototype actions from iframe
  useEffect(() => {
    const observe = (event: MessageEvent) => {
      if (
        event.origin !== window.location.origin ||
        event.source !== frameRef.current?.contentWindow ||
        event.data?.type !== "careconnect-action"
      )
        return;
      if (
        typeof event.data.action === "string" &&
        event.data.action.startsWith(TASKS[task].action)
      ) {
        setAttempted(true);
      }
    };
    window.addEventListener("message", observe);
    return () => window.removeEventListener("message", observe);
  }, [task]);

  useEffect(() => {
    if (reducedMotion) {
      setIsInteractive(true);
      const targets = [
        titleWordRef.current,
        subtitleRef.current,
        metaBadgeRef.current,
        mobileTitleRef.current,
        heroConstellationRef.current,
        heroApertureRef.current,
        panelLeftRef.current,
        panelRightRef.current,
        panelTopRef.current,
        phoneContainerRef.current,
        demoNotesRef.current,
      ];
      targets.forEach((el) => {
        if (el) gsap.set(el, { clearProps: "all" });
      });
      return;
    }

    if (!wrapperRef.current || !stageRef.current) {
      setIsInteractive(true);
      return;
    }

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // DESKTOP: 220vh pinned sequence
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
            onUpdate: (self) => {
              // Enable full prototype interaction when settled (progress >= 0.95)
              if (self.progress >= 0.95 && !isInteractiveRef.current) {
                isInteractiveRef.current = true;
                setIsInteractive(true);
              } else if (self.progress < 0.95 && isInteractiveRef.current) {
                isInteractiveRef.current = false;
                setIsInteractive(false);
              }
            },
          },
        });

        // -------------------------------------------------------------
        // PHASE 1: 0% -> 20%
        // LAVENDER GLOW APERTURE REVEAL & MOVEMENT TOWARD CENTRAL PHONE
        // -------------------------------------------------------------
        if (heroApertureRef.current) {
          tl.fromTo(
            heroApertureRef.current,
            { clipPath: "circle(22% at 50% 50%)", scale: 0.98, opacity: 0.95 },
            { clipPath: "circle(85% at 50% 50%)", scale: 1.06, opacity: 1, ease: "power2.inOut", duration: 0.35 },
            0
          );
        }

        if (heroConstellationRef.current) {
          tl.to(heroConstellationRef.current, { opacity: 0, scale: 1.08, pointerEvents: "none", duration: 0.25 }, 0.45);
        }

        if (titleWordRef.current) {
          tl.fromTo(
            titleWordRef.current,
            { scale: 1.35, y: -80, opacity: 0.15, filter: "blur(6px)" },
            { scale: 1.0, y: 0, opacity: 1, filter: "blur(0px)", ease: "power2.out", duration: 0.2 },
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
            { y: 0, opacity: 0.9, duration: 0.18 },
            0.08
          );
        }

        // Orbital UI panels enter from depth
        if (panelLeftRef.current) {
          tl.fromTo(
            panelLeftRef.current,
            { x: -200, y: 80, rotationY: -15, opacity: 0, scale: 0.8 },
            { x: 0, y: 0, rotationY: -6, opacity: 0.85, scale: 1, ease: "power1.out", duration: 0.2 },
            0
          );
        }

        if (panelRightRef.current) {
          tl.fromTo(
            panelRightRef.current,
            { x: 200, y: -60, rotationY: 15, opacity: 0, scale: 0.8 },
            { x: 0, y: 0, rotationY: 6, opacity: 0.85, scale: 1, ease: "power1.out", duration: 0.2 },
            0.02
          );
        }

        if (panelTopRef.current) {
          tl.fromTo(
            panelTopRef.current,
            { y: -160, opacity: 0, scale: 0.85 },
            { y: 0, opacity: 0.8, scale: 1, ease: "power1.out", duration: 0.2 },
            0.04
          );
        }

        // Initial phone position
        if (phoneContainerRef.current) {
          tl.fromTo(
            phoneContainerRef.current,
            { scale: 0.92, opacity: 0 },
            { scale: 0.96, opacity: 0.5, ease: "power2.out", duration: 0.2 },
            0
          );
        }

        // -------------------------------------------------------------
        // PHASE 2: 20% -> 45%
        // Title locks into sharp focus; orbital panels align around phone
        // -------------------------------------------------------------
        tl.to({}, { duration: 0.25 }, 0.2);

        // -------------------------------------------------------------
        // PHASE 3: 45% -> 75%
        // Phone moves forward into focal prominence.
        // Title passes behind phone; orbital panels disperse.
        // -------------------------------------------------------------
        if (phoneContainerRef.current) {
          tl.to(
            phoneContainerRef.current,
            {
              scale: 1.0,
              opacity: 0.85,
              ease: "power2.inOut",
              duration: 0.3,
            },
            0.45
          );
        }

        if (titleWordRef.current) {
          tl.to(
            titleWordRef.current,
            { y: -120, scale: 0.85, opacity: 0.08, ease: "power2.inOut", duration: 0.3 },
            0.45
          );
        }

        if (subtitleRef.current) {
          tl.to(subtitleRef.current, { y: -40, opacity: 0, duration: 0.2 }, 0.45);
        }

        if (metaBadgeRef.current) {
          tl.to(metaBadgeRef.current, { y: -30, opacity: 0, duration: 0.2 }, 0.45);
        }

        // Orbital panels disperse smoothly
        if (panelLeftRef.current) {
          tl.to(panelLeftRef.current, { x: -320, opacity: 0, duration: 0.25 }, 0.45);
        }
        if (panelRightRef.current) {
          tl.to(panelRightRef.current, { x: 320, opacity: 0, duration: 0.25 }, 0.45);
        }
        if (panelTopRef.current) {
          tl.to(panelTopRef.current, { y: -240, opacity: 0, duration: 0.25 }, 0.45);
        }

        // -------------------------------------------------------------
        // PHASE 4: 75% -> 100%
        // Phone and demo notes resolve smoothly into settled interactive state
        // -------------------------------------------------------------
        if (phoneContainerRef.current) {
          tl.to(
            phoneContainerRef.current,
            {
              scale: 1.0,
              opacity: 1,
              ease: "power2.out",
              duration: 0.25,
            },
            0.75
          );
        }

        if (demoNotesRef.current) {
          tl.fromTo(
            demoNotesRef.current,
            { x: -30, opacity: 0 },
            { x: 0, opacity: 1, ease: "power2.out", duration: 0.25 },
            0.75
          );
        }
      });

      // MOBILE: Flow naturally with subtle scroll entrance & full prototype interactivity
      mm.add("(max-width: 1023px)", () => {
        isInteractiveRef.current = true;
        setIsInteractive(true);

        if (mobileTitleRef.current) {
          gsap.fromTo(
            mobileTitleRef.current,
            { y: 15, opacity: 0.5 },
            {
              y: 0,
              opacity: 1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: mobileTitleRef.current,
                start: "top 85%",
                end: "top 55%",
                scrub: 0.5,
              },
            }
          );
        }

        if (demoNotesRef.current) {
          gsap.fromTo(
            demoNotesRef.current,
            { y: 20, opacity: 0.7 },
            {
              y: 0,
              opacity: 1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: demoNotesRef.current,
                start: "top 85%",
                end: "top 45%",
                scrub: 0.5,
              },
            }
          );
        }

        if (phoneContainerRef.current) {
          gsap.fromTo(
            phoneContainerRef.current,
            { scale: 0.96, opacity: 0.8 },
            {
              scale: 1.0,
              opacity: 1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: phoneContainerRef.current,
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

  return (
    <section
      ref={wrapperRef}
      id="intro-uiux"
      className="uiux-world-wrapper relative w-full lg:min-h-[220vh] bg-[#131224]"
      aria-label="Chapter 03: UI/UX Product Systems — CareConnect"
    >
      {/* Anchor for direct discipline navigation */}
      <div id="chapter-uiux" className="absolute -top-24 pointer-events-none scroll-mt-[var(--nav-height,64px)]" aria-hidden="true" />
      <div id="careconnect" className="absolute -top-24 pointer-events-none scroll-mt-[var(--nav-height,64px)]" aria-hidden="true" />
      {/* PINNED STAGE (Sticky on desktop, natural flow on mobile) */}
      <div
        ref={stageRef}
        className="uiux-stage w-full min-h-screen lg:h-screen lg:sticky lg:top-0 overflow-hidden flex flex-col justify-between pt-[calc(var(--nav-height,64px)+0.75rem)] pb-2.5 px-4 sm:px-8 lg:px-12 text-[#F3F3E7] select-none"
        style={{
          background:
            "radial-gradient(circle at 75% 30%, rgba(81, 70, 166, 0.4) 0%, rgba(19, 18, 36, 0.98) 72%)",
        }}
      >
        {/* Blueprint Layout Grid & Coordinate Markers */}
        <div
          ref={bgGridRef}
          className="absolute inset-0 pointer-events-none opacity-30 z-0 overflow-hidden"
          aria-hidden="true"
        >
          <svg className="w-full h-full object-cover" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 900">
            <defs>
              <pattern id="uiux-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1" fill="rgba(155, 135, 245, 0.15)" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#uiux-grid)" />
            {/* Columns */}
            {[180, 360, 540, 720, 900, 1080, 1260].map((x, i) => (
              <line
                key={i}
                x1={x}
                y1="0"
                x2={x}
                y2="900"
                stroke="rgba(155, 135, 245, 0.1)"
                strokeWidth="1"
              />
            ))}
          </svg>
        </div>

        {/* TOP HEADER META */}
        <header
          ref={metaBadgeRef}
          className="relative z-10 flex items-center justify-between gap-4 pb-2 border-b border-white/10 font-mono text-[11px] sm:text-xs tracking-wider uppercase shrink-0"
        >
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#9B87F5] animate-pulse" />
              CHAPTER 03
            </span>
            <span className="hidden sm:inline-block text-[#F3F3E7]/70">
              UI/UX & Mobile Product Systems
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden md:inline-block text-[#9B87F5] text-[10px]">
              CARECONNECT MOBILE APP
            </span>
            <a
              href="#showcase-uiux"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/20 hover:border-white/60 bg-white/5 hover:bg-white/15 transition-all text-[#F3F3E7] text-[11px]"
            >
              <span>Test Prototype</span>
              <ArrowDown size={13} aria-hidden="true" />
            </a>
          </div>
        </header>

        {/* CENTER STAGE CONTAINER (Flexibly sized within available viewport height) */}
        <div className="relative z-10 my-auto flex-1 flex flex-col lg:flex-row items-center justify-center w-full max-w-7xl mx-auto gap-6 lg:gap-10 min-h-0">
          {/* BEAT 1 & 2: CARECONNECT LUMINOUS CARE CONSTELLATION HERO ARTWORK */}
          <div
            ref={heroConstellationRef}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
          >
            <div
              ref={heroApertureRef}
              className="relative w-[92%] max-w-5xl aspect-[16/9] rounded-3xl overflow-hidden border border-[#9B87F5]/40 shadow-[0_0_80px_rgba(155,135,245,0.35)] bg-[#110F20]"
              style={{ clipPath: "circle(60% at 50% 50%)" }}
            >
              <Image
                src="/projects/exhibition/uiux-careconnect-hero.png"
                alt="CareConnect: A luminous care constellation — UI/UX Chapter Opening"
                fill
                sizes="(max-width: 1024px) 95vw, 1200px"
                className="object-cover object-center transition-transform duration-700"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#131224]/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-xs font-mono text-white/90">
                <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-[#9B87F5]/40 text-[#ECE9FB]">
                  CareConnect · Luminous Care Constellation
                </span>
                <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
                  Scroll into Working Prototype
                </span>
              </div>
            </div>
          </div>

          {/* SUPPORTING ORBITAL UI PANELS (Real Screens from prototype gallery) */}
          <div
            ref={panelLeftRef}
            className="absolute -left-2 sm:left-4 lg:left-8 top-12 w-44 sm:w-56 lg:w-64 aspect-[390/460] rounded-2xl overflow-hidden border border-[#9B87F5]/30 shadow-2xl z-10 pointer-events-none hidden lg:block bg-[#1B1930]/90 backdrop-blur-md"
          >
            <Image
              src="/projects/careconnect/gallery/03_medicine_reminder.webp"
              alt="CareConnect Reminder Panel"
              fill
              className="object-cover"
              sizes="260px"
            />
            <div className="absolute top-2.5 left-3 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm font-mono text-[9px] text-[#ECE9FB]">
              TASK 01 // REMINDER
            </div>
          </div>

          <div
            ref={panelRightRef}
            className="absolute -right-2 sm:right-4 lg:right-8 top-16 w-44 sm:w-56 lg:w-64 aspect-[390/460] rounded-2xl overflow-hidden border border-[#9B87F5]/30 shadow-2xl z-10 pointer-events-none hidden lg:block bg-[#1B1930]/90 backdrop-blur-md"
          >
            <Image
              src="/projects/careconnect/gallery/05_family_sharing.webp"
              alt="CareConnect Sharing Panel"
              fill
              className="object-cover"
              sizes="260px"
            />
            <div className="absolute top-2.5 left-3 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm font-mono text-[9px] text-[#ECE9FB]">
              TASK 02 // CONSENT
            </div>
          </div>

          <div
            ref={panelTopRef}
            className="absolute top-0 w-52 sm:w-60 aspect-[390/340] rounded-2xl overflow-hidden border border-[#9B87F5]/30 shadow-2xl z-10 pointer-events-none hidden xl:block bg-[#1B1930]/90 backdrop-blur-md"
          >
            <Image
              src="/projects/careconnect/gallery/07_caregiver_home.webp"
              alt="CareConnect Overview Panel"
              fill
              className="object-cover"
              sizes="240px"
            />
            <div className="absolute top-2.5 left-3 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm font-mono text-[9px] text-[#ECE9FB]">
              TASK 03 // OVERVIEW
            </div>
          </div>

          {/* OVERSIZED TYPOGRAPHY (Quiet background detail) */}
          <div
            ref={titleGroupRef}
            className="absolute z-0 text-center hidden lg:flex flex-col items-center justify-center max-w-4xl px-4 select-none pointer-events-none opacity-[0.06]"
          >
            <span className="font-mono text-xs sm:text-sm tracking-widest text-[#9B87F5] uppercase mb-3">
              Healthcare Systems • Reduced Cognitive Overload
            </span>
            <h2
              ref={titleWordRef}
              className="font-cubao text-6xl sm:text-8xl md:text-9xl lg:text-[8.5rem] xl:text-[10rem] leading-[0.86] tracking-tight uppercase text-[#9B87F5] drop-shadow-md"
            >
              UI/UX DESIGN
            </h2>
            <p
              ref={subtitleRef}
              className="mt-4 sm:mt-6 text-sm sm:text-base lg:text-lg text-[#F3F3E7]/80 max-w-xl font-normal leading-relaxed"
            >
              Small actions. Clear choices. A calmer experience for families navigating care, medication, and daily routines.
            </p>
          </div>

          {/* MOBILE TYPOGRAPHY HEADER (Crisp chapter entrance on phone) */}
          <div
            ref={mobileTitleRef}
            className="w-full flex lg:hidden flex-col text-left mb-6 px-1"
          >
            <div className="font-mono text-[10px] sm:text-xs tracking-[0.2em] text-[#9B87F5] uppercase mb-1 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5146A6]" />
              <span>03 / SELECTED WORK</span>
            </div>
            <h2 className="font-cubao text-3xl sm:text-4xl md:text-5xl leading-tight tracking-tight uppercase text-[#F3F3E7] drop-shadow-md">
              UI/UX Design
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#F4EEE5]/85 tracking-wide mt-1 font-medium">
              CareConnect • Healthcare Systems & Mobile Flows
            </p>
          </div>

          {/* TWO-COLUMN DEMO COMPOSITION (Centered together with deliberate gap, phone aligned to card center) */}
          <div className="relative z-10 w-full max-w-4xl xl:max-w-5xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 xl:gap-14 my-auto">
            {/* LEFT COLUMN: LIVE PROJECT CONTROLS & EXPLANATION */}
            <div
              ref={demoNotesRef}
              className="w-full lg:w-[420px] xl:w-[460px] z-20 text-[#25304A] bg-[#FAF8FC] p-5 sm:p-6 rounded-2xl shadow-xl border border-white/40 flex flex-col justify-center shrink-0"
            >
              <p className="font-mono text-[10px] sm:text-[11px] font-semibold tracking-wider text-[#5146A6] uppercase mb-1">
                A little care, in action
              </p>
              <h3 className="font-cubao text-xl sm:text-2xl xl:text-3xl text-[#181829] leading-tight mb-1.5">
                Try the thinking.
              </h3>
              <p className="text-xs sm:text-[13px] text-[#4A4762] leading-relaxed mb-3">
                Three small moments from the CareConnect concept. Choose a task, then interact directly with the phone.
              </p>

              {/* Task selector buttons */}
              <div className="grid gap-1.5 mb-2 sm:mb-2.5" aria-label="Prototype tasks">
                {TASKS.map((t, i) => (
                  <button
                    key={t.title}
                    aria-pressed={task === i}
                    onClick={() => {
                      setTask(i);
                      setAttempted(false);
                    }}
                    className={`flex items-center justify-between px-3 py-1.5 sm:py-2 rounded-xl border transition-all text-left font-medium text-xs sm:text-sm min-h-[36px] sm:min-h-[38px] ${
                      task === i
                        ? "bg-[#5146A6] text-white border-[#5146A6] shadow-sm font-semibold"
                        : "bg-white text-[#25304A] border-zinc-200 hover:border-[#5146A6]/40"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="font-mono text-[10px] opacity-75">0{i + 1}</span>
                      <span>{t.title}</span>
                    </span>
                    <span className="font-mono text-xs">↗</span>
                  </button>
                ))}
              </div>

              {/* Current task annotation */}
              <div className="border-l-2 border-[#5146A6] pl-2.5 py-0.5 mb-2 sm:mb-2.5" aria-live="polite">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#5146A6] block mb-0.5">
                  {attempted ? "Interaction explored ✓" : "Your next step"}
                </span>
                <h4 className="text-xs sm:text-sm font-semibold text-[#181829] mb-0.5">{current.label}</h4>
                <p className="text-[11px] sm:text-xs text-[#5D5A75] leading-snug">{current.note}</p>
              </div>

              <div className="flex items-center gap-4 text-xs font-semibold mt-0.5">
                <button
                  className="inline-flex items-center gap-1.5 text-[#5146A6] hover:underline cursor-pointer"
                  onClick={() => {
                    setReset((v) => v + 1);
                    setAttempted(false);
                  }}
                >
                  <RotateCcw size={13} /> Reset this task
                </button>
                <a
                  className="inline-flex items-center gap-1.5 text-[#5146A6] hover:underline"
                  href="/projects/careconnect/prototype/index.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open full prototype <ArrowUpRight size={13} />
                </a>
              </div>
            </div>

            {/* RIGHT COLUMN: FOCAL CENTRAL PHONE (Sized by available viewport height) */}
            <div
              ref={phoneContainerRef}
              className="care-phone-wrap relative z-30 flex flex-col items-center justify-center pointer-events-auto shrink-0 my-auto"
            >
              <div
                className={`care-phone relative h-[min(460px,calc(100vh-var(--nav-height,64px)-140px))] max-h-[480px] min-h-[320px] w-auto aspect-[390/844] rounded-[28px] sm:rounded-[32px] border-[5px] sm:border-[6px] border-[#2C2840] shadow-2xl bg-[#FAF8F5] overflow-hidden ${
                  isInteractive ? "pointer-events-auto" : "pointer-events-none"
                }`}
              >
                <iframe
                  ref={frameRef}
                  key={`${task}-${reset}`}
                  title={`CareConnect demo: ${current.title}`}
                  src={`/projects/careconnect/prototype/index.html?embed=1&screen=${current.screen}`}
                  loading="lazy"
                  sandbox="allow-scripts allow-same-origin"
                  className="w-full h-full border-0 block"
                />
              </div>
              <span className="care-phone-caption font-mono text-[10px] text-white/60 mt-2 text-center tracking-wider">
                Interactive prototype · tap or use keyboard
              </span>
            </div>
          </div>
        </div>

        {/* CASE-STUDY LINK ROW & METADATA FOOTER (Clear of phone & Pause Motion button) */}
        <footer className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-2 pb-1 border-t border-white/10 font-mono text-xs text-white/60 shrink-0">
          <Link
            id="showcase-uiux"
            href="/work/careconnect"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#5146A6]/20 hover:bg-[#5146A6]/40 border border-[#9B87F5]/30 hover:border-[#9B87F5]/70 text-[#ECE9FB] hover:text-white font-semibold text-xs tracking-wider transition-all shadow-md group shrink-0"
          >
            <span>The full CareConnect case study</span>
            <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>

          <div className="flex items-center gap-4 text-[10px] tracking-wider lg:mr-36 sm:mr-36 shrink-0">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80]" />
              WCAG AAA CONTRAST (8.4:1)
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#9B87F5]" />
              DEMENTIA-FRIENDLY HIERARCHY
            </span>
          </div>
        </footer>
      </div>
    </section>
  );
}
