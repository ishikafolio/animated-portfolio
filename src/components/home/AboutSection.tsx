"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useSiteExperience } from "@/components/studio/SiteExperience";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check, Sparkles, Package, Layers, Palette } from "lucide-react";
import AboutMarquee from "./AboutMarquee";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}


function IllustratorIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={`${className} shrink-0`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="24" height="24" rx="5" fill="#330000" />
      <rect x="0.75" y="0.75" width="22.5" height="22.5" rx="4.25" stroke="#FF9A00" strokeWidth="1.5" />
      <path d="M9.1 16.5L9.9 14.2H14.1L14.9 16.5H16.8L12.9 6.2H11.1L7.2 16.5H9.1ZM12 8.4L13.5 12.6H10.5L12 8.4Z" fill="#FF9A00" />
      <path d="M18.8 8.6C18.8 8.05 18.35 7.6 17.8 7.6C17.25 7.6 16.8 8.05 16.8 8.6C16.8 9.15 17.25 9.6 17.8 9.6C18.35 9.6 18.8 9.15 18.8 8.6ZM18.7 10.6H16.9V16.5H18.7V10.6Z" fill="#FF9A00" />
    </svg>
  );
}

function PhotoshopIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={`${className} shrink-0`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="24" height="24" rx="5" fill="#001E36" />
      <rect x="0.75" y="0.75" width="22.5" height="22.5" rx="4.25" stroke="#31A8FF" strokeWidth="1.5" />
      <path d="M7 6.8H11.2C13 6.8 14.1 7.8 14.1 9.4C14.1 11.1 12.9 12.1 11.1 12.1H8.8V16.5H7V6.8ZM8.8 10.6H11C11.9 10.6 12.3 10.2 12.3 9.4C12.3 8.7 11.8 8.3 11 8.3H8.8V10.6Z" fill="#31A8FF" />
      <path d="M14.5 14.6C14.8 15.2 15.4 15.5 16.2 15.5C17.1 15.5 17.6 15.1 17.6 14.5C17.6 13.9 17.1 13.6 16.1 13.3C14.7 12.9 14.1 12.2 14.1 11.1C14.1 9.8 15.2 8.9 16.6 8.9C17.6 8.9 18.4 9.3 18.8 10.1L17.5 10.9C17.3 10.5 16.9 10.3 16.4 10.3C15.8 10.3 15.5 10.6 15.5 11C15.5 11.5 15.9 11.8 16.8 12.1C18.2 12.5 18.9 13.1 18.9 14.3C18.9 15.8 17.7 16.8 16.1 16.8C15 16.8 14.1 16.2 13.6 15.3L14.5 14.6Z" fill="#31A8FF" />
    </svg>
  );
}

function InDesignIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={`${className} shrink-0`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="24" height="24" rx="5" fill="#49021F" />
      <rect x="0.75" y="0.75" width="22.5" height="22.5" rx="4.25" stroke="#FF3366" strokeWidth="1.5" />
      <path d="M8.8 6.8H10.6V16.5H8.8V6.8Z" fill="#FF3366" />
      <path d="M12.4 11.8C12.4 9.9 13.4 8.7 15.1 8.7C16 8.7 16.7 9.1 17.1 9.8V6.8H18.9V16.5H17.2V15.5C16.8 16.2 16 16.7 15 16.7C13.4 16.7 12.4 15.3 12.4 13.3V11.8ZM14.2 12.8C14.2 14.3 14.9 15.2 15.9 15.2C16.9 15.2 17.3 14.4 17.3 13.3V12.1C17.3 11 16.8 10.2 15.8 10.2C14.8 10.2 14.2 11.2 14.2 12.8Z" fill="#FF3366" />
    </svg>
  );
}

function FigmaIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={`${className} shrink-0`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M6 5.5A3.5 3.5 0 0 1 9.5 2H13v7H9.5A3.5 3.5 0 0 1 6 5.5z" fill="#F24E1E" />
      <path d="M13 2h3.5a3.5 3.5 0 1 1 0 7H13V2z" fill="#FF7262" />
      <path d="M13 9H9.5a3.5 3.5 0 1 0 0 7H13V9z" fill="#A259FF" />
      <path d="M13 9h3.5a3.5 3.5 0 1 1 0 7H13V9z" fill="#1ABCFE" />
      <path d="M6 19.5A3.5 3.5 0 0 0 9.5 23a3.5 3.5 0 0 0 3.5-3.5V16H9.5A3.5 3.5 0 0 0 6 19.5z" fill="#0ACF83" />
    </svg>
  );
}

const TOOLKIT = [
  { name: "Adobe Illustrator", icon: <IllustratorIcon /> },
  { name: "Adobe Photoshop", icon: <PhotoshopIcon /> },
  { name: "Adobe InDesign", icon: <InDesignIcon /> },
  { name: "Figma", icon: <FigmaIcon /> },
  { name: "Packaging Dielines", icon: <Package className="w-4 h-4 text-[#890149] shrink-0" aria-hidden="true" /> },
  { name: "Design Systems", icon: <Layers className="w-4 h-4 text-[#890149] shrink-0" aria-hidden="true" /> },
  { name: "Motion Prototypes", icon: <Sparkles className="w-4 h-4 text-[#890149] shrink-0" aria-hidden="true" /> },
  { name: "Print Production", icon: <Palette className="w-4 h-4 text-[#890149] shrink-0" aria-hidden="true" /> },
];

export function AboutSection() {
  const { reducedMotion } = useSiteExperience();
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = reducedMotion;

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
  }, [reducedMotion]);

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
                  Core Toolkit &amp; Capabilities
                </span>
                <div className="flex flex-wrap gap-2.5 sm:gap-3 items-center">
                  {TOOLKIT.map((tool) => (
                    <span
                      key={tool.name}
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#24121B]/12 hover:border-[#890149]/35 hover:bg-[#890149]/5 transition-all text-xs sm:text-sm font-medium text-[#24121B] shadow-sm select-none"
                    >
                      {tool.icon}
                      <span>{tool.name}</span>
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
