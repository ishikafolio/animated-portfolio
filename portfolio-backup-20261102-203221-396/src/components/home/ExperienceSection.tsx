"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Briefcase, Calendar, CheckCircle2, Sparkles, ArrowUpRight } from "lucide-react";
import ChapterIntro from "./ChapterIntro";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const MILESTONES = [
  {
    period: "2025 — PRESENT",
    role: "Independent Designer & Art Director",
    company: "Self-Initiated & Select Commissions",
    location: "India / Remote Global",
    type: "Lead Direction",
    description:
      "Directing end-to-end visual identities, tactile packaging systems, and human-first mobile applications for emerging lifestyle brands and digital products.",
    deliverables: ["Visual Identity Systems", "Mobile UI Architecture", "Packaging Dielines & Production"],
  },
  {
    period: "2024 — 2025",
    role: "UI/UX & Product Designer",
    company: "Digital Product Initiatives",
    location: "Collaborative / Remote",
    type: "Product & Systems",
    description:
      "Crafted comprehensive multi-screen mobile flows, design token systems, interactive Figma prototypes, and validated accessibility compliance (WCAG AAA).",
    deliverables: ["Design Systems", "Interactive Prototyping", "Accessibility Audit"],
  },
  {
    period: "2023 — 2024",
    role: "Graphic & Brand Identity Specialist",
    company: "Creative Studio & Brand Projects",
    location: "Studio Collaborations",
    type: "Identity Craft",
    description:
      "Designed distinctive logo marks, bespoke typography hierarchies, editorial publications, marketing visuals, and commercial packaging guidelines.",
    deliverables: ["Logo Architecture", "Editorial Layouts", "Commercial Artboards"],
  },
];

export function ExperienceSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      itemsRef.current.forEach((item, idx) => {
        if (!item) return;
        gsap.fromTo(
          item,
          { y: 20 },
          {
            y: 0,
            duration: 0.6,
            delay: idx * 0.08,
            ease: "power2.out",
            scrollTrigger: {
              trigger: item,
              start: "top 92%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} id="experience" className="relative">
      {/* Chapter 04 Full-Screen Cinematic Motion-Graphics Intro */}
      <ChapterIntro
        id="intro-experience"
        chapterNumber="04"
        category="Career Chronology & Milestones"
        title="EXPERIENCE"
        subtitle="A trajectory of digital craft, systematic brand design, and human-centered mobile experiences."
        type="experience"
        targetId="showcase-experience"
      />

      {/* Experience Showcase Content */}
      <section
        id="showcase-experience"
        className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#F3F3E7] border-t border-[#24121B]/15 relative z-10"
        aria-label="Professional Experience & Journey"
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-16 border-b border-[#24121B]/15">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="font-mono text-xs uppercase tracking-widest text-[#890149] bg-[#890149]/10 px-3 py-1 rounded-full font-semibold">
                  Trajectory
                </span>
                <span className="text-xs uppercase tracking-widest text-[#24121B]/60 font-semibold">
                  2023 — 2026
                </span>
              </div>
              <h2 className="font-display text-5xl sm:text-7xl lg:text-8xl uppercase tracking-tight text-[#24121B] leading-[0.92]">
                Career Timeline
              </h2>
            </div>
            <p className="text-sm sm:text-base text-[#24121B]/70 max-w-md font-light leading-relaxed">
              Synthesizing visual storytelling and systemic thinking across product design, brand identity, and physical packaging touchpoints.
            </p>
          </div>

          {/* Timeline Cards */}
          <div className="mt-16 space-y-8">
            {MILESTONES.map((item, idx) => (
              <div
                key={item.period}
                ref={(el) => { itemsRef.current[idx] = el; }}
                className="group rounded-3xl bg-white border border-[#24121B]/10 p-8 sm:p-12 hover:border-[#890149]/30 hover:shadow-lifted transition-all duration-500"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Period & Role Type */}
                  <div className="lg:col-span-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-3.5 h-3.5 text-[#890149]" />
                        <span className="font-mono text-xs font-bold tracking-widest text-[#890149]">
                          {item.period}
                        </span>
                      </div>
                      <h3 className="font-display text-2xl sm:text-3xl uppercase tracking-tight text-[#24121B] mt-1 mb-2">
                        {item.role}
                      </h3>
                      <p className="font-medium text-sm text-[#24121B]/70 mb-1">
                        {item.company}
                      </p>
                      <span className="text-xs font-mono text-[#24121B]/50 block">
                        {item.location}
                      </span>
                    </div>

                    <div className="mt-6">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#890149]/10 text-[#890149] text-xs font-semibold uppercase tracking-wider">
                        <Sparkles className="w-3 h-3" />
                        <span>{item.type}</span>
                      </span>
                    </div>
                  </div>

                  {/* Description & Deliverables */}
                  <div className="lg:col-span-8 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-[#24121B]/10 pt-6 lg:pt-0 lg:pl-10">
                    <p className="text-base sm:text-lg text-[#24121B]/80 font-light leading-relaxed mb-6">
                      {item.description}
                    </p>

                    <div>
                      <span className="font-mono text-xs uppercase tracking-widest text-[#24121B]/50 block mb-3 font-semibold">
                        Core Focus Areas
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {item.deliverables.map((del) => (
                          <span
                            key={del}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#24121B]/5 text-xs text-[#24121B]/80 font-medium border border-[#24121B]/10"
                          >
                            <CheckCircle2 className="w-3 h-3 text-[#890149]" />
                            <span>{del}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default ExperienceSection;
