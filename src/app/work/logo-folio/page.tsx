import React from "react";
import CaseSummary from "@/components/studio/CaseSummary";
import BrandExplorer from "@/components/studio/BrandExplorer";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Sparkles } from "lucide-react";
import { getLogoFolioData } from "@/lib/projects";
import Badge from "@/components/shared/Badge";

export const metadata = {
  title: "Logo Folio — Six Brands. Six Stories. | Ishika Shrivastav",
  description:
    "An editorial logo design and brand identity collection featuring six distinctive fictional brand identities.",
};

export default function LogoFolioPage() {
  const data = getLogoFolioData();

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
              01
            </span>
            <span className="text-xs uppercase tracking-widest text-[#890149] font-semibold">
              {data.category}
            </span>
            <span className="text-xs uppercase tracking-widest text-[#24121B]/60 font-semibold">
              2026 Collection
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

          {/* Honest Attribution Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#24121B]/10 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-[#890149] shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-[#24121B]/75 leading-relaxed font-light">
              <strong className="text-[#24121B] font-medium">Concept Context:</strong>{" "}
              {data.processNote}
            </p>
          </div>
        </header>
        <CaseSummary kind="logo" />
        <div id="brand-room" className="case-interaction"><BrandExplorer /></div>

        {/* Master Overview Spread */}
        <section className="mb-20">
          <div className="relative aspect-[16/9] rounded-3xl overflow-hidden bg-white border border-[#24121B]/10 shadow-card">
            <Image
              src={data.overviewImage}
              alt="Logo Folio Overview - Complete visual collection of six brand concepts"
              fill
              priority
              className="object-contain p-4 sm:p-8"
              sizes="100vw"
            />
          </div>
        </section>

        {/* Six Individual Brand Case Studies */}
        <section className="space-y-16 mb-20">
          <div className="pb-6 border-b border-[#24121B]/15">
            <span className="font-mono text-xs uppercase tracking-widest text-[#890149] font-semibold">
              Visual System Deep Dive
            </span>
            <h2 className="font-display text-4xl sm:text-6xl uppercase tracking-tight text-[#24121B] mt-2">
              Six Individual Brands
            </h2>
          </div>

          <div className="space-y-16">
            {data.brands?.map((brand, idx) => (
              <div
                key={brand.slug}
                id={"brand-" + brand.slug}
                className="p-8 sm:p-12 rounded-3xl bg-white border border-[#24121B]/10 shadow-card"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-[#890149]/10 text-[#890149]">
                          0{idx + 1}
                        </span>
                        <span className="text-xs font-mono uppercase tracking-widest text-[#24121B]/60">
                          {brand.category}
                        </span>
                      </div>

                      <h3 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-[#24121B] mb-2">
                        {brand.name}
                      </h3>

                      <p className="font-medium text-sm text-[#890149] mb-4">
                        {brand.tagline}
                      </p>

                      <p className="text-sm text-[#24121B]/75 leading-relaxed font-light mb-6">
                        {brand.concept}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#24121B]/10">
                      <span className="text-xs font-mono uppercase tracking-widest text-[#24121B]/60">
                        Brand Deliverable: Concept Board & Mockup
                      </span>
                    </div>
                  </div>

                  <div className="lg:col-span-7">
                    <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-[#F3F3E7] border border-[#24121B]/10">
                      <Image
                        src={brand.panelImage}
                        alt={`${brand.name} - Brand Identity Presentation`}
                        fill
                        className="object-contain p-2 sm:p-4 hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 1024px) 100vw, 60vw"
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
            href="/#work"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#24121B] hover:text-[#890149]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Work Grid</span>
          </Link>

          <Link
            href="/work/careconnect"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#890149] text-[#F3F3E7] text-xs font-semibold uppercase tracking-wider hover:bg-[#6B0139] transition-all"
          >
            <span>Next: 02 CareConnect UI/UX</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </nav>
      </div>
    </article>
  );
}

