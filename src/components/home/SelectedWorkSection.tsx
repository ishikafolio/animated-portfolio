import React from "react";
import LogoFolioChapter from "./LogoFolioChapter";
import BrandIdentityChapter from "./BrandIdentityChapter";
import UiUxChapter from "./UiUxChapter";
import PackagingChapter from "./PackagingChapter";
import SocialMediaChapter from "./SocialMediaChapter";
import FlyerDesignChapter from "./FlyerDesignChapter";
import AiCreativesChapter from "./AiCreativesChapter";

export default function SelectedWorkSection() {
  return (
    <div id="work" className="relative scroll-mt-20">
      {/* Anchor alias so existing #portfolio links resolve here */}
      <div id="portfolio" className="absolute -top-24 pointer-events-none" aria-hidden="true" />

      {/* =========================================================================
          CHAPTER 01: LOGO FOLIO (Individual Marks · Geometric Aperture & Gallery)
          ========================================================================= */}
      <LogoFolioChapter />

      {/* =========================================================================
          CHAPTER 02: BRAND IDENTITY (Complete Systems · EarthKind · Vélora Dual Line)
          ========================================================================= */}
      <BrandIdentityChapter />

      {/* =========================================================================
          CHAPTER 03: UI/UX DESIGN (CareConnect Healthcare Mobile Prototype)
          ========================================================================= */}
      <UiUxChapter />

      {/* =========================================================================
          CHAPTER 04: PACKAGING DESIGN (Shared Podium Hero · Progelato · Aara · Glow Bite)
          ========================================================================= */}
      <PackagingChapter />

      {/* =========================================================================
          CHAPTER 05: SOCIAL MEDIA (Nike AirMax 90 · Red Bull · Frutta · October)
          ========================================================================= */}
      <SocialMediaChapter />

      {/* =========================================================================
          CHAPTER 06: FLYER DESIGN (Drag Studio · Streetwear · Naturéa · Street Roll · Dental)
          ========================================================================= */}
      <FlyerDesignChapter />

      {/* =========================================================================
          CHAPTER 07: AI CREATIVES (Spiti Himalayan Journeys · Interactive Concept Labs)
          ========================================================================= */}
      <AiCreativesChapter />
    </div>
  );
}
