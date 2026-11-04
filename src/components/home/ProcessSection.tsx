"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { useSiteExperience } from "@/components/studio/SiteExperience";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Compass, Lightbulb, PenTool, CheckCircle } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const PROCESS_STEPS = [
  {
    step: "01",
    title: "Discover",
    tagline: "Uncovering Context & Intent",
    description:
      "Deep immersion into project goals, audience emotional touchpoints, market landscape, and aesthetic aspirations.",
    icon: Compass,
    highlights: ["Context Research", "Visual Benchmarking", "Empathy Mapping"],
  },
  {
    step: "02",
    title: "Define",
    tagline: "Strategic Architecture",
    description:
      "Establishing structural clarity: typography hierarchy, color tokens, content taxonomy, and core user journeys.",
    icon: Lightbulb,
    highlights: ["Brand Strategy", "Typography Pairing", "Wireframe Blueprints"],
  },
  {
    step: "03",
    title: "Design",
    tagline: "Form & System Craft",
    description:
      "Translating strategy into expressive visual reality: high-fidelity UI screens, packaging dielines, and component libraries.",
    icon: PenTool,
    highlights: ["Visual Identity", "UI Screens", "Packaging Mockups"],
  },
  {
    step: "04",
    title: "Refine",
    tagline: "Polish & Precision",
    description:
      "Testing micro-interactions, validating WCAG contrast ratios, verifying production print files, and seamless handoff.",
    icon: CheckCircle,
    highlights: ["Micro-Interactions", "Accessibility Testing", "Production Handover"],
  },
];

export function ProcessSection() {
  const { reducedMotion } = useSiteExperience();
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const prefersReducedMotion = reducedMotion;

    if (prefersReducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, idx) => {
        if (!card) return;
        gsap.from(card, {
          opacity: 0,
          y: 28,
          duration: 0.75,
          delay: idx * 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            once: true,
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={containerRef}
      id="process"
      className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#F3F3E7] border-t border-[#24121B]/15 relative z-10"
      aria-label="Creative Process"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-16 border-b border-[#24121B]/15">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono text-xs uppercase tracking-widest text-[#890149] bg-[#890149]/10 px-3 py-1 rounded-full font-semibold">
                Methodology
              </span>
              <span className="text-xs uppercase tracking-widest text-[#24121B]/60 font-semibold">
                How It Happens
              </span>
            </div>
            <h2 className="font-display text-5xl sm:text-7xl lg:text-8xl uppercase tracking-tight text-[#24121B] leading-[0.92]">
              Creative Process
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#24121B]/70 max-w-md font-light leading-relaxed">
            A structured four-phase workflow designed for clarity, intentional exploration, and meticulous execution.
          </p>
        </div>

        {/* 4 Editorial Process Cards with stagger */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-16">
          {PROCESS_STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.step}
                ref={(el) => { cardsRef.current[idx] = el; }}
                className="p-8 rounded-3xl bg-white border border-[#24121B]/10 shadow-sm hover:shadow-card hover:border-[#890149]/30 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <span className="font-mono text-xs font-bold px-3 py-1 rounded-full bg-[#890149]/10 text-[#890149]">
                      {step.step}
                    </span>
                    <Icon className="w-5 h-5 text-[#24121B]/40 group-hover:text-[#890149] transition-colors" />
                  </div>

                  <h3 className="font-display text-3xl uppercase tracking-tight text-[#24121B] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#890149] mb-4">
                    {step.tagline}
                  </p>
                  <p className="text-sm text-[#24121B]/70 font-light leading-relaxed mb-6">
                    {step.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#24121B]/10">
                  <div className="space-y-1.5">
                    {step.highlights.map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-2 text-xs text-[#24121B]/80"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#890149]" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ProcessSection;
