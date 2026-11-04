import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Sparkles } from "lucide-react";
import { getAaraData } from "@/lib/projects";
import Badge from "@/components/shared/Badge";

export const metadata = {
  title: "Aara — Tea & Stillness | Ishika Shrivastav",
  description:
    "A conceptual identity for an imagined Indian tea label exploring stillness through refined typography, botanical illustration, and packaging.",
};

export default function AaraPage() {
  const data = getAaraData();

  return (
    <article className="pt-28 sm:pt-36 pb-24 px-4 sm:px-6 lg:px-8 bg-[#FAF7F0] min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Back Link */}
        <Link
          href="/#work"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1E3A2B]/70 hover:text-[#1E3A2B] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Selected Work</span>
        </Link>

        {/* Project Header */}
        <header className="pb-12 border-b border-[#1E3A2B]/15 mb-12">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-full bg-[#1E3A2B] text-white">
              03B
            </span>
            <span className="text-xs uppercase tracking-widest text-[#1E3A2B] font-semibold">
              {data.category}
            </span>
            <span className="text-xs uppercase tracking-widest text-[#1E3A2B]/60 font-semibold">
              Self-Initiated Concept
            </span>
          </div>

          <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl uppercase tracking-tight text-[#1E3A2B] leading-[0.92] mb-4">
            {data.displayTitle || data.title}
          </h1>

          <p className="font-medium text-xl sm:text-2xl text-[#1E3A2B] mb-6">
            {data.headline}
          </p>

          <p className="text-base sm:text-lg text-[#1E3A2B]/80 max-w-3xl font-light leading-relaxed mb-8">
            {data.summary}
          </p>

          {/* Authentic Earthy Palette Tags */}
          <div className="flex flex-wrap items-center gap-2 mb-8">
            {data.visualLanguage?.palette?.map((color: any) => (
              <span
                key={color.name}
                className="px-3 py-1 rounded-full text-xs font-medium border border-black/10 flex items-center gap-1.5"
                style={{
                  backgroundColor: color.hex === "#F5EFEB" ? "#F5EFEB" : color.hex,
                  color: color.hex === "#F5EFEB" ? "#1E3A2B" : "#FFFFFF",
                }}
              >
                <span
                  className="w-2 h-2 rounded-full border border-black/20"
                  style={{ backgroundColor: color.hex }}
                />
                <span>{color.name} ({color.hex})</span>
              </span>
            ))}
          </div>

          {/* Honest Attribution Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#1E3A2B]/15 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-[#1E3A2B] shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-[#1E3A2B]/80 leading-relaxed font-light">
              <strong className="text-[#1E3A2B] font-medium">Concept Statement:</strong>{" "}
              Aara is a self-initiated concept exploration and visual study for an imagined Indian tea brand. Only one original master presentation image was created; detail crops below are authentic excerpts showing specific touchpoints.
            </p>
          </div>
        </header>

        {/* Master Presentation Spread */}
        <section className="mb-20">
          <div className="relative aspect-[16/10] rounded-3xl overflow-hidden bg-[#F5EFEB] border border-[#1E3A2B]/15 shadow-card">
            <Image
              src={data.coverImage}
              alt={data.coverAlt}
              fill
              priority
              className="object-contain p-4 sm:p-8"
              sizes="100vw"
            />
          </div>
        </section>

        {/* Coordinated Packaging & Touchpoints Detail Gallery */}
        <section className="space-y-16 mb-20">
          <div className="pb-6 border-b border-[#1E3A2B]/15">
            <span className="font-mono text-xs uppercase tracking-widest text-[#1E3A2B] font-semibold">
              Packaging Touchpoints
            </span>
            <h2 className="font-display text-4xl sm:text-6xl uppercase tracking-tight text-[#1E3A2B] mt-2">
              Cartons, Tin & Stationery
            </h2>
            <p className="text-sm text-[#1E3A2B]/70 max-w-2xl font-light mt-2">
              Excerpts from the master presentation showcasing packaging surfaces and botanical identity elements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.touchpoints?.map((item: any) => (
              <div
                key={item.id}
                className="p-8 rounded-3xl bg-white border border-[#1E3A2B]/10 shadow-card flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-display text-2xl sm:text-3xl uppercase tracking-tight text-[#1E3A2B] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#1E3A2B]/75 leading-relaxed font-light mb-6">
                    {item.description}
                  </p>
                </div>

                <div className="space-y-4">
                  {item.crops?.map((crop: any) => (
                    <div
                      key={crop.id}
                      className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-[#F5EFEB] border border-[#1E3A2B]/10 group"
                    >
                      <Image
                        src={crop.src}
                        alt={crop.alt}
                        fill
                        className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <span className="absolute bottom-2 right-2 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-mono text-[#1E3A2B]/70">
                        {crop.kind}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer Navigation */}
        <nav
          className="pt-12 border-t border-[#1E3A2B]/15 flex flex-col sm:flex-row justify-between items-center gap-6"
          aria-label="Project Pagination"
        >
          <Link
            href="/work/no-cheat-progelato"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1E3A2B] hover:text-[#890149]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous: 03A No Cheat Progelato</span>
          </Link>

          <Link
            href="/#work"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1E3A2B] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#14271D] transition-all"
          >
            <span>Back to Work Grid</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </nav>
      </div>
    </article>
  );
}

