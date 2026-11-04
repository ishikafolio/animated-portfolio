"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useSiteExperience } from "./SiteExperience";

export interface AaraRitualProps {
  theme?: "dark" | "light";
  showEyebrow?: boolean;
  showArchiveRow?: boolean;
}

const OBJECTS = [
  {
    name: "The collection",
    image: "/projects/aara/aara-cover.webp",
    note: "Forest, olive and parchment bring the cartons, tin and printed pieces into one quiet visual family.",
    isCover: true,
  },
  {
    name: "Botanical carton",
    image: "/projects/aara/aara-ivory-carton-crop.webp",
    note: "Fine botanical illustration sits against a pale ground, giving the typography room to breathe.",
    isCover: false,
  },
  {
    name: "Forest carton",
    image: "/projects/aara/aara-forest-carton-crop.webp",
    note: "A darker companion creates contrast within the family while retaining the same typographic character.",
    isCover: false,
  },
  {
    name: "The tea tin",
    image: "/projects/aara/aara-tea-tin-crop.webp",
    note: "Olive colour, a metallic rim and a restrained crest give the storage tin its own material character.",
    isCover: false,
  },
  {
    name: "A personal note",
    image: "/projects/aara/aara-stationery-crop.webp",
    note: "The identity extends to cards and stationery, carrying the same calm into smaller printed moments.",
    isCover: false,
  },
];

export default function AaraRitual({
  theme = "dark",
  showArchiveRow = true,
}: AaraRitualProps) {
  const [selected, setSelected] = useState(0);
  const [ritual, setRitual] = useState(false);
  const { reducedMotion } = useSiteExperience();
  const item = OBJECTS[selected];

  const isDark = theme === "dark";

  return (
    <section
      className={`aara-ritual-showcase ${isDark ? "theme-forest text-[#F3F3E7]" : "text-[#1e3a2b]"} w-full max-w-full min-w-0`}
      aria-labelledby="ritual-title"
    >
      {/* =========================================================================
          MOBILE HEADING (Visible only on < lg, establishes chapter entrance)
          ========================================================================= */}
      <div className="flex lg:hidden flex-col w-full max-w-full min-w-0 mb-4 px-1">
        <div className="flex items-center gap-2 mb-1.5 font-mono text-xs text-[#8EB897] uppercase tracking-widest font-semibold">
          <span className="w-2 h-2 rounded-full bg-[#8EB897] animate-pulse" />
          <span>03B / PACKAGING DESIGN</span>
        </div>
        <h2 className="font-cubao text-2xl sm:text-3xl text-[#F3F3E7] uppercase tracking-tight leading-[1.08] mb-1.5 break-words">
          Aara — Tea & Stillness
        </h2>
        <p className="font-mono text-[10px] sm:text-[11px] tracking-wider text-[#8EB897]/90 uppercase mb-1 break-words">
          Make room for a ritual · An invitation to slow down
        </p>
        <p className="font-sans text-xs sm:text-[13px] text-[#B6C6B8] leading-relaxed break-words">
          Explore the objects and details of an imagined tea identity.
        </p>
      </div>

      {/* =========================================================================
          RESPONSIVE TWO-COLUMN COMPOSITION (Desktop: Arch Left + Content Right)
          ========================================================================= */}
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 xl:gap-12 items-center my-auto">
        {/* LEFT COLUMN (Desktop): FOCAL ARCHED ARTWORK FRAME (~50% width on desktop) */}
        <div className="lg:col-span-6 w-full flex flex-col items-center justify-center my-auto">
          <div className="ritual-stage relative w-full max-w-[520px] aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3.1] h-auto lg:h-[min(450px,calc(100vh-var(--nav-height,64px)-150px))] rounded-[44%_44%_14px_14px] sm:rounded-[44%_44%_16px_16px] overflow-hidden bg-gradient-to-b from-[#233B2B] via-[#1A2E20] to-[#122219] border border-[#B6C6B8]/30 shadow-2xl flex items-center justify-center p-2.5 sm:p-3 select-none">
            {/* Decorative orbit arc cleanly clipped within the frame */}
            <div
              className="ritual-orbit absolute inset-2.5 sm:inset-3 border border-[#8EB897]/25 rounded-[inherit] pointer-events-none"
              aria-hidden="true"
            />

            {/* Selected artwork with generous fill to eliminate empty dead margins */}
            <div
              className="ritual-image absolute inset-2.5 sm:inset-3 pb-5 flex items-center justify-center overflow-hidden"
              key={`aara-frame-${item.image}`}
            >
              <Image
                src={item.image}
                alt={`Aara concept — ${item.name}`}
                fill
                sizes="(max-width: 1024px) 95vw, 600px"
                className={`transition-all duration-500 will-change-transform ${
                  item.isCover
                    ? "object-cover object-center scale-[1.02]"
                    : "object-contain object-center scale-[1.03]"
                }`}
                priority
              />
            </div>

            {ritual && !reducedMotion && (
              <div className="tea-steam" aria-hidden="true">
                <i /><i /><i />
              </div>
            )}

            {/* Micro Caption anchored cleanly at bottom of arch */}
            <span className="ritual-note absolute bottom-2 text-center w-full font-mono text-[10px] text-[#8EB897] tracking-widest uppercase">
              Aara / {item.name}
            </span>
          </div>

          {/* Micro caption for accessibility on all screens */}
          <span className="sr-only">Currently inspecting: Aara {item.name}</span>
        </div>

        {/* RIGHT COLUMN (Desktop): HEADINGS, TABS, DETAILS & ACTIONS */}
        <div className="lg:col-span-6 w-full flex flex-col justify-center min-w-0">
          {/* DESKTOP HEADING (Hidden on mobile to avoid duplication) */}
          <div className="hidden lg:flex flex-col mb-2.5">
            <div className="flex items-center gap-2 mb-1 font-mono text-xs text-[#8EB897] uppercase tracking-widest font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#8EB897] animate-pulse" />
              <span>03B / PACKAGING DESIGN</span>
            </div>
            <h2
              id="ritual-title"
              className="font-cubao text-3xl sm:text-4xl lg:text-4xl xl:text-[2.65rem] text-[#F3F3E7] uppercase tracking-tight leading-[1.05] mb-1.5 break-words"
            >
              Aara — Tea & Stillness
            </h2>
            <p className="font-mono text-[11px] text-[#8EB897]/90 uppercase tracking-wider mb-0.5 break-words">
              Make room for a ritual · An invitation to slow down
            </p>
            <p className="font-sans text-xs sm:text-[13px] text-[#B6C6B8] leading-relaxed break-words">
              Explore the objects and details of an imagined tea identity.
            </p>
          </div>

          {/* FIVE COLLECTION TABS (Wrap comfortably into rows, comfortable 36px tap targets) */}
          <div
            className="ritual-options flex flex-wrap gap-2 my-1.5 w-full max-w-full min-w-0"
            role="tablist"
            aria-label="Explore Aara collection objects"
          >
            {OBJECTS.map((o, i) => {
              const isSelected = i === selected;
              return (
                <button
                  key={o.name}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setSelected(i)}
                  className={`min-h-[34px] px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all focus-visible:ring-2 focus-visible:ring-[#F3F3E7] focus:outline-none shrink-0 ${
                    isSelected
                      ? "bg-[#F3F3E7] text-[#122219] font-bold shadow-md border border-[#F3F3E7]"
                      : "bg-white/5 text-[#B6C6B8] hover:text-[#F3F3E7] hover:bg-white/10 border border-[#B6C6B8]/40"
                  }`}
                >
                  {o.name}
                </button>
              );
            })}
          </div>

          {/* SELECTED OBJECT DESCRIPTION (Reserved stable min-height prevents layout shifts) */}
          <div
            className="ritual-description pt-2 mt-1 border-t border-[#8EB897]/25 min-h-[56px] sm:min-h-[60px] w-full max-w-full min-w-0"
            aria-live="polite"
          >
            <h3 className="font-cubao text-xs sm:text-sm text-[#F3F3E7] mb-0.5 uppercase break-words">
              {item.name}
            </h3>
            <p className="text-xs sm:text-[13px] text-[#B6C6B8] leading-relaxed font-sans break-words">
              {item.note}
            </p>
          </div>

          {/* QUIET MOMENT INTERACTION BUTTON */}
          <button
            className="ritual-start min-h-[36px] py-1 border-b border-[#8EB897]/30 flex items-center justify-between text-xs sm:text-sm font-semibold tracking-wide text-[#F3F3E7] hover:text-white transition-colors cursor-pointer w-full max-w-full mt-1.5 focus-visible:ring-2 focus-visible:ring-[#F3F3E7] focus:outline-none"
            aria-pressed={ritual}
            onClick={() => setRitual((v) => !v)}
          >
            <span>{ritual ? "Close the quiet moment" : "Take a quiet moment"}</span>
            <span aria-hidden="true" className="font-mono text-base">↗</span>
          </button>

          {ritual && (
            <p
              className="ritual-message font-serif italic text-xs text-[#E2E8DF] mt-1.5 bg-white/5 p-2 rounded-lg border border-white/10 break-words max-w-full"
              role="status"
            >
              A small pause. A slower breath. Nothing else to do.
            </p>
          )}

          {/* STANDALONE ARCHIVE ROW (Only if showArchiveRow is enabled) */}
          {showArchiveRow && (
            <div className="mt-3 pt-2.5 border-t border-[#8EB897]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full max-w-full min-w-0">
              <p className="text-[11px] font-mono text-[#B6C6B8]/75 break-words">
                Uncoated FSC kraft · Brushed metallic tin
              </p>
              <Link
                href="/work/aara"
                className="w-full sm:w-auto inline-flex items-center justify-between sm:justify-start gap-2 px-3.5 py-1.5 min-h-[36px] rounded-xl bg-[#1B3222] hover:bg-[#25442E] border border-[#8EB897]/50 hover:border-[#8EB897] text-[#F3F3E7] font-semibold text-xs tracking-wider uppercase transition-all shadow-md group shrink-0"
              >
                <span>The Aara concept archive</span>
                <ArrowUpRight
                  size={13}
                  className="text-[#8EB897] group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                />
              </Link>
            </div>
          )}

          <p className="studio-small text-[10px] text-[#B6C6B8]/60 mt-2 leading-tight break-words">
            A self-initiated concept. Detail views are crops of the supplied presentation; no additional tea variants or production claims are implied.
          </p>
        </div>
      </div>
    </section>
  );
}
