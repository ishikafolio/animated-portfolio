import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, ShieldAlert, Sparkles, ExternalLink } from "lucide-react";
import { getCareConnectData } from "@/lib/projects";
import Badge from "@/components/shared/Badge";

export const metadata = {
  title: "CareConnect — Mobile UI/UX Case Study | Ishika Shrivastav",
  description:
    "A ten-screen mobile UI concept designed to help parents manage everyday medications and family caregivers stay coordinated.",
};

export default function CareConnectPage() {
  const data = getCareConnectData();

  const parentScreens = data.screens.slice(0, 6);
  const caregiverScreens = data.screens.slice(6, 10);

  return (
    <article className="pt-28 sm:pt-36 pb-24 px-4 sm:px-6 lg:px-8 bg-[#FAF8F5] min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Back Link */}
        <Link
          href="/#work"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#24121B]/70 hover:text-[#5146A6] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Selected Work</span>
        </Link>

        {/* Project Header */}
        <header className="pb-12 border-b border-[#25304A]/15 mb-12">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-full bg-[#5146A6] text-white">
              02
            </span>
            <span className="text-xs uppercase tracking-widest text-[#5146A6] font-semibold">
              {data.category}
            </span>
            <span className="text-xs uppercase tracking-widest text-[#25304A]/60 font-semibold">
              10 Screens
            </span>
          </div>

          <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl uppercase tracking-tight text-[#25304A] leading-[0.92] mb-4">
            {data.title}
          </h1>

          <p className="font-medium text-xl sm:text-2xl text-[#5146A6] mb-6">
            {data.tagline}
          </p>

          <p className="text-base sm:text-lg text-[#25304A]/80 max-w-3xl font-light leading-relaxed mb-8">
            {data.summary}
          </p>

          {/* Prototype CTA Banner */}
          <div className="p-6 rounded-2xl bg-white border border-[#5146A6]/20 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#5146A6] font-bold block mb-1">
                Interactive Demonstration
              </span>
              <p className="text-sm text-[#25304A]/80 font-light">
                Explore the bundled offline HTML click-through prototype.
              </p>
            </div>
            <a
              href="/projects/careconnect/prototype/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#5146A6] text-white text-xs sm:text-sm font-semibold uppercase tracking-wider hover:bg-[#3E3486] transition-all shadow-md active:scale-95 shrink-0"
            >
              <span>Launch Prototype Demo</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Honest Concept Disclaimer */}
          <div className="p-4 rounded-xl bg-[#EFECFA] border border-[#5146A6]/20 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-[#5146A6] shrink-0 mt-0.5" />
            <p className="text-xs text-[#25304A]/80 leading-relaxed font-light">
              <strong className="font-medium text-[#25304A]">Demonstration Notice:</strong>{" "}
              CareConnect is a speculative design concept and interface demonstration. Emergency calling, medicine adherence tracking, and data sharing are simulated demonstrations and not functional healthcare services.
            </p>
          </div>
        </header>

        {/* Master Overview Spread */}
        <section className="mb-20">
          <div className="relative aspect-[16/10] rounded-3xl overflow-hidden bg-white border border-[#5146A6]/20 shadow-card">
            <Image
              src={data.overviewImage}
              alt="CareConnect complete 10-screen interface overview"
              fill
              priority
              className="object-contain p-4 sm:p-8"
              sizes="100vw"
            />
          </div>
        </section>

        {/* Parent Flow: Screens 01-06 */}
        <section className="mb-20">
          <div className="pb-6 border-b border-[#25304A]/15 mb-8">
            <span className="font-mono text-xs uppercase tracking-widest text-[#5146A6] font-semibold">
              User Experience Flow 01
            </span>
            <h2 className="font-display text-4xl sm:text-6xl uppercase tracking-tight text-[#25304A] mt-2">
              Parent Experience (Screens 01–06)
            </h2>
            <p className="text-sm text-[#25304A]/70 max-w-2xl font-light mt-2">
              Large touch targets, high legibility, gentle reassuring copy, and simple daily check-in states.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {parentScreens.map((screen, idx) => (
              <div
                key={screen.title}
                className="rounded-2xl bg-white border border-[#5146A6]/15 overflow-hidden shadow-sm hover:shadow-card transition-all group"
              >
                <div className="relative aspect-[9/16] bg-[#FAF8F5] p-3 flex items-center justify-center">
                  <Image
                    src={screen.src}
                    alt={`CareConnect Screen 0${idx + 1}: ${screen.title}`}
                    fill
                    className="object-contain p-2 group-hover:scale-[1.03] transition-transform duration-300"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                </div>
                <div className="p-4 border-t border-[#5146A6]/10">
                  <span className="font-mono text-[10px] uppercase text-[#5146A6] font-bold block mb-1">
                    Screen 0{idx + 1} · {screen.user}
                  </span>
                  <h3 className="font-display text-base uppercase text-[#25304A]">
                    {screen.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Caregiver Flow: Screens 07-10 */}
        <section className="mb-20">
          <div className="pb-6 border-b border-[#25304A]/15 mb-8">
            <span className="font-mono text-xs uppercase tracking-widest text-[#5146A6] font-semibold">
              User Experience Flow 02
            </span>
            <h2 className="font-display text-4xl sm:text-6xl uppercase tracking-tight text-[#25304A] mt-2">
              Caregiver Experience (Screens 07–10)
            </h2>
            <p className="text-sm text-[#25304A]/70 max-w-2xl font-light mt-2">
              Clear status updates, remote medicine schedule management, and transparent sharing permissions.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {caregiverScreens.map((screen, idx) => (
              <div
                key={screen.title}
                className="rounded-2xl bg-white border border-[#5146A6]/15 overflow-hidden shadow-sm hover:shadow-card transition-all group"
              >
                <div className="relative aspect-[9/16] bg-[#FAF8F5] p-3 flex items-center justify-center">
                  <Image
                    src={screen.src}
                    alt={`CareConnect Screen 0${idx + 7}: ${screen.title}`}
                    fill
                    className="object-contain p-2 group-hover:scale-[1.03] transition-transform duration-300"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
                <div className="p-4 border-t border-[#5146A6]/10">
                  <span className="font-mono text-[10px] uppercase text-[#5146A6] font-bold block mb-1">
                    Screen 0{idx + 7} · {screen.user}
                  </span>
                  <h3 className="font-display text-base uppercase text-[#25304A]">
                    {screen.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Design System Reference */}
        <section className="mb-20">
          <div className="pb-6 border-b border-[#25304A]/15 mb-8">
            <span className="font-mono text-xs uppercase tracking-widest text-[#5146A6] font-semibold">
              Project Design Foundation
            </span>
            <h2 className="font-display text-4xl sm:text-6xl uppercase tracking-tight text-[#25304A] mt-2">
              Design System & Style Guide
            </h2>
          </div>

          <div className="relative aspect-[16/10] rounded-3xl overflow-hidden bg-white border border-[#5146A6]/20 shadow-card">
            <Image
              src={data.styleGuideImage}
              alt="CareConnect mobile design system style guide"
              fill
              className="object-contain p-4 sm:p-8"
              sizes="100vw"
            />
          </div>
        </section>

        {/* Footer Navigation */}
        <nav
          className="pt-12 border-t border-[#25304A]/15 flex flex-col sm:flex-row justify-between items-center gap-6"
          aria-label="Project Pagination"
        >
          <Link
            href="/work/logo-folio"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#25304A] hover:text-[#5146A6]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous: 01 Logo Folio</span>
          </Link>

          <Link
            href="/work/no-cheat-progelato"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#5146A6] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#3E3486] transition-all"
          >
            <span>Next: 03A No Cheat Progelato</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </nav>
      </div>
    </article>
  );
}

