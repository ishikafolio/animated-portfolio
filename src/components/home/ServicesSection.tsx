"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { useSiteExperience } from "@/components/studio/SiteExperience";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const SERVICES = [
  {
    number: "01",
    title: "UI/UX & Product Design",
    description:
      "End-to-end mobile and web interface design focusing on clarity, accessible hierarchy, intuitive user journeys, and component design systems.",
    deliverables: [
      "Mobile App UI",
      "Interactive Wireframing",
      "Design Systems",
      "Accessibility Audits",
      "User Journey Mapping",
    ],
  },
  {
    number: "02",
    title: "Brand Identity & Visual Systems",
    description:
      "Crafting distinctive brand marks, custom typographic hierarchies, editorial guidelines, and expressive collateral for contemporary brands.",
    deliverables: [
      "Logo & Symbol Design",
      "Typography Rules",
      "Brand Style Guides",
      "Editorial Layouts",
      "Digital Collateral",
    ],
  },
  {
    number: "03",
    title: "Packaging & Tactile Design",
    description:
      "Physical packaging ranges, production-ready dielines, flavour differentiation systems, and realistic 3D mockup visualizations.",
    deliverables: [
      "Stand-Up Pouches & Cartons",
      "Production Dielines",
      "Label Systems",
      "3D Product Mockups",
      "Shelf Presence Strategy",
    ],
  },
  {
    number: "04",
    title: "Motion & Interactive Experience",
    description:
      "Dynamic web interactions, micro-animations, GSAP scroll sequences, and interactive click-through prototypes that bring interfaces alive.",
    deliverables: [
      "Interactive Web Prototyping",
      "Micro-Interactions",
      "GSAP Scroll Animations",
      "Hover Physics",
      "Figma Motion Prototypes",
    ],
  },
];

export function ServicesSection() {
  const { reducedMotion } = useSiteExperience();
  const containerRef = useRef<HTMLDivElement>(null);
  const rowsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const prefersReducedMotion = reducedMotion;

    if (prefersReducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      rowsRef.current.forEach((row, idx) => {
        if (!row) return;
        gsap.from(row, {
          opacity: 0,
          y: 20,
          duration: 0.65,
          delay: idx * 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: row,
            start: "top 92%",
            once: true,
          },
        });
      });

      ScrollTrigger.refresh();
    }, containerRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={containerRef}
      id="services"
      className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#F3F3E7] border-t border-[#24121B]/15 relative z-10"
      aria-label="Services & Capabilities"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-16 border-b border-[#24121B]/15">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono text-xs uppercase tracking-widest text-[#890149] bg-[#890149]/10 px-3 py-1 rounded-full font-semibold">
                Services
              </span>
              <span className="text-xs uppercase tracking-widest text-[#24121B]/60 font-semibold">
                What I Do
              </span>
            </div>
            <h2 className="font-display text-5xl sm:text-7xl lg:text-8xl uppercase tracking-tight text-[#24121B] leading-[0.92]">
              Capabilities
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#24121B]/70 max-w-md font-light leading-relaxed">
            From initial conceptual vision to polished production deliverables across brand, product, and physical packaging.
          </p>
        </div>

        {/* Numbered Service List with Hairline Rules */}
        <div className="divide-y divide-[#24121B]/15">
          {SERVICES.map((service, idx) => (
            <div
              key={service.number}
              ref={(el) => { rowsRef.current[idx] = el; }}
              className="py-12 sm:py-16 group hover:bg-[#890149]/5 transition-colors duration-300 px-4 sm:px-8 rounded-2xl opacity-100"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Number & Title */}
                <div className="lg:col-span-5 flex items-start gap-6">
                  <span className="font-mono text-sm sm:text-base text-[#890149] font-bold mt-1">
                    {service.number}
                  </span>
                  <div>
                    <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-[#24121B] group-hover:text-[#890149] transition-colors">
                      {service.title}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <div className="lg:col-span-4">
                  <p className="text-sm sm:text-base text-[#24121B]/80 font-light leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Deliverables Pills */}
                <div className="lg:col-span-3 flex flex-wrap gap-2">
                  {service.deliverables.map((item) => (
                    <span
                      key={item}
                      className="px-2.5 py-1 rounded-full bg-white text-[11px] font-medium text-[#24121B]/80 border border-[#24121B]/10 group-hover:border-[#890149]/20 transition-colors"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ServicesSection;
