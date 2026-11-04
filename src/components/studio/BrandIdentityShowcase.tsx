"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, Sparkles } from "lucide-react";

export default function BrandIdentityShowcase() {
  const [veloraTab, setVeloraTab] = useState<"leather" | "skincare">("leather");
  const [activeCopied, setActiveCopied] = useState<string | null>(null);

  const copyColor = (hex: string) => {
    navigator.clipboard?.writeText(hex);
    setActiveCopied(hex);
    setTimeout(() => setActiveCopied(null), 1500);
  };

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
  ];

  return (
    <div className="w-full flex flex-col gap-16 lg:gap-24 pt-12 pb-6">
      {/* =========================================================================
          01B: EARTHKIND SUSTAINABLE LIVING BRAND IDENTITY
          ========================================================================= */}
      <section
        id="showcase-earthkind"
        className="w-full rounded-3xl bg-[#14221C] border border-[#819845]/20 p-6 sm:p-8 lg:p-12 shadow-2xl relative overflow-hidden"
        aria-label="EarthKind Brand Identity System"
      >
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[#819845]/20">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#819845]" />
              <span className="font-mono text-xs uppercase tracking-widest text-[#819845]">
                01B / BRAND IDENTITY SYSTEM
              </span>
            </div>
            <h3 className="font-cubao text-3xl sm:text-4xl lg:text-5xl text-[#F3EFE3] uppercase tracking-tight">
              EarthKind — A world held with care.
            </h3>
            <p className="font-sans text-sm sm:text-base text-[#D0DEC9] mt-2 max-w-2xl leading-relaxed">
              An eco-living and personal care identity combining an organic sheltering mark with editorial typography, tactile unboxing packaging, and mobile commerce.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0 font-mono text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#F3EFE3]">
              <span className="text-[#819845]">Typography:</span>
              <span>Fraunces + DM Sans</span>
            </div>
          </div>
        </div>

        {/* COLOR PALETTE STRIP */}
        <div className="py-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#819845]/15">
          <span className="font-mono text-xs uppercase text-[#819845] tracking-wider">
            Brand Palette (Tap to copy hex)
          </span>
          <div className="flex flex-wrap gap-2.5">
            {earthKindColors.map((c) => (
              <button
                key={c.hex}
                type="button"
                onClick={() => copyColor(c.hex)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/20 transition-transform active:scale-95 ${c.bg} ${c.text}`}
                title={`Copy ${c.hex}`}
              >
                <span className="text-xs font-semibold">{c.name}</span>
                <span className="font-mono text-[11px] opacity-85">{c.hex}</span>
                {activeCopied === c.hex ? <Check size={12} /> : null}
              </button>
            ))}
          </div>
        </div>

        {/* MASTER EDITORIAL COLLAGE */}
        <div className="mt-8 relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-[#0D1813] group">
          <Image
            src="/projects/brand-identity/earthkind-brand-identity.png"
            alt="EarthKind editorial brand identity collage — water bottle, packaging box, tote bag, mobile store, stationery"
            fill
            sizes="(max-width: 1024px) 100vw, 1200px"
            className="object-contain object-center transition-transform duration-700 group-hover:scale-[1.01]"
            priority
          />
        </div>

        {/* TOUCHPOINT ANNOTATION PILLS */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 font-mono text-[11px] text-[#D0DEC9]">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <span className="block text-[#819845] font-semibold mb-0.5">01 / The Mark</span>
            <span>Abstract leaf & protective sheltering hand</span>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <span className="block text-[#819845] font-semibold mb-0.5">02 / Bottle & Canister</span>
            <span>Matte cream with wood cap & bamboo toothbrush</span>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <span className="block text-[#819845] font-semibold mb-0.5">03 / Unboxing Mailer</span>
            <span>FSC kraft box with patterned tissue & card</span>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <span className="block text-[#819845] font-semibold mb-0.5">04 / Canvas Shopper</span>
            <span>Screen-printed organic cotton tote bag</span>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 col-span-2 sm:col-span-1">
            <span className="block text-[#819845] font-semibold mb-0.5">05 / Digital Shop</span>
            <span>Mobile product PDP & cart interaction</span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          01C: VÉLORA LUXURY GOODS & BOTANICAL WELLNESS
          ========================================================================= */}
      <section
        id="showcase-velora"
        className="w-full rounded-3xl bg-[#1C1715] border border-[#B7A391]/25 p-6 sm:p-8 lg:p-12 shadow-2xl relative overflow-hidden"
        aria-label="Vélora Brand Identity System"
      >
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[#B7A391]/20">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#B7A391]" />
              <span className="font-mono text-xs uppercase tracking-widest text-[#B7A391]">
                01C / BRAND IDENTITY & PACKAGING
              </span>
            </div>
            <h3 className="font-cubao text-3xl sm:text-4xl lg:text-5xl text-[#F0E8DC] uppercase tracking-tight">
              Vélora — Everyday, elevated.
            </h3>
            <p className="font-sans text-sm sm:text-base text-[#D8CEBC] mt-2 max-w-2xl leading-relaxed">
              A dual luxury identity encompassing bespoke leather handbags and clean botanical skincare — structured through warm mineral palettes and sculptural tactile forms.
            </p>
          </div>

          {/* DUAL LINE SWITCHER TABS */}
          <div className="flex items-center p-1.5 rounded-2xl bg-white/5 border border-white/10 shrink-0">
            <button
              type="button"
              onClick={() => setVeloraTab("leather")}
              aria-pressed={veloraTab === "leather"}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider transition-all ${
                veloraTab === "leather"
                  ? "bg-[#642D23] text-white shadow-md"
                  : "text-[#B7A391] hover:text-[#F0E8DC]"
              }`}
            >
              Leather Goods
            </button>
            <button
              type="button"
              onClick={() => setVeloraTab("skincare")}
              aria-pressed={veloraTab === "skincare"}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider transition-all ${
                veloraTab === "skincare"
                  ? "bg-[#3F523B] text-white shadow-md"
                  : "text-[#B7A391] hover:text-[#F0E8DC]"
              }`}
            >
              Botanical Skincare
            </button>
          </div>
        </div>

        {/* COLOR PALETTE FOR ACTIVE LINE */}
        <div className="py-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#B7A391]/15">
          <span className="font-mono text-xs uppercase text-[#B7A391] tracking-wider">
            {veloraTab === "leather" ? "Leather Goods Palette" : "Skincare Palette"} (Tap to copy)
          </span>
          <div className="flex flex-wrap gap-2.5">
            {(veloraTab === "leather" ? veloraLeatherColors : veloraSkincareColors).map((c) => (
              <button
                key={c.hex}
                type="button"
                onClick={() => copyColor(c.hex)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/20 transition-transform active:scale-95 ${c.bg} ${c.text}`}
              >
                <span className="text-xs font-semibold">{c.name}</span>
                <span className="font-mono text-[11px] opacity-85">{c.hex}</span>
                {activeCopied === c.hex ? <Check size={12} /> : null}
              </button>
            ))}
          </div>
        </div>

        {/* ACTIVE SHOWCASE VISUAL */}
        <div className="mt-8 relative w-full aspect-[4/5] sm:aspect-[16/11] lg:aspect-[16/10] rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-[#120E0D] group">
          {veloraTab === "leather" ? (
            <Image
              key="velora-leather"
              src="/projects/brand-identity/velora-leather-identity.jpg"
              alt="Vélora Leather Goods brand identity board — handbag on marble, rigid gift box, monogram pattern, dust pouch, mobile boutique"
              fill
              sizes="(max-width: 1024px) 100vw, 1200px"
              className="object-contain object-center transition-transform duration-700 group-hover:scale-[1.01]"
              priority
            />
          ) : (
            <Image
              key="velora-skincare"
              src="/projects/brand-identity/velora-skincare-identity.png"
              alt="Vélora Botanical Skincare brand moodboard — radiant cream packaging, dropper serum on limestone, flagship store, Instagram grid"
              fill
              sizes="(max-width: 1024px) 100vw, 1200px"
              className="object-contain object-center transition-transform duration-700 group-hover:scale-[1.01]"
              priority
            />
          )}
        </div>

        {/* SPECS & APPLICATION FOOTER */}
        <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-white/10 font-mono text-xs text-[#D8CEBC]/80">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B7A391]" />
            <span>
              {veloraTab === "leather"
                ? "Typography: Elegant Serif & Geometric Clean Sans · Gold-Plated Hardware"
                : "Typography: Playfair Display & Montserrat · Frosted Glass & Kraft Paper Packaging"}
            </span>
          </div>

          <span className="text-[11px] text-[#B7A391]">
            Comprehensive Identity Systems by Ishika Shrivastav
          </span>
        </div>
      </section>
    </div>
  );
}

