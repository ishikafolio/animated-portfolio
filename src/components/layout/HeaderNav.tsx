"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, ChevronDown, Menu, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export const DISCIPLINES = [
  {
    num: "01",
    label: "Logo Folio",
    leadProject: "Study of Individual Marks & Monograms",
    href: "/#chapter-logofolio",
  },
  {
    num: "02",
    label: "Brand Identity",
    leadProject: "Complete Systems · EarthKind · Vélora · NEXA",
    href: "/#chapter-identity",
  },
  {
    num: "03",
    label: "UI/UX Design",
    leadProject: "CareConnect Healthcare Mobile System",
    href: "/#intro-uiux",
  },
  {
    num: "04",
    label: "Packaging Design",
    leadProject: "Progelato · Aara · Glow Bite",
    href: "/#packaging",
  },
  {
    num: "05",
    label: "Social Media",
    leadProject: "Nike AirMax · Red Bull · Frutta · October",
    href: "/#chapter-social",
  },
  {
    num: "06",
    label: "Flyer Design",
    leadProject: "Drag Studio · Naturéa · Streetwear · Street Roll",
    href: "/#chapter-flyers",
  },
  {
    num: "07",
    label: "AI Creatives",
    leadProject: "Spiti Himalayan Expeditions · Concept Labs",
    href: "/#chapter-ai",
  },
];

const NAV_LINKS = [
  { label: "Studio", href: "/#studio" },
  { label: "About", href: "/#about" },
  { label: "Services", href: "/#services" },
  { label: "Play", href: "/#experiments" },
  { label: "Contact", href: "/#contact" },
];

export function HeaderNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [workOpen, setWorkOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const menuButton = useRef<HTMLButtonElement>(null);
  const menuPanel = useRef<HTMLDivElement>(null);
  const workDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close Work dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        workDropdownRef.current &&
        !workDropdownRef.current.contains(event.target as Node)
      ) {
        setWorkOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Trap focus & ESC in mobile drawer
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-3 sm:py-4",
        scrolled
          ? "bg-[#F3F3E7]/90 backdrop-blur-md shadow-xs border-b border-[#24121B]/10 py-2.5 sm:py-3"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="group flex items-center gap-1 focus-visible:outline-[#890149]"
          aria-label="Ishika Shrivastav Portfolio Home"
        >
          <span className="font-display text-2xl sm:text-3xl uppercase tracking-tight text-[#24121B] group-hover:text-[#890149] transition-colors">
            ISHIKA
          </span>
          <span className="w-2 h-2 rounded-full bg-[#890149] inline-block transition-transform group-hover:scale-125" />
        </Link>

        {/* Desktop Navigation Pill with Work Dropdown */}
        <nav
          className="hidden lg:flex items-center gap-1 bg-[#24121B]/5 border border-[#24121B]/10 rounded-full p-1.5 backdrop-blur-sm relative"
          aria-label="Primary Navigation"
        >
          {/* Work Dropdown Button */}
          <div ref={workDropdownRef} className="relative">
            <button
              type="button"
              onClick={() => setWorkOpen((v) => !v)}
              className={cn(
                "inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full transition-all cursor-pointer",
                workOpen
                  ? "bg-[#24121B] text-white"
                  : "text-[#24121B]/85 hover:text-[#890149] hover:bg-white/60"
              )}
              aria-expanded={workOpen}
              aria-haspopup="true"
            >
              <span>Work</span>
              <ChevronDown
                size={13}
                className={cn(
                  "transition-transform duration-200",
                  workOpen && "rotate-180"
                )}
              />
            </button>

            {/* Desktop Work Disciplines Flyout Menu */}
            {workOpen && (
              <div
                className="absolute top-full left-0 mt-3 w-80 rounded-2xl bg-[#1B1118]/95 backdrop-blur-xl border border-white/20 p-2 shadow-2xl z-50 flex flex-col gap-1 animate-fade-in text-[#F3F3E7]"
                role="menu"
              >
                <div className="px-3 py-2 border-b border-white/10 flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#E6ADC7]">
                    Selected Disciplines
                  </span>
                  <span className="font-mono text-[10px] text-white/50">01 — 07</span>
                </div>
                {DISCIPLINES.map((d) => (
                  <Link
                    key={d.num}
                    href={d.href}
                    onClick={() => setWorkOpen(false)}
                    className="flex flex-col px-3 py-2 rounded-xl hover:bg-white/10 transition-colors group text-left"
                    role="menuitem"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] text-[#E6ADC7] font-semibold">
                        {d.num} · {d.label}
                      </span>
                      <ArrowUpRight
                        size={12}
                        className="text-white/40 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                      />
                    </div>
                    <span className="text-[11px] text-white/60 truncate mt-0.5 font-sans">
                      {d.leadProject}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Regular Desktop Links */}
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-[#24121B]/80 hover:text-[#890149] hover:bg-white/60 rounded-full transition-all"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Action Button & Mobile Menu Toggle */}
        <div className="flex items-center gap-3">
          <Link
            href="/#contact"
            data-character-mood="Happy"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#890149] text-[#F3F3E7] text-xs font-semibold uppercase tracking-wider hover:bg-[#6B0139] transition-all shadow-sm active:scale-95 focus-visible:outline-[#890149]"
          >
            <span>Let’s Talk</span>
            <ArrowUpRight size={14} aria-hidden="true" />
          </Link>

          {/* Mobile Menu Button */}
          <button
            ref={menuButton}
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-full border border-[#24121B]/15 text-[#24121B] hover:bg-[#24121B]/5 transition-colors focus-visible:outline-[#890149]"
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            aria-label={isOpen ? "Close main menu" : "Open main menu"}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer with All 7 Disciplines */}
      {isOpen && (
        <div
          ref={menuPanel}
          id="mobile-navigation"
          className="lg:hidden fixed inset-0 top-[60px] bg-[#F3F3E7] z-40 flex flex-col justify-between gap-6 overflow-y-auto px-6 py-6 border-t border-[#24121B]/10"
        >
          {/* DISCIPLINE QUICK JUMP SECTION */}
          <div className="flex flex-col gap-3 shrink-0">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#890149] font-bold">
              Design Chapters (01 — 07)
            </span>
            <div className="grid grid-cols-1 gap-1.5">
              {DISCIPLINES.map((d) => (
                <Link
                  key={d.num}
                  href={d.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#24121B]/5 hover:bg-[#24121B]/10 transition-colors"
                >
                  <div className="flex flex-col text-left">
                    <span className="font-cubao text-base uppercase text-[#24121B]">
                      {d.num} · {d.label}
                    </span>
                    <span className="font-mono text-[10px] text-[#24121B]/60 truncate max-w-[260px]">
                      {d.leadProject}
                    </span>
                  </div>
                  <ArrowUpRight size={14} className="text-[#890149]" />
                </Link>
              ))}
            </div>
          </div>

          {/* GENERAL SITE LINKS */}
          <div className="flex flex-col gap-3 shrink-0 pt-4 border-t border-[#24121B]/10">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#24121B]/50 font-semibold">
              Explore Studio
            </span>
            <nav className="grid grid-cols-2 gap-2" aria-label="Mobile navigation">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="font-mono text-xs uppercase tracking-wider text-[#24121B] hover:text-[#890149] py-2 px-3 rounded-lg bg-white/50 border border-[#24121B]/5"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex flex-col gap-3 pt-4 shrink-0 border-t border-[#24121B]/10">
            <Link
              href="/#contact"
              data-character-mood="Happy"
              onClick={() => setIsOpen(false)}
              className="w-full py-3.5 text-center rounded-full bg-[#890149] text-[#F3F3E7] font-semibold uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-md"
            >
              <span>Start a Project</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
            <div className="flex justify-between items-center text-[11px] font-mono text-[#24121B]/60">
              <span>Ishika Shrivastav · Portfolio</span>
              <span>2026</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default HeaderNav;
