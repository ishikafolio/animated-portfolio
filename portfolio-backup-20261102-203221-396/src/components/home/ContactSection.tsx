"use client";

import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, CheckCircle2, Mail, Send } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function ContactSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "Brand Identity",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      if (leftColRef.current) {
        gsap.from(leftColRef.current, {
          opacity: 0,
          y: 28,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: leftColRef.current,
            start: "top 88%",
            once: true,
          },
        });
      }

      if (rightColRef.current) {
        gsap.from(rightColRef.current, {
          opacity: 0,
          y: 28,
          duration: 0.8,
          delay: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: rightColRef.current,
            start: "top 88%",
            once: true,
          },
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
  };

  return (
    <section
      ref={containerRef}
      id="contact"
      className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#F3F3E7] border-t border-[#24121B]/15 relative z-10"
      aria-label="Contact Section"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Oversized Editorial Statement */}
          <div ref={leftColRef} className="lg:col-span-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono text-xs uppercase tracking-widest text-[#890149] bg-[#890149]/10 px-3 py-1 rounded-full font-semibold">
                Start a Conversation
              </span>
              <span className="text-xs uppercase tracking-widest text-[#24121B]/60 font-semibold">
                Contact
              </span>
            </div>

            <h2 className="font-display text-5xl sm:text-7xl lg:text-8xl uppercase tracking-tight text-[#24121B] leading-[0.92] mb-6">
              Let&apos;s Build Together.
            </h2>

            <p className="text-base sm:text-lg text-[#24121B]/80 font-light leading-relaxed mb-8 max-w-lg">
              Whether you are looking to define a bold new brand identity, design an intuitive mobile application, or craft a distinctive packaging range, I would love to hear from you.
            </p>

            <div className="space-y-4 pt-4 border-t border-[#24121B]/15">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-[#890149]" />
                <a
                  href="mailto:ishikashrivastav@gmail.com"
                  className="font-medium text-[#24121B] hover:text-[#890149] transition-colors underline underline-offset-4 decoration-[#890149]/30"
                >
                  ishikashrivastav@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="font-mono text-xs text-[#890149] font-bold">TEL:</span>
                <a
                  href="tel:+917777958649"
                  className="font-medium text-[#24121B] hover:text-[#890149] transition-colors"
                >
                  +91 77779 58649
                </a>
              </div>
              <p className="text-xs text-[#24121B]/60 font-mono">
                Typical response time: within 24–48 hours · Based in India · Global Remote
              </p>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div ref={rightColRef} className="lg:col-span-6">
            <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#24121B]/10 shadow-card">
              {submitted ? (
                <div className="py-12 text-center flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-[#890149]/10 text-[#890149] flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-display text-3xl uppercase tracking-tight text-[#24121B] mb-2">
                    Message Received!
                  </h3>
                  <p className="text-sm text-[#24121B]/70 max-w-md mb-6 leading-relaxed">
                    Thank you for reaching out, {formData.name}. I have received your note and will get back to you shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: "",
                        email: "",
                        category: "Brand Identity",
                        message: "",
                      });
                    }}
                    className="px-6 py-2.5 rounded-full bg-[#24121B] text-[#F3F3E7] text-xs font-semibold uppercase tracking-wider hover:bg-black transition-colors"
                  >
                    Send Another Note
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-xs font-semibold uppercase tracking-wider text-[#24121B] mb-2"
                    >
                      Your Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      placeholder="e.g. Maya Sharma"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-[#F3F3E7]/50 border border-[#24121B]/15 text-sm text-[#24121B] placeholder:text-[#24121B]/40 focus:bg-white focus:border-[#890149] transition-all"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs font-semibold uppercase tracking-wider text-[#24121B] mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="e.g. maya@company.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-[#F3F3E7]/50 border border-[#24121B]/15 text-sm text-[#24121B] placeholder:text-[#24121B]/40 focus:bg-white focus:border-[#890149] transition-all"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="category"
                      className="block text-xs font-semibold uppercase tracking-wider text-[#24121B] mb-2"
                    >
                      Project Interest
                    </label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-[#F3F3E7]/50 border border-[#24121B]/15 text-sm text-[#24121B] focus:bg-white focus:border-[#890149] transition-all"
                    >
                      <option value="Brand Identity">Brand Identity & Logo Design</option>
                      <option value="UI/UX Design">UI/UX & Mobile App Product Design</option>
                      <option value="Packaging Design">Packaging & Tactile Range</option>
                      <option value="Design System">Design System & Guidelines</option>
                      <option value="Other">General Inquiry / Collaboration</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-xs font-semibold uppercase tracking-wider text-[#24121B] mb-2"
                    >
                      Project Brief or Message
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={4}
                      placeholder="Tell me about your timeline, vision, or scope..."
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-[#F3F3E7]/50 border border-[#24121B]/15 text-sm text-[#24121B] placeholder:text-[#24121B]/40 focus:bg-white focus:border-[#890149] transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-full bg-[#890149] text-[#F3F3E7] font-semibold uppercase tracking-wider text-xs sm:text-sm hover:bg-[#6B0139] transition-all flex items-center justify-center gap-2 shadow-md active:scale-[0.99] focus-visible:outline-[#890149]"
                  >
                    <span>Send Message</span>
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
