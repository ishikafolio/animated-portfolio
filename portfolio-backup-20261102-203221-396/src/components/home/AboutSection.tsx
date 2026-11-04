"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check, Sparkles } from "lucide-react";
import AboutMarquee from "./AboutMarquee";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const TOOLKIT = [
  "Figma & FigJam",
  "Adobe Illustrator",
  "Adobe Photoshop",
  "Next.js & React",
  "Tailwind CSS",
  "GSAP Motion",
  "Design Systems",
  "Packaging Dielines",
  "Micro-Interactions",
];

export function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Content fade & slide up
      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: contentRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // Image gentle parallax
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { yPercent: -4 },
          {
            yPercent: 4,
            ease: "none",
            scrollTrigger: {
              trigger: imageRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.5,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="bg-[#F3F3E7] border-t border-[#24121B]/15 relative z-10 overflow-hidden"
      aria-label="About Ishika Shrivastav"
    >
      {/* Editorial Marquee Strip */}
      <AboutMarquee />

      <div className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Visual Portrait Presentation */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-white border-2 border-[#24121B]/10 shadow-card">
              <div ref={imageRef} className="relative w-full h-full">
                <Image
                  src="/character/character-sheet.png"
                  alt="Ishika Shrivastav character reference and art direction"
                  fill
                  className="object-cover object-top hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#24121B]/60 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="font-mono text-xs uppercase tracking-widest text-[#F3F3E7]/80 block mb-1">
                  Ishika Shrivastav
                </span>
                <p className="font-display text-2xl uppercase tracking-tight">
                  Designer · Storyteller · System Builder
                </p>
              </div>
            </div>

            {/* Overlapping Pill Badge */}
            <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 bg-[#890149] text-[#F3F3E7] px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider shadow-lg flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Based in India · Global Reach</span>
            </div>
          </div>

          {/* Right Column: Bio & Philosophy */}
          <div ref={contentRef} className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="font-mono text-xs uppercase tracking-widest text-[#890149] bg-[#890149]/10 px-3 py-1 rounded-full font-semibold">
                  About & Philosophy
                </span>
                <span className="text-xs uppercase tracking-widest text-[#24121B]/60 font-semibold">
                  Design Mindset
                </span>
              </div>

              <h2 className="font-display text-4xl sm:text-6xl uppercase tracking-tight text-[#24121B] leading-[0.95] mb-6">
                Bridging Bold Editorial Character & Precision Systems.
              </h2>

              <div className="space-y-4 text-base sm:text-lg text-[#24121B]/80 font-light leading-relaxed mb-8">
                <p>
                  I am a UI/UX and graphic designer specializing in high-contrast visual identities, human-first mobile interfaces, and cohesive packaging systems.
                </p>
                <p>
                  My work is anchored in typographic restraint, intentional color psychology, and tactile details that make digital products feel memorable rather than interchangeable.
                </p>
              </div>

              {/* Core Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="p-4 rounded-2xl bg-white border border-[#24121B]/10 hover:border-[#890149]/30 transition-colors">
                  <span className="font-mono text-xs text-[#890149] font-bold block mb-1">
                    01
                  </span>
                  <h3 className="font-display text-base uppercase text-[#24121B] mb-1">
                    Editorial Craft
                  </h3>
                  <p className="text-xs text-[#24121B]/70 leading-relaxed">
                    Oversized type scale, balanced hierarchy, and intentional pacing.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#24121B]/10 hover:border-[#890149]/30 transition-colors">
                  <span className="font-mono text-xs text-[#890149] font-bold block mb-1">
                    02
                  </span>
                  <h3 className="font-display text-base uppercase text-[#24121B] mb-1">
                    Systemic Thinking
                  </h3>
                  <p className="text-xs text-[#24121B]/70 leading-relaxed">
                    Scalable token systems across mobile UI, print dielines, and web.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#24121B]/10 hover:border-[#890149]/30 transition-colors">
                  <span className="font-mono text-xs text-[#890149] font-bold block mb-1">
                    03
                  </span>
                  <h3 className="font-display text-base uppercase text-[#24121B] mb-1">
                    Empathy & Warmth
                  </h3>
                  <p className="text-xs text-[#24121B]/70 leading-relaxed">
                    Accessible contrast, readable typography, and authentic care.
                  </p>
                </div>
              </div>

              {/* Toolkit Chips */}
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-[#24121B]/60 font-semibold block mb-3">
                  Core Toolkit & Capabilities
                </span>
                <div className="flex flex-wrap gap-2">
                  {TOOLKIT.map((tool) => (
                    <span
                      key={tool}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#24121B]/5 text-xs text-[#24121B] font-medium border border-[#24121B]/10 hover:border-[#890149]/30 transition-colors"
                    >
                      <Check className="w-3 h-3 text-[#890149]" />
                      <span>{tool}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
