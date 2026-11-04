import React from "react";
import ArtworkReveal from "@/components/studio/ArtworkReveal";
import CaseSummary from "@/components/studio/CaseSummary";
import PackagingShelf from "@/components/studio/PackagingShelf";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getProgelatoData } from "@/lib/projects";

export const metadata = {
  title: "No Cheat Progelato — Packaging System | Ishika Shrivastav",
  description:
    "A seven-flavour packaging range for No Cheat Progelato, built as a cohesive visual family across pouch design, flavour differentiation, and dielines.",
};

export default function ProgelatoPage() {
  const data = getProgelatoData();

  return (
    <article className="pt-28 sm:pt-36 pb-24 px-4 sm:px-6 lg:px-8 bg-[#F3F3E7] min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Back Link */}
        <Link
          href="/#work"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#24121B]/70 hover:text-[#890149] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Selected Work</span>
        </Link>

        {/* Project Header */}
        <header className="pb-12 border-b border-[#24121B]/15 mb-12">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-full bg-[#890149] text-[#F3F3E7]">
              03A
            </span>
            <span className="text-xs uppercase tracking-widest text-[#890149] font-semibold">
              {data.category}
            </span>
            <span className="text-xs uppercase tracking-widest text-[#24121B]/60 font-semibold">
              7 Flavours
            </span>
          </div>

          <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl uppercase tracking-tight text-[#24121B] leading-[0.92] mb-4">
            {data.title}
          </h1>

          <p className="font-medium text-xl sm:text-2xl text-[#890149] mb-6">
            {data.headline}
          </p>

          <p className="text-base sm:text-lg text-[#24121B]/80 max-w-3xl font-light leading-relaxed mb-8">
            {data.summary}
          </p>

          {/* Core Brand System Claims */}
          <div className="flex flex-wrap gap-2">
            {data.brandSystem?.claims?.map((claim: string) => (
              <span
                key={claim}
                className="px-3 py-1 rounded-full bg-white text-xs font-medium text-[#24121B] border border-black/10"
              >
                {claim}
              </span>
            ))}
          </div>
        </header>
        <CaseSummary kind="gelato" />
        <div id="flavour-library" className="case-interaction"><PackagingShelf /></div>
        <div id="artwork" className="case-interaction"><ArtworkReveal /></div>

        {/* Full-Family Podium Visual Spread */}
        <section className="mb-20">
          <div className="relative aspect-[16/10] rounded-3xl overflow-hidden bg-white border border-[#24121B]/10 shadow-card">
            <Image
              src={data.familyShotImage}
              alt="Seven colourful No Cheat Progelato pouches arranged together on stone podiums"
              fill
              priority
              className="object-contain p-4 sm:p-8"
              sizes="100vw"
            />
          </div>
        </section>

        {/* Seven Flavours Deep Dive */}
        <section className="space-y-20 mb-20">
          <div className="pb-6 border-b border-[#24121B]/15">
            <span className="font-mono text-xs uppercase tracking-widest text-[#890149] font-semibold">
              Packaging Architecture
            </span>
            <h2 className="font-display text-4xl sm:text-6xl uppercase tracking-tight text-[#24121B] mt-2">
              Flavour System & Dielines
            </h2>
            <p className="text-sm text-[#24121B]/70 max-w-2xl font-light mt-2">
              Each flavour pairs a realistic 3D stand-up pouch mockup with its corresponding flat production artboard.
            </p>
          </div>

          <div className="space-y-24">
            {data.flavours?.map((flavour: any, idx: number) => (
              <div
                key={flavour.id}
                className="p-8 sm:p-12 rounded-3xl bg-white border border-[#24121B]/10 shadow-card"
              >
                {/* Flavour Title & Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#24121B]/10 mb-8">
                  <div className="flex items-center gap-3">
                    <span
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: flavour.accentColor }}
                    />
                    <span className="font-mono text-xs font-semibold text-[#24121B]/60">
                      Flavour 0{idx + 1}
                    </span>
                    <h3 className="font-display text-3xl sm:text-4xl uppercase tracking-tight text-[#24121B]">
                      {flavour.name}
                    </h3>
                  </div>

                  <span
                    className="px-3 py-1 rounded-full text-xs font-mono font-medium text-white self-start sm:self-auto"
                    style={{ backgroundColor: flavour.accentColor }}
                  >
                    {flavour.accentColor} · {flavour.flavourCue}
                  </span>
                </div>

                {/* Flavour Descriptor & Ingredients */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[#24121B]/80 font-light mb-8 bg-[#F3F3E7]/40 p-4 rounded-2xl">
                  <div>
                    <strong className="font-medium text-[#24121B] block mb-1">
                      Taste Profile:
                    </strong>
                    {flavour.descriptor}
                  </div>
                  <div>
                    <strong className="font-medium text-[#24121B] block mb-1">
                      Ingredient Highlights:
                    </strong>
                    {flavour.ingredients}
                  </div>
                </div>

                {/* Two Visuals: 3D Mockup & Flat Dieline */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-widest text-[#24121B]/60 block mb-2">
                      3D Pouch Presentation
                    </span>
                    <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-[#F3F3E7] border border-[#24121B]/10">
                      <Image
                        src={flavour.mockupImage}
                        alt={`${flavour.name} pouch mockup`}
                        fill
                        className="object-contain p-2 hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-mono uppercase tracking-widest text-[#24121B]/60 block mb-2">
                      Production Flat Dieline Artboard
                    </span>
                    <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-[#F3F3E7] border border-[#24121B]/10">
                      <Image
                        src={flavour.flatImage}
                        alt={`${flavour.name} flat production dieline`}
                        fill
                        className="object-contain p-2 hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer Navigation */}
        <nav
          className="pt-12 border-t border-[#24121B]/15 flex flex-col sm:flex-row justify-between items-center gap-6"
          aria-label="Project Pagination"
        >
          <Link
            href="/work/careconnect"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#24121B] hover:text-[#890149]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous: 02 CareConnect UI/UX</span>
          </Link>

          <Link
            href="/work/aara"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#890149] text-[#F3F3E7] text-xs font-semibold uppercase tracking-wider hover:bg-[#6B0139] transition-all"
          >
            <span>Next: 03B Aara Tea & Stillness</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </nav>
      </div>
    </article>
  );
}

