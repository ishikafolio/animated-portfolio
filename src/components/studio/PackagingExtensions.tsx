"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";

export default function PackagingExtensions() {
  return (
    <div className="w-full min-h-[calc(100vh-var(--nav-height,64px))] flex flex-col justify-center gap-10 py-10 lg:py-16 scroll-mt-[calc(var(--nav-height,64px)+1rem)]">
      {/* =========================================================================
          04C: GLOW BITE ENERGY BAR FLOW-WRAP PACKAGING
          Seamlessly integrated into the forest, charcoal, olive, and warm stone palette
          ========================================================================= */}
      <section
        id="showcase-glowbite"
        className="w-full rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#132218] via-[#101A12] to-[#0D150F] border border-[#8EB897]/25 p-4 sm:p-8 lg:p-12 shadow-2xl relative overflow-hidden scroll-mt-[calc(var(--nav-height,64px)+1.5rem)]"
        aria-label="Glow Bite Energy Bar Packaging"
      >
        {/* Warm directional amber lighting accent */}
        <div
          className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#E5A830]/10 blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
          {/* LEFT: SUBSTANTIAL STAGE VISUAL (Forest & warm stone backdrop, no stark white box) */}
          <div className="lg:col-span-7 relative w-full aspect-[4/3] sm:aspect-[16/11] rounded-2xl overflow-hidden border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.8)] bg-[#0C140E] group">
            <Image
              src="/projects/packaging/glow-bite-forest-stage.jpg"
              alt="Glow Bite Energy Bar — Flow-wrap snack packaging on forest podium with dark chocolate drip and almonds"
              fill
              sizes="(max-width: 1024px) 100vw, 750px"
              className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.01]"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs font-mono text-white/90">
              <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-[#E5A830]/30 text-[#E5A830]">
                04C · FMCG Retail Packaging
              </span>
              <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white/80">
                Almond &amp; Dark Chocolate
              </span>
            </div>
          </div>

          {/* RIGHT: PROJECT DETAILS & SPECIFICATIONS */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2 font-mono text-xs uppercase tracking-widest text-[#E5A830]">
                <span className="w-2 h-2 rounded-full bg-[#E5A830] animate-pulse" />
                <span>04C / PACKAGING DESIGN</span>
              </div>

              <h3 className="font-cubao text-3xl sm:text-4xl text-[#F3F3E7] uppercase tracking-tight leading-tight">
                Glow Bite — Energy Bar
              </h3>

              <p className="font-mono text-xs text-[#E5A830] mt-1.5 uppercase font-medium">
                Almond &amp; Dark Chocolate · Healthy Energy, Anytime
              </p>

              <p className="font-sans text-sm text-[#C8D1C3] mt-3 leading-relaxed">
                Flow-wrap snack packaging engineered for high grocery-shelf contrast. Crisp white gloss foil pairs with vibrant sunshine yellow and deep cobalt blue to highlight appetite appeal alongside clean nutritional integrity.
              </p>
            </div>

            {/* SPECIFICATIONS TABLE */}
            <div className="pt-4 border-t border-white/10 space-y-2.5 font-mono text-xs">
              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-[#A2B09C]">Format</span>
                <span className="text-[#F3F3E7] font-semibold">Flow-Wrap Foil Bar (45g)</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-[#A2B09C]">Substrate</span>
                <span className="text-[#F3F3E7] font-semibold">BOPP White Barrier Film</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-[#A2B09C]">Finish</span>
                <span className="text-[#F3F3E7] font-semibold">Gloss Laminate with Spot Matt</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-[#A2B09C]">Key Flavours</span>
                <span className="text-[#E5A830] font-semibold">Almond Crunch &amp; Dark Chocolate</span>
              </div>
            </div>

            {/* ART DIRECTION CALLOUT */}
            <div className="p-3.5 rounded-xl bg-white/5 border border-[#E5A830]/20 flex items-center justify-between text-xs font-mono">
              <span className="text-white/70">Shelf Contrast</span>
              <span className="text-[#E5A830] font-semibold">High-Vibration Optical Blocking</span>
            </div>
          </div>
        </div>
      </section>

      {/* TRANSITION CUE INTO CHAPTER 05: SOCIAL MEDIA */}
      <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-white/60">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#B6FF00]" />
          <span>Next Discipline: Omnichannel Campaigns &amp; Kinetic Typography</span>
        </div>
        <a
          href="#chapter-social"
          className="inline-flex items-center gap-2 text-[#8EB897] hover:text-white transition-colors"
        >
          <span>Scroll into 05 / Social Media</span>
          <ArrowUpRight size={14} className="text-[#B6FF00]" />
        </a>
      </div>
    </div>
  );
}
