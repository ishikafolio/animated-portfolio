"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

/**
 * CustomCursor
 * 
 * Accessible Custom Pointer Motif:
 * - Strictly pointer-events-none so it NEVER intercepts clicks or selections
 * - Automatically hidden on touch devices (pointer: coarse)
 * - Automatically disabled if prefers-reduced-motion is active
 * - Smooth GSAP quickTo tracking for lag-free performance
 * - Expands subtly on hover over clickable elements (links, buttons, inputs)
 */
export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    // Only enable on desktop pointer devices
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (isTouch || prefersReducedMotion) return;

    const cursor = cursorRef.current;
    const ring = ringRef.current;
    if (!cursor || !ring) return;

    // GSAP quickTo setters for latency-free cursor follow
    const cursorX = gsap.quickTo(cursor, "x", { duration: 0.15, ease: "power3" });
    const cursorY = gsap.quickTo(cursor, "y", { duration: 0.15, ease: "power3" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.35, ease: "power3" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.35, ease: "power3" });

    const handleMouseMove = (e: MouseEvent) => {
      if (!visible) setVisible(true);
      cursorX(e.clientX);
      cursorY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    };

    const handleMouseLeave = () => {
      setVisible(false);
    };

    const handleMouseEnter = () => {
      setVisible(true);
    };

    // Detect clickable element hovers
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isInteractive =
        target.closest("a") ||
        target.closest("button") ||
        target.closest("input") ||
        target.closest("textarea") ||
        target.closest("select") ||
        target.closest("[role='button']");

      setHovered(!!isInteractive);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseover", handleMouseOver, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseover", handleMouseOver);
    };
  }, [visible]);

  return (
    <div className="hidden lg:block pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Center Dot */}
      <div
        ref={cursorRef}
        className={`fixed top-0 left-0 w-2 h-2 -ml-1 -mt-1 rounded-full bg-[#890149] transition-opacity duration-300 pointer-events-none ${
          visible ? "opacity-100" : "opacity-0"
        } ${hovered ? "scale-0" : "scale-100"}`}
      />

      {/* Outer Follower Ring */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 rounded-full border border-[#890149]/60 transition-all duration-300 pointer-events-none ${
          visible ? "opacity-100" : "opacity-0"
        } ${
          hovered
            ? "w-10 h-10 -ml-5 -mt-5 bg-[#890149]/15 border-[#890149] scale-100"
            : "w-6 h-6 -ml-3 -mt-3 scale-75"
        }`}
      />
    </div>
  );
}

export default CustomCursor;

