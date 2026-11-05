"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Pause, Play } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { CharacterExpressionName } from "@/components/home/Live2DCharacter";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
  (window as any).gsap = gsap;
  (window as any).ScrollTrigger = ScrollTrigger;
}

const Experience = createContext({ reducedMotion: false, mood: "Neutral" as CharacterExpressionName });
export const useSiteExperience = () => useContext(Experience);

export default function SiteExperience({ children }: { children: React.ReactNode }) {
  const [systemReduced, setSystemReduced] = useState(false);
  const [paused, setPaused] = useState(false);
  const [mood, setMood] = useState<CharacterExpressionName>("Neutral");

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setSystemReduced(media.matches);
    sync();

    try {
      const stored = localStorage.getItem("ishika-motion-paused");
      if (stored !== null) {
        setPaused(stored === "true");
      }
    } catch { /* Browser storage is optional. */ }

    media.addEventListener("change", sync);

    const react = (event: Event) => {
      const target = event.target instanceof Element ? event.target.closest("[data-character-mood]") : null;
      const name = target?.getAttribute("data-character-mood");
      setMood(name === "Happy" || name === "Curious" || name === "Thoughtful" ? name : "Neutral");
    };
    const neutral = () => setMood("Neutral");
    const leave = (event: PointerEvent) => { if (!event.relatedTarget) neutral(); };

    document.addEventListener("pointerover", react);
    document.addEventListener("focusin", react);
    window.addEventListener("blur", neutral);
    document.addEventListener("pointerout", leave);

    // Refresh ScrollTrigger when images and fonts settle
    const refreshScroll = () => {
      if (typeof window !== "undefined") {
        ScrollTrigger.refresh();
      }
    };

    window.addEventListener("load", refreshScroll);
    if (typeof document !== "undefined" && (document as any).fonts) {
      (document as any).fonts.ready.then(refreshScroll);
    }

    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(refreshScroll, 100);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      media.removeEventListener("change", sync);
      document.removeEventListener("pointerover", react);
      document.removeEventListener("focusin", react);
      window.removeEventListener("blur", neutral);
      document.removeEventListener("pointerout", leave);
      window.removeEventListener("load", refreshScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const reducedMotion = systemReduced || paused;

  useEffect(() => {
    document.documentElement.dataset.motion = reducedMotion ? "off" : "on";
    // When motion preference changes, refresh ScrollTrigger after DOM updates
    const t = setTimeout(() => {
      if (typeof window !== "undefined") {
        ScrollTrigger.refresh();
      }
    }, 50);
    return () => clearTimeout(t);
  }, [reducedMotion]);

  function toggle() {
    const next = !paused;
    setPaused(next);
    try {
      localStorage.setItem("ishika-motion-paused", String(next));
    } catch { /* Still works without persistence. */ }
  }

  return (
    <Experience.Provider value={{ reducedMotion, mood }}>
      {children}
      <button
        className="motion-control"
        onClick={toggle}
        aria-pressed={paused}
        disabled={systemReduced}
        title={systemReduced ? "Reduced motion follows your device preference" : "Pause or resume decorative motion"}
      >
        {reducedMotion ? <Play size={13} aria-hidden /> : <Pause size={13} aria-hidden />}
        <span>{systemReduced ? "Reduced motion" : paused ? "Motion paused" : "Pause motion"}</span>
      </button>
    </Experience.Provider>
  );
}
