import React from "react";
import Link from "next/link";
import { ArrowUpRight, Heart } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#24121B] text-[#F3F3E7] pt-20 pb-12 border-t border-[#F3F3E7]/10 relative overflow-hidden">
      {/* Subtle background ambient glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#890149]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Editorial Banner */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-16 border-b border-[#F3F3E7]/15">
          <div className="max-w-2xl">
            <span className="font-mono text-xs uppercase tracking-widest text-[#890149] bg-white/10 px-3 py-1 rounded-full font-semibold">
              Get In Touch
            </span>
            <h2 className="font-display text-5xl sm:text-7xl lg:text-8xl uppercase tracking-tight text-[#F3F3E7] mt-6 leading-[0.92]">
              Let&apos;s Create Something Remarkable.
            </h2>
            <p className="mt-6 text-[#F3F3E7]/70 text-base sm:text-lg max-w-xl leading-relaxed">
              Open for design inquiries, brand collaborations, and select full-time opportunities.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <a
              href="mailto:ishikashrivastav@gmail.com"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#890149] text-[#F3F3E7] font-semibold uppercase tracking-wider text-sm hover:bg-[#6B0139] transition-all shadow-lg active:scale-95 focus-visible:outline-[#F3F3E7]"
            >
              <span>ishikashrivastav@gmail.com</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
            <a
              href="tel:+917777958649"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-full bg-white/10 text-[#F3F3E7] font-semibold uppercase tracking-wider text-sm hover:bg-white/20 transition-all active:scale-95 border border-white/10"
            >
              <span>+91 77779 58649</span>
            </a>
          </div>
        </div>

        {/* Middle Navigation & Social Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-b border-[#F3F3E7]/10 text-sm">
          <div>
            <h3 className="font-display text-sm uppercase tracking-wider text-[#F3F3E7]/40 mb-4">
              Navigation
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/#work" className="text-[#F3F3E7]/80 hover:text-[#890149] transition-colors">
                  Selected Work
                </Link>
              </li>
              <li>
                <Link href="/#experience" className="text-[#F3F3E7]/80 hover:text-[#890149] transition-colors">
                  Career Experience
                </Link>
              </li>
              <li>
                <Link href="/#about" className="text-[#F3F3E7]/80 hover:text-[#890149] transition-colors">
                  About & Philosophy
                </Link>
              </li>
              <li>
                <Link href="/#services" className="text-[#F3F3E7]/80 hover:text-[#890149] transition-colors">
                  Services & Capabilities
                </Link>
              </li>
              <li>
                <Link href="/#process" className="text-[#F3F3E7]/80 hover:text-[#890149] transition-colors">
                  Creative Process
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="text-[#F3F3E7]/80 hover:text-[#890149] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm uppercase tracking-wider text-[#F3F3E7]/40 mb-4">
              Case Studies
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/work/logo-folio" className="text-[#F3F3E7]/80 hover:text-[#890149] transition-colors">
                  01 — Logo Folio
                </Link>
              </li>
              <li>
                <Link href="/work/careconnect" className="text-[#F3F3E7]/80 hover:text-[#890149] transition-colors">
                  02 — CareConnect UI/UX
                </Link>
              </li>
              <li>
                <Link href="/work/no-cheat-progelato" className="text-[#F3F3E7]/80 hover:text-[#890149] transition-colors">
                  03A — No Cheat Progelato
                </Link>
              </li>
              <li>
                <Link href="/work/aara" className="text-[#F3F3E7]/80 hover:text-[#890149] transition-colors">
                  03B — Aara Tea & Stillness
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm uppercase tracking-wider text-[#F3F3E7]/40 mb-4">
              Network
            </h3>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="https://behance.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#F3F3E7]/80 hover:text-[#890149] transition-colors inline-flex items-center gap-1"
                >
                  <span>Behance</span>
                  <ArrowUpRight className="w-3 h-3 text-[#F3F3E7]/40" />
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#F3F3E7]/80 hover:text-[#890149] transition-colors inline-flex items-center gap-1"
                >
                  <span>LinkedIn</span>
                  <ArrowUpRight className="w-3 h-3 text-[#F3F3E7]/40" />
                </a>
              </li>
              <li>
                <a
                  href="https://dribbble.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#F3F3E7]/80 hover:text-[#890149] transition-colors inline-flex items-center gap-1"
                >
                  <span>Dribbble</span>
                  <ArrowUpRight className="w-3 h-3 text-[#F3F3E7]/40" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#F3F3E7]/80 hover:text-[#890149] transition-colors inline-flex items-center gap-1"
                >
                  <span>GitHub</span>
                  <ArrowUpRight className="w-3 h-3 text-[#F3F3E7]/40" />
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm uppercase tracking-wider text-[#F3F3E7]/40 mb-4">
              Identity & Type
            </h3>
            <p className="text-xs text-[#F3F3E7]/60 leading-relaxed">
              Art direction & typography crafted with <strong className="text-[#F3F3E7]">Cubao</strong> and{" "}
              <strong className="text-[#F3F3E7]">Poppins</strong>. Built with Next.js, Tailwind CSS & GSAP.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-[#F3F3E7]/40">
              <span className="w-2.5 h-2.5 rounded-full bg-[#890149]" />
              <span>#890149 Berry Magenta</span>
            </div>
            <div className="mt-1 flex items-center gap-2 text-xs text-[#F3F3E7]/40">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F3F3E7]" />
              <span>#F3F3E7 Warm Ivory</span>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#F3F3E7]/50 gap-4">
          <p>© {currentYear} Ishika Shrivastav. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-[#890149] fill-current" />
            <span>and intentional design craft</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

