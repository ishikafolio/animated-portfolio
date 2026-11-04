"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Work", href: "/#work" },
  { label: "Experience", href: "/#experience" },
  { label: "About", href: "/#about" },
  { label: "Services", href: "/#services" },
  { label: "Process", href: "/#process" },
  { label: "Contact", href: "/#contact" },
];

export function HeaderNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

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
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-[#F3F3E7]/90 backdrop-blur-md py-3 shadow-sm border-b border-[#24121B]/10"
          : "bg-transparent py-5 sm:py-6"
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

        {/* Desktop Navigation Pill */}
        <nav
          className="hidden md:flex items-center gap-1 bg-[#24121B]/5 border border-[#24121B]/10 rounded-full p-1.5 backdrop-blur-sm"
          aria-label="Primary Navigation"
        >
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
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#890149] text-[#F3F3E7] text-xs font-semibold uppercase tracking-wider hover:bg-[#6B0139] transition-all shadow-sm active:scale-95 focus-visible:outline-[#890149]"
          >
            <span>Let&apos;s Talk</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-full bg-[#24121B]/5 text-[#24121B] hover:text-[#890149] focus-visible:outline-[#890149]"
            aria-label={isOpen ? "Close Menu" : "Open Menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 top-[65px] bg-[#F3F3E7] z-40 flex flex-col justify-between px-6 py-8 border-t border-[#24121B]/10">
          <div className="flex flex-col gap-6">
            <span className="text-xs uppercase tracking-widest text-[#890149] font-semibold">
              Navigation
            </span>
            <nav className="flex flex-col gap-4">
              {NAV_LINKS.map((link, idx) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="font-display text-4xl uppercase tracking-tight text-[#24121B] hover:text-[#890149] transition-colors flex items-center justify-between py-2 border-b border-[#24121B]/10"
                >
                  <span>{link.label}</span>
                  <span className="font-mono text-xs text-[#24121B]/40">
                    0{idx + 1}
                  </span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex flex-col gap-4 pt-6 border-t border-[#24121B]/10">
            <Link
              href="/#contact"
              onClick={() => setIsOpen(false)}
              className="w-full py-4 text-center rounded-full bg-[#890149] text-[#F3F3E7] font-semibold uppercase tracking-wider text-sm flex items-center justify-center gap-2"
            >
              <span>Start a Project</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <div className="flex justify-between items-center text-xs text-[#24121B]/60 pt-2">
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

