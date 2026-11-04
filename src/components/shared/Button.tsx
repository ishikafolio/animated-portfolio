"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isExternal?: boolean;
  magnetic?: boolean;
  children: React.ReactNode;
}

export function Button({
  href,
  variant = "primary",
  size = "md",
  isExternal = false,
  magnetic = true,
  className,
  children,
  ...props
}: ButtonProps) {
  const btnRef = useRef<HTMLButtonElement | HTMLAnchorElement | null>(null);

  useEffect(() => {
    if (!magnetic || !btnRef.current) return;

    const el = btnRef.current;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (isTouch || prefersReducedMotion) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.3, ease: "power2.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.3, ease: "power2.out" });

    const handleMouseMove = (e: Event) => {
      const me = e as MouseEvent;
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (me.clientX - centerX) * 0.18; // tasteful max ~5px
      const deltaY = (me.clientY - centerY) * 0.18;
      xTo(Math.max(-6, Math.min(6, deltaX)));
      yTo(Math.max(-6, Math.min(6, deltaY)));
    };

    const handleMouseLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.4)" });
    };

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [magnetic]);

  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-colors duration-200 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#890149] disabled:opacity-50 disabled:pointer-events-none will-change-transform";

  const sizeStyles = {
    sm: "text-xs px-4 py-2 gap-1.5",
    md: "text-sm px-6 py-3 gap-2",
    lg: "text-base px-8 py-4 gap-2.5",
  };

  const variantStyles = {
    primary:
      "bg-[#890149] text-[#F3F3E7] hover:bg-[#6B0139] shadow-md hover:shadow-lg active:scale-[0.98]",
    secondary:
      "bg-[#24121B] text-[#F3F3E7] hover:bg-black shadow-md hover:shadow-lg active:scale-[0.98]",
    outline:
      "bg-transparent text-[#24121B] border border-[#24121B]/30 hover:border-[#890149] hover:text-[#890149] active:scale-[0.98]",
    ghost:
      "bg-transparent text-[#24121B] hover:text-[#890149] hover:bg-[#890149]/5 active:scale-[0.98]",
  };

  const combinedClasses = cn(baseStyles, sizeStyles[size], variantStyles[variant], className);

  if (href) {
    if (isExternal) {
      return (
        <a
          ref={btnRef as React.Ref<HTMLAnchorElement>}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={combinedClasses}
        >
          {children}
        </a>
      );
    }
    return (
      <Link
        ref={btnRef as React.Ref<HTMLAnchorElement>}
        href={href}
        className={combinedClasses}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      ref={btnRef as React.Ref<HTMLButtonElement>}
      className={combinedClasses}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
